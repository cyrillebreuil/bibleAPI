#!/bin/bash

# Fichier de sortie
output_file="seedVulgate.sql"

# Ouvrir le fichier de sortie
echo "BEGIN;" > $output_file

# Insérer les données dans la table "translations"
echo "
INSERT INTO translations (code, name, language, languageCode, regionCode) VALUES
('clementine', 'Clementine Latin Vulgate', 'Latin', 'lat', 'LAT')
ON CONFLICT (code) DO NOTHING;
" >> $output_file

# Fonction pour récupérer les données avec gestion des erreurs et des délais d'attente
fetch_data() {
    local url=$1
    local response
    local retries=5
    local delay=10

    for ((i=1; i<=retries; i++)); do
        response=$(curl -s "$url")
        if [[ "$response" == "Retry later" ]]; then
            echo "Received 'Retry later' response. Retrying in $delay seconds..."
            sleep $delay
        else
            echo "$response"
            return 0
        fi
    done

    echo "Error: Failed to fetch data from $url after $retries retries."
    return 1
}

# Récupérer la liste des livres
books_response=$(fetch_data "https://bible-api.com/data/clementine")

# Vérifier si la réponse est valide JSON
if ! echo "$books_response" | jq empty; then
    echo "Error: Invalid JSON response for books list"
    exit 1
fi

# Extraire les livres et les chapitres
books=$(echo "$books_response" | jq -r '.books[] | "\(.id) \(.name) \(.url)"')

# Lire la liste des livres et des chapitres
echo "$books" | while IFS= read -r line; do
    book_id=$(echo "$line" | awk '{print $1}')
    book_name=$(echo "$line" | awk '{print $2}')
    book_url=$(echo "$line" | awk '{print $3}')

    # Insérer les livres dans la table "books"
    echo "
    INSERT INTO books (testamentID) VALUES
    (1) -- Vous devrez peut-être ajuster le testamentID en fonction de votre schéma
    RETURNING id;
    " >> $output_file

    # Récupérer la liste des chapitres pour chaque livre
    chapters_response=$(fetch_data "$book_url")

    # Vérifier si la réponse est valide JSON
    if ! echo "$chapters_response" | jq empty; then
        echo "Error: Invalid JSON response for $book_name"
        continue
    fi

    # Extraire les chapitres
    chapters=$(echo "$chapters_response" | jq -r '.chapters[] | "\(.chapter) \(.url)"')

    # Insérer les traductions des livres
    echo "
    INSERT INTO bookTranslations (bookID, translationID, name) VALUES
    ((SELECT id FROM books WHERE id = (SELECT currval(pg_get_serial_sequence('books','id')))), (SELECT id FROM translations WHERE code = 'clementine'), '$book_name - Clementine')
    ON CONFLICT (bookID, translationID) DO NOTHING;
    " >> $output_file

    echo "$chapters" | while IFS= read -r chapter_line; do
        chapter_number=$(echo "$chapter_line" | awk '{print $1}')
        chapter_url=$(echo "$chapter_line" | awk '{print $2}')

        echo "Processing $book_name chapter $chapter_number..."

        # Récupérer les données de l'API pour chaque chapitre
        retries=5
        delay=10
        while true; do
            response=$(curl -s "$chapter_url")
            if [[ "$response" == "Retry later" ]]; then
                echo "Received 'Retry later' response for $book_name chapter $chapter_number. Retrying in $delay seconds..."
                sleep $delay
                ((retries--))
                if [ $retries -le 0 ]; then
                    echo "Error: Failed to fetch data for $book_name chapter $chapter_number after multiple retries."
                    break
                fi
            else
                break
            fi
        done

        # Vérifier si la réponse est vide
        if [ -z "$response" ]; then
            echo "Error: Empty response for $book_name chapter $chapter_number"
            continue
        fi

        # Vérifier si la réponse est valide JSON
        if ! echo "$response" | jq empty; then
            echo "Error: Invalid JSON response for $book_name chapter $chapter_number"
            echo "Response: $response"
            continue
        fi

        # Insérer les chapitres dans la table "chapters"
        echo "
        INSERT INTO chapters (bookID, number) VALUES
        ((SELECT id FROM books WHERE id = (SELECT currval(pg_get_serial_sequence('books','id')))), $chapter_number)
        RETURNING id;
        " >> $output_file

        # Insérer les traductions des chapitres
        echo "
        INSERT INTO chapterTranslations (chapterID, translationID, name) VALUES
        ((SELECT id FROM chapters WHERE id = (SELECT currval(pg_get_serial_sequence('chapters','id')))), (SELECT id FROM translations WHERE code = 'clementine'), '$book_name $chapter_number - Clementine')
        ON CONFLICT (chapterID, translationID) DO NOTHING;
        " >> $output_file

        # Utiliser jq pour extraire les versets et générer les instructions SQL
        echo "$response" | jq -r --arg chapter_id "$chapter_number" --arg translation_code "clementine" '
            .verses[] | "INSERT INTO verses (chapterID, translationID, number, text) VALUES ((SELECT id FROM chapters WHERE id = (SELECT currval(pg_get_serial_sequence('chapters','id')))), (SELECT id FROM translations WHERE code = \"\($translation_code)\"), \(.verse), \(.text | @sh)) ON CONFLICT (chapterID, translationID, number) DO NOTHING;"
        ' >> $output_file
    done
done

echo "COMMIT;" >> $output_file

echo "Fichier SQL généré : $output_file"

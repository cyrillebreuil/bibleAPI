#!/bin/bash

# Fichier de sortie
output_file="seedVulgate.sql"

# Ouvrir le fichier de sortie
echo "BEGIN;" > $output_file

# Insérer les données dans la table "translations"
echo "
INSERT INTO translations (code, name, language, languageCode, regionCode) VALUES
('clementine', 'Clementine Latin Vulgate', 'Latin', 'lat', 'VA')
ON CONFLICT (code) DO NOTHING;
" >> $output_file

# Insérer les traductions des testaments
echo "
INSERT INTO testamentTranslations (isNewTestament, translationID, name) VALUES
(FALSE, (SELECT id FROM translations WHERE code = 'clementine'), 'Vetus Testamentum'),
(TRUE, (SELECT id FROM translations WHERE code = 'clementine'), 'Novum Testamentum')
ON CONFLICT (isNewTestament, translationID) DO NOTHING;
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
            echo "Received 'Retry later' response. Retrying in $delay seconds..." >&2
            sleep $delay
        else
            echo "$response"
            return 0
        fi
    done

    echo "Error: Failed to fetch data from $url after $retries retries." >&2
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
books=$(echo "$books_response" | jq -r '.books[] | @base64')

# Lire la liste des livres et des chapitres
echo "$books" | while IFS= read -r line; do
    book=$(echo "$line" | base64 --decode)
    book_id=$(echo "$book" | jq -r '.id')
    book_name=$(echo "$book" | jq -r '.name')
    book_url=$(echo "$book" | jq -r '.url')

    # Insérer les traductions des livres
    echo "
    INSERT INTO bookTranslations (bookID, translationID, name) VALUES
    ('$book_id', (SELECT id FROM translations WHERE code = 'clementine'), '$book_name')
    ON CONFLICT (bookID, translationID) DO NOTHING;
    " >> $output_file

    # Récupérer la liste des chapitres pour chaque livre
    chapters_response=$(fetch_data "$book_url")

    # Vérifier si la réponse est valide JSON
    if ! echo "$chapters_response" | jq empty 2>/dev/null; then
        echo "Error: Invalid JSON response for $book_name" >&2
        echo "Response: $chapters_response" >&2  # Ajouter cette ligne pour afficher la réponse dans stderr
        continue
    fi

    # Extraire les chapitres
    chapters=$(echo "$chapters_response" | jq -r '.chapters[] | @base64')

    echo "$chapters" | while IFS= read -r chapter_line; do
        chapter=$(echo "$chapter_line" | base64 --decode)
        chapter_number=$(echo "$chapter" | jq -r '.chapter')
        chapter_url=$(echo "$chapter" | jq -r '.url')

        echo "Processing $book_name chapter $chapter_number..."

        # Récupérer les données de l'API pour chaque chapitre
        retries=5
        delay=10
        while true; do
            chapter_response=$(curl -s "$chapter_url")
            if [[ "$chapter_response" == "Retry later" ]]; then
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
        if [ -z "$chapter_response" ]; then
            echo "Error: Empty response for $book_name chapter $chapter_number"
            continue
        fi

        # Vérifier si la réponse est valide JSON
        if ! echo "$chapter_response" | jq empty; then
            echo "Error: Invalid JSON response for $book_name chapter $chapter_number"
            echo "Response: $chapter_response"  # Ajouter cette ligne pour afficher la réponse
            continue
        fi

        # Utiliser jq pour extraire les versets et générer les instructions SQL en utilisant une approche différente pour les guillemets
        echo "$chapter_response" | jq -r --arg book_id "$book_id" --arg chapter_number "$chapter_number" --arg translation_code "clementine" '
        .verses[] | "INSERT INTO verses (chapterID, translationID, number, text) VALUES ((SELECT id FROM chapters WHERE bookID = " + ("'\''" + $book_id + "'\''") + " AND number = " + $chapter_number + "), (SELECT id FROM translations WHERE code = " + ("'\''" + $translation_code + "'\''") + "), " + (.verse | tostring) + ", " + (.text | @sh) + ") ON CONFLICT (chapterID, translationID, number) DO NOTHING;"
        ' >> $output_file
    done
done

echo "COMMIT;" >> $output_file

echo "Fichier SQL généré : $output_file"

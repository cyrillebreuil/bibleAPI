#!/bin/bash

# Fichier de sortie
output_file="seedKJV.sql"

# Ouvrir le fichier de sortie
echo "BEGIN;" > $output_file

# Insérer les données dans la table "translations"
echo "
INSERT INTO translations (code, name, language, languageCode, regionCode) VALUES
('kjv', 'King James Version', 'English', 'eng', 'GB')
ON CONFLICT (code) DO NOTHING;
" >> $output_file

# Insérer les traductions des testaments
echo "
INSERT INTO testamentTranslations (isNewTestament, translationID, name) VALUES
(FALSE, (SELECT id FROM translations WHERE code = 'kjv'), 'Old Testament'),
(TRUE, (SELECT id FROM translations WHERE code = 'kjv'), 'New Testament')
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
books_response=$(fetch_data "https://bible-api.com/data/kjv")

# Vérifier si la réponse est valide JSON
if ! echo "$books_response" | jq empty 2>/dev/null; then
    echo "Error: Invalid JSON response for books list" >&2
    echo "Response: $books_response" >&2
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
    ('$book_id', (SELECT id FROM translations WHERE code = 'kjv'), '$book_name')
    ON CONFLICT (bookID, translationID) DO NOTHING;
    " >> $output_file

    # Récupérer la liste des chapitres pour chaque livre
    chapters_response=$(fetch_data "$book_url")

    # Vérifier si la réponse est valide JSON
    if ! echo "$chapters_response" | jq empty 2>/dev/null; then
        echo "Error: Invalid JSON response for $book_name" >&2
        echo "Response: $chapters_response" >&2
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
        chapter_response=$(fetch_data "$chapter_url")

        # Vérifier si la réponse est vide
        if [ -z "$chapter_response" ]; then
            echo "Error: Empty response for $book_name chapter $chapter_number" >&2
            continue
        fi

        # Vérifier si la réponse est valide JSON
        if ! echo "$chapter_response" | jq empty 2>/dev/null; then
            echo "Error: Invalid JSON response for $book_name chapter $chapter_number" >&2
            echo "Response: $chapter_response" >&2
            continue
        fi

        # Utiliser jq pour extraire les versets et générer les instructions SQL
        echo "$chapter_response" | jq -r --arg book_id "$book_id" --arg chapter_number "$chapter_number" --arg translation_code "kjv" '
        .verses[] | "INSERT INTO verses (chapterID, translationID, number, text) VALUES ((SELECT id FROM chapters WHERE bookID = \"\($book_id)\" AND number = \($chapter_number)), (SELECT id FROM translations WHERE code = \"\($translation_code)\"), \(.verse), \(.text | @sh)) ON CONFLICT (chapterID, translationID, number) DO NOTHING;"
        ' >> $output_file
    done
done

echo "COMMIT;" >> $output_file

echo "Fichier SQL généré : $output_file"

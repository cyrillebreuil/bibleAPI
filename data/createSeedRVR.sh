# Fichier de sortie
output_file="seedSpanishRVR.sql"

# Ouvrir le fichier de sortie
echo "BEGIN;" > $output_file

# Insérer les données dans la table "translations"
echo '
INSERT INTO "translations" ("code", "name", "language", "languageCode", "regionCode") VALUES
('"'"'rvr'"'"', '"'"'Reina Valera'"'"', '"'"'Spanish'"'"', '"'"'spa'"'"', '"'"'ES'"'"')
ON CONFLICT ("code") DO NOTHING;
' >> $output_file

# Insérer les traductions des testaments
echo '
INSERT INTO "testamentTranslations" ("isNewTestament", "translationID", "name") VALUES
(FALSE, (SELECT "id" FROM "translations" WHERE "code" = '"'"'rvr'"'"'), '"'"'Antiguo Testamento'"'"'),
(TRUE, (SELECT "id" FROM "translations" WHERE "code" = '"'"'rvr'"'"'), '"'"'Nuevo Testamento'"'"')
ON CONFLICT ("isNewTestament", "translationID") DO NOTHING;
' >> $output_file

# Mapping des IDs de livres
declare -A book_id_map=(
["gn"]="GEN" ["ex"]="EXO" ["lv"]="LEV" ["nm"]="NUM" ["dt"]="DEU" ["js"]="JOS" ["jud"]="JDG" ["rt"]="RUT"
["1sm"]="1SA" ["2sm"]="2SA" ["1kgs"]="1KI" ["2kgs"]="2KI" ["1ch"]="1CH" ["2ch"]="2CH" ["ezr"]="EZR"
["ne"]="NEH" ["et"]="EST" ["job"]="JOB" ["ps"]="PSA" ["prv"]="PRO" ["ec"]="ECC" ["so"]="SNG" ["is"]="ISA"
["jr"]="JER" ["lm"]="LAM" ["ez"]="EZK" ["dn"]="DAN" ["ho"]="HOS" ["jl"]="JOL" ["am"]="AMO" ["ob"]="OBA"
["jn"]="JON" ["mi"]="MIC" ["na"]="NAM" ["hk"]="HAB" ["zp"]="ZEP" ["hg"]="HAG" ["zc"]="ZEC" ["ml"]="MAL"
["mt"]="MAT" ["mk"]="MRK" ["lk"]="LUK" ["jo"]="JHN" ["act"]="ACT" ["rm"]="ROM" ["1co"]="1CO" ["2co"]="2CO"
["gl"]="GAL" ["eph"]="EPH" ["ph"]="PHP" ["cl"]="COL" ["1ts"]="1TH" ["2ts"]="2TH" ["1tm"]="1TI" ["2tm"]="2TI"
["tt"]="TIT" ["phm"]="PHM" ["hb"]="HEB" ["jm"]="JAS" ["1pe"]="1PE" ["2pe"]="2PE" ["1jo"]="1JN" ["2jo"]="2JN"
["3jo"]="3JN" ["jd"]="JUD" ["re"]="REV"
)

# Noms des livres en espagnol
declare -A book_names=(
["GEN"]="Génesis" ["EXO"]="Éxodo" ["LEV"]="Levítico" ["NUM"]="Números" ["DEU"]="Deuteronomio" ["JOS"]="Josué"
["JDG"]="Jueces" ["RUT"]="Rut" ["1SA"]="1 Samuel" ["2SA"]="2 Samuel" ["1KI"]="1 Reyes" ["2KI"]="2 Reyes"
["1CH"]="1 Crónicas" ["2CH"]="2 Crónicas" ["EZR"]="Esdras" ["NEH"]="Nehemías" ["EST"]="Ester" ["JOB"]="Job"
["PSA"]="Salmos" ["PRO"]="Proverbios" ["ECC"]="Eclesiastés" ["SNG"]="Cantares" ["ISA"]="Isaías" ["JER"]="Jeremías"
["LAM"]="Lamentaciones" ["EZK"]="Ezequiel" ["DAN"]="Daniel" ["HOS"]="Oseas" ["JOL"]="Joel" ["AMO"]="Amós"
["OBA"]="Abdías" ["JON"]="Jonás" ["MIC"]="Miqueas" ["NAM"]="Nahúm" ["HAB"]="Habacuc" ["ZEP"]="Sofonías"
["HAG"]="Hageo" ["ZEC"]="Zacarías" ["MAL"]="Malaquías" ["MAT"]="Mateo" ["MRK"]="Marcos" ["LUK"]="Lucas"
["JHN"]="Juan" ["ACT"]="Hechos" ["ROM"]="Romanos" ["1CO"]="1 Corintios" ["2CO"]="2 Corintios" ["GAL"]="Gálatas"
["EPH"]="Efesios" ["PHP"]="Filipenses" ["COL"]="Colosenses" ["1TH"]="1 Tesalonicenses" ["2TH"]="2 Tesalonicenses"
["1TI"]="1 Timoteo" ["2TI"]="2 Timoteo" ["TIT"]="Tito" ["PHM"]="Filemón" ["HEB"]="Hebreos" ["JAS"]="Santiago"
["1PE"]="1 Pedro" ["2PE"]="2 Pedro" ["1JN"]="1 Juan" ["2JN"]="2 Juan" ["3JN"]="3 Juan" ["JUD"]="Judas"
["REV"]="Apocalipsis"
)

# Télécharger la Bible en une seule fois
echo "Téléchargement de la Bible espagnole (RVR)..."
bible_json_file=$(mktemp)
curl -s "https://raw.githubusercontent.com/MaatheusGois/bible/main/versions/es/rvr.json" > "$bible_json_file"

if [ ! -s "$bible_json_file" ]; then
    echo "Error: Failed to download Bible data" >&2
    exit 1
fi

# Préparer les insertions pour les traductions de livres
echo "Préparation des insertions des traductions de livres..."
echo '
INSERT INTO "bookTranslations" ("bookID", "translationID", "name") VALUES' >> $output_file

# Traiter tous les livres pour insérer les traductions de livres
first_book=true
books_count=$(jq 'length' "$bible_json_file")

for ((book_index=0; book_index<books_count; book_index++)); do
    # Extraire l'ID du livre (format API)
    api_book_id=$(jq -r --arg idx "$book_index" '.[$idx|tonumber].id' "$bible_json_file")

    # Convertir en ID au format de votre base de données
    db_book_id=${book_id_map[$api_book_id]}

    # Vérifier si le mapping existe
    if [ -z "$db_book_id" ]; then
        echo "Warning: No mapping found for book ID $api_book_id. Skipping." >&2
        continue
    fi

    # Obtenir le nom espagnol du livre
    book_name=${book_names[$db_book_id]}

    echo "Processing book: $book_name ($db_book_id)"

    # Insérer dans la requête, avec une virgule sauf pour le premier livre
    if [ "$first_book" = true ]; then
        first_book=false
    else
        echo "," >> $output_file
    fi

    # Ajouter la ligne de valeurs
    echo "('$db_book_id', (SELECT \"id\" FROM \"translations\" WHERE \"code\" = 'rvr'), '$book_name')" >> $output_file
done

# Terminer la requête d'insertion des livres
echo '
ON CONFLICT ("bookID", "translationID") DO NOTHING;
' >> $output_file

# Traiter chaque livre pour insérer les versets
for ((book_index=0; book_index<books_count; book_index++)); do
    # Extraire l'ID du livre (format API)
    api_book_id=$(jq -r --arg idx "$book_index" '.[$idx|tonumber].id' "$bible_json_file")

    # Convertir en ID au format de votre base de données
    db_book_id=${book_id_map[$api_book_id]}

    # Vérifier si le mapping existe
    if [ -z "$db_book_id" ]; then
        continue
    fi

    # Obtenir le nom du livre
    book_name=${book_names[$db_book_id]}

    # Extraire les chapitres du livre
    chapters_count=$(jq --arg idx "$book_index" '.[$idx|tonumber].chapters | length' "$bible_json_file")

    echo "Book $db_book_id has $chapters_count chapters"

    # Traiter les chapitres par lots
    for ((chapter_index=0; chapter_index<chapters_count; chapter_index++)); do
        chapter_number=$((chapter_index + 1))
        echo "Processing chapter $chapter_number"

        # Extraire les versets du chapitre
        verses_count=$(jq --arg book_idx "$book_index" --arg chap_idx "$chapter_index" '.[$book_idx|tonumber].chapters[$chap_idx|tonumber] | length' "$bible_json_file")

        # Insérer tous les versets du chapitre en une seule requête
        if [ $verses_count -gt 0 ]; then
            echo "
INSERT INTO \"verses\" (\"chapterID\", \"translationID\", \"number\", \"text\") VALUES" >> $output_file

            first_verse=true

            for ((verse_index=0; verse_index<verses_count; verse_index++)); do
                verse_number=$((verse_index + 1))

                # Extraire le texte du verset
                verse_text=$(jq -r --arg book_idx "$book_index" --arg chap_idx "$chapter_index" --arg verse_idx "$verse_index" '.[$book_idx|tonumber].chapters[$chap_idx|tonumber][$verse_idx|tonumber]' "$bible_json_file")

                # Nettoyer le texte du verset
                verse_text=$(echo "$verse_text" | tr '\n\r' ' ' | sed -e 's/  */ /g' | sed -e 's/^ //' -e 's/ $//')

                # Échapper les apostrophes dans le texte du verset
                verse_text="${verse_text//\'/\'\'}"

                # Ajouter une virgule sauf pour le premier verset
                if [ "$first_verse" = true ]; then
                    first_verse=false
                else
                    echo "," >> $output_file
                fi

                # Ajouter la ligne de valeurs pour ce verset
                echo "((SELECT \"id\" FROM \"chapters\" WHERE \"bookID\" = '$db_book_id' AND \"number\" = $chapter_number),
(SELECT \"id\" FROM \"translations\" WHERE \"code\" = 'rvr'),
$verse_number, '$verse_text')" >> $output_file
            done

            # Terminer la requête d'insertion
            echo "
ON CONFLICT (\"chapterID\", \"translationID\", \"number\") DO NOTHING;" >> $output_file
        fi
    done
done

echo "COMMIT;" >> $output_file

# Nettoyer les fichiers temporaires
rm -f "$bible_json_file"

echo "Fichier SQL généré : $output_file"

# Fichier de sortie
output_file="seedRussianSynodal.sql"

# Ouvrir le fichier de sortie
echo "BEGIN;" > $output_file

# Insérer les données dans la table "translations" avec le code RUSV
echo '
INSERT INTO "translations" ("code", "name", "language", "languageCode", "regionCode") VALUES
('"'"'rusv'"'"', '"'"'Синодальный перевод'"'"', '"'"'Russian'"'"', '"'"'rus'"'"', '"'"'RU'"'"')
ON CONFLICT ("code") DO NOTHING;
' >> $output_file

# Insérer les traductions des testaments
echo '
INSERT INTO "testamentTranslations" ("isNewTestament", "translationID", "name") VALUES
(FALSE, (SELECT "id" FROM "translations" WHERE "code" = '"'"'rusv'"'"'), '"'"'Ветхий Завет'"'"'),
(TRUE, (SELECT "id" FROM "translations" WHERE "code" = '"'"'rusv'"'"'), '"'"'Новый Завет'"'"')
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

# Noms des livres en russe
declare -A book_names=(
["GEN"]="Бытие" ["EXO"]="Исход" ["LEV"]="Левит" ["NUM"]="Числа" ["DEU"]="Второзаконие" ["JOS"]="Иисус Навин"
["JDG"]="Книга Судей" ["RUT"]="Руфь" ["1SA"]="1-я Царств" ["2SA"]="2-я Царств" ["1KI"]="3-я Царств"
["2KI"]="4-я Царств" ["1CH"]="1-я Паралипоменон" ["2CH"]="2-я Паралипоменон" ["EZR"]="Ездра" ["NEH"]="Неемия"
["EST"]="Есфирь" ["JOB"]="Иов" ["PSA"]="Псалтирь" ["PRO"]="Притчи" ["ECC"]="Екклесиаст" ["SNG"]="Песни Песней"
["ISA"]="Исаия" ["JER"]="Иеремия" ["LAM"]="Плач Иеремии" ["EZK"]="Иезекииль" ["DAN"]="Даниил" ["HOS"]="Осия"
["JOL"]="Иоиль" ["AMO"]="Амос" ["OBA"]="Авдия" ["JON"]="Иона" ["MIC"]="Михей" ["NAM"]="Наум" ["HAB"]="Аввакум"
["ZEP"]="Софония" ["HAG"]="Аггей" ["ZEC"]="Захария" ["MAL"]="Малахия" ["MAT"]="От Матфея" ["MRK"]="От Марка"
["LUK"]="От Луки" ["JHN"]="От Иоанна" ["ACT"]="Деяния" ["ROM"]="К Римлянам" ["1CO"]="1-е Коринфянам"
["2CO"]="2-е Коринфянам" ["GAL"]="К Галатам" ["EPH"]="К Ефесянам" ["PHP"]="К Филиппийцам" ["COL"]="К Колоссянам"
["1TH"]="1-е Фессалоникийцам" ["2TH"]="2-е Фессалоникийцам" ["1TI"]="1-е Тимофею" ["2TI"]="2-е Тимофею"
["TIT"]="К Титу" ["PHM"]="К Филимону" ["HEB"]="К Евреям" ["JAS"]="Иакова" ["1PE"]="1-e Петра" ["2PE"]="2-e Петра"
["1JN"]="1-e Иоанна" ["2JN"]="2-e Иоанна" ["3JN"]="3-e Иоанна" ["JUD"]="Иуда" ["REV"]="Откровение"
)

# Télécharger toute la Bible en une seule requête
echo "Téléchargement de l'intégralité de la Bible russe (RUSV)..."
bible_url="https://raw.githubusercontent.com/MaatheusGois/bible/main/versions/ru/synodal.json"
bible_response=$(curl -s "$bible_url")

# Vérifier si la réponse est valide
if [ -z "$bible_response" ]; then
    echo "Error: Empty response for the Bible" >&2
    exit 1
fi

# Vérifier si la réponse est valide JSON
if ! echo "$bible_response" | jq empty 2>/dev/null; then
    echo "Error: Invalid JSON response" >&2
    exit 1
fi

# Insérer les traductions des livres en une seule requête
echo "Préparation des insertions des traductions de livres..."
book_translations_sql=""

# Traiter tous les livres
echo "$bible_response" | jq -r '.[] | @base64' | while read -r book_b64; do
    book=$(echo "$book_b64" | base64 --decode)
    api_book_id=$(echo "$book" | jq -r '.id')

    # Vérifier si le mapping existe
    db_book_id=${book_id_map[$api_book_id]}
    if [ -z "$db_book_id" ]; then
        echo "Warning: No mapping found for book ID $api_book_id. Skipping." >&2
        continue
    fi

    # Obtenir le nom russe du livre
    book_name=${book_names[$db_book_id]}
    echo "Processing book: $book_name ($db_book_id)"

    # Ajouter à la requête d'insertion
    book_translations_sql="${book_translations_sql}('$db_book_id', (SELECT \"id\" FROM \"translations\" WHERE \"code\" = 'rusv'), '$book_name'),\n"

    # Préparer les insertions de versets
    chapters_json=$(echo "$book" | jq -c '.chapters')
    chapters_count=$(echo "$book" | jq '.chapters | length')

    echo "Book $db_book_id has $chapters_count chapters"

    # Traiter les chapitres et versets en groupes pour optimiser les insertions
    verse_insert_batch=""
    verse_count=0

    for ((chapter_index=0; chapter_index<chapters_count; chapter_index++)); do
        chapter_number=$((chapter_index + 1))
        verses_array=$(echo "$book" | jq -r --arg idx "$chapter_index" '.chapters[$idx|tonumber] | @base64')

        # Extraire la liste des versets
        verses_list=$(echo "$verses_array" | base64 --decode | jq -r '.[] | @base64')

        verse_number=1
        echo "$verses_list" | while read -r verse_b64; do
            # Extraire et nettoyer le texte du verset
            verse_text=$(echo "$verse_b64" | base64 --decode)
            verse_text=$(echo "$verse_text" | tr '\n\r' ' ' | sed -e 's/  */ /g' | sed -e 's/^ //' -e 's/ $//')
            verse_text="${verse_text//\'/\'\'}"

            # Ajouter à la requête d'insertion par lots
            verse_insert_batch="${verse_insert_batch}((SELECT \"id\" FROM \"chapters\" WHERE \"bookID\" = '$db_book_id' AND \"number\" = $chapter_number), (SELECT \"id\" FROM \"translations\" WHERE \"code\" = 'rusv'), $verse_number, '$verse_text'),\n"

            verse_count=$((verse_count + 1))
            verse_number=$((verse_number + 1))

            # Écrire par lots de 100 versets
            if [ $verse_count -ge 100 ]; then
                # Enlever la dernière virgule
                verse_insert_batch="${verse_insert_batch%,\n}"

                # Écrire le lot dans le fichier
                echo "
                INSERT INTO \"verses\" (\"chapterID\", \"translationID\", \"number\", \"text\") VALUES
                $verse_insert_batch
                ON CONFLICT (\"chapterID\", \"translationID\", \"number\") DO NOTHING;
                " >> $output_file

                verse_insert_batch=""
                verse_count=0
            fi
        done

        echo "Processed chapter $chapter_number"
    done

    # Écrire le dernier lot s'il en reste
    if [ -n "$verse_insert_batch" ]; then
        # Enlever la dernière virgule
        verse_insert_batch="${verse_insert_batch%,\n}"

        # Écrire le lot dans le fichier
        echo "
        INSERT INTO \"verses\" (\"chapterID\", \"translationID\", \"number\", \"text\") VALUES
        $verse_insert_batch
        ON CONFLICT (\"chapterID\", \"translationID\", \"number\") DO NOTHING;
        " >> $output_file
    fi
done

# Finaliser l'insertion des traductions de livres
if [ -n "$book_translations_sql" ]; then
    # Enlever la dernière virgule
    book_translations_sql="${book_translations_sql%,\n}"

    echo "
    INSERT INTO \"bookTranslations\" (\"bookID\", \"translationID\", \"name\") VALUES
    $book_translations_sql
    ON CONFLICT (\"bookID\", \"translationID\") DO NOTHING;
    " >> $output_file
fi

echo "COMMIT;" >> $output_file

echo "Fichier SQL généré : $output_file"

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

# Mapping des IDs de livres de l'API vers les IDs de votre base de données
declare -A book_id_map
book_id_map["gn"]="GEN"
book_id_map["ex"]="EXO"
book_id_map["lv"]="LEV"
book_id_map["nm"]="NUM"
book_id_map["dt"]="DEU"
book_id_map["js"]="JOS"
book_id_map["jud"]="JDG"
book_id_map["rt"]="RUT"
book_id_map["1sm"]="1SA"
book_id_map["2sm"]="2SA"
book_id_map["1kgs"]="1KI"
book_id_map["2kgs"]="2KI"
book_id_map["1ch"]="1CH"
book_id_map["2ch"]="2CH"
book_id_map["ezr"]="EZR"
book_id_map["ne"]="NEH"
book_id_map["et"]="EST"
book_id_map["job"]="JOB"
book_id_map["ps"]="PSA"
book_id_map["prv"]="PRO"
book_id_map["ec"]="ECC"
book_id_map["so"]="SNG"
book_id_map["is"]="ISA"
book_id_map["jr"]="JER"
book_id_map["lm"]="LAM"
book_id_map["ez"]="EZK"
book_id_map["dn"]="DAN"
book_id_map["ho"]="HOS"
book_id_map["jl"]="JOL"
book_id_map["am"]="AMO"
book_id_map["ob"]="OBA"
book_id_map["jn"]="JON"
book_id_map["mi"]="MIC"
book_id_map["na"]="NAM"
book_id_map["hk"]="HAB"
book_id_map["zp"]="ZEP"
book_id_map["hg"]="HAG"
book_id_map["zc"]="ZEC"
book_id_map["ml"]="MAL"
book_id_map["mt"]="MAT"
book_id_map["mk"]="MRK"
book_id_map["lk"]="LUK"
book_id_map["jo"]="JHN"
book_id_map["act"]="ACT"
book_id_map["rm"]="ROM"
book_id_map["1co"]="1CO"
book_id_map["2co"]="2CO"
book_id_map["gl"]="GAL"
book_id_map["eph"]="EPH"
book_id_map["ph"]="PHP"
book_id_map["cl"]="COL"
book_id_map["1ts"]="1TH"
book_id_map["2ts"]="2TH"
book_id_map["1tm"]="1TI"
book_id_map["2tm"]="2TI"
book_id_map["tt"]="TIT"
book_id_map["phm"]="PHM"
book_id_map["hb"]="HEB"
book_id_map["jm"]="JAS"
book_id_map["1pe"]="1PE"
book_id_map["2pe"]="2PE"
book_id_map["1jo"]="1JN"
book_id_map["2jo"]="2JN"
book_id_map["3jo"]="3JN"
book_id_map["jd"]="JUD"
book_id_map["re"]="REV"

# Définir le mapping des noms de livres en russe (corrigé selon votre liste)
declare -A book_names
book_names["GEN"]="Бытие"
book_names["EXO"]="Исход"
book_names["LEV"]="Левит"
book_names["NUM"]="Числа"
book_names["DEU"]="Второзаконие"
book_names["JOS"]="Иисус Навин"
book_names["JDG"]="Книга Судей"
book_names["RUT"]="Руфь"
book_names["1SA"]="1-я Царств"
book_names["2SA"]="2-я Царств"
book_names["1KI"]="3-я Царств"
book_names["2KI"]="4-я Царств"
book_names["1CH"]="1-я Паралипоменон"
book_names["2CH"]="2-я Паралипоменон"
book_names["EZR"]="Ездра"
book_names["NEH"]="Неемия"
book_names["EST"]="Есфирь"
book_names["JOB"]="Иов"
book_names["PSA"]="Псалтирь"
book_names["PRO"]="Притчи"
book_names["ECC"]="Екклесиаст"
book_names["SNG"]="Песни Песней"
book_names["ISA"]="Исаия"
book_names["JER"]="Иеремия"
book_names["LAM"]="Плач Иеремии"
book_names["EZK"]="Иезекииль"
book_names["DAN"]="Даниил"
book_names["HOS"]="Осия"
book_names["JOL"]="Иоиль"
book_names["AMO"]="Амос"
book_names["OBA"]="Авдия"
book_names["JON"]="Иона"
book_names["MIC"]="Михей"
book_names["NAM"]="Наум"
book_names["HAB"]="Аввакум"
book_names["ZEP"]="Софония"
book_names["HAG"]="Аггей"
book_names["ZEC"]="Захария"
book_names["MAL"]="Малахия"
book_names["MAT"]="От Матфея"
book_names["MRK"]="От Марка"
book_names["LUK"]="От Луки"
book_names["JHN"]="От Иоанна"
book_names["ACT"]="Деяния"
book_names["ROM"]="К Римлянам"
book_names["1CO"]="1-е Коринфянам"
book_names["2CO"]="2-е Коринфянам"
book_names["GAL"]="К Галатам"
book_names["EPH"]="К Ефесянам"
book_names["PHP"]="К Филиппийцам"
book_names["COL"]="К Колоссянам"
book_names["1TH"]="1-е Фессалоникийцам"
book_names["2TH"]="2-е Фессалоникийцам"
book_names["1TI"]="1-е Тимофею"
book_names["2TI"]="2-е Тимофею"
book_names["TIT"]="К Титу"
book_names["PHM"]="К Филимону"
book_names["HEB"]="К Евреям"
book_names["JAS"]="Иакова"
book_names["1PE"]="1-e Петра"
book_names["2PE"]="2-e Петра"
book_names["1JN"]="1-e Иоанна"
book_names["2JN"]="2-e Иоанна"
book_names["3JN"]="3-e Иоанна"
book_names["JUD"]="Иуда"
book_names["REV"]="Откровение"

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

# Récupérer le nombre de livres
books_count=$(echo "$bible_response" | jq 'length')
echo "La Bible contient $books_count livres."

# Traiter chaque livre
for ((book_index=0; book_index<books_count; book_index++)); do
    # Extraire l'ID du livre (format API)
    api_book_id=$(echo "$bible_response" | jq -r --arg idx "$book_index" '.[$idx|tonumber].id')

    # Convertir en ID au format de votre base de données
    db_book_id=${book_id_map[$api_book_id]}

    # Vérifier si le mapping existe
    if [ -z "$db_book_id" ]; then
        echo "Warning: No mapping found for book ID $api_book_id. Skipping." >&2
        continue
    fi

    # Obtenir le nom russe du livre
    book_name=${book_names[$db_book_id]}

    echo "Processing book: $book_name ($db_book_id)"

    # Insérer les traductions des livres
    echo "
    INSERT INTO \"bookTranslations\" (\"bookID\", \"translationID\", \"name\") VALUES
    ('$db_book_id', (SELECT \"id\" FROM \"translations\" WHERE \"code\" = 'rusv'), '$book_name')
    ON CONFLICT (\"bookID\", \"translationID\") DO NOTHING;
    " >> $output_file

    # Extraire les chapitres du livre
    chapters_count=$(echo "$bible_response" | jq --arg idx "$book_index" '.[$idx|tonumber].chapters | length')

    echo "Book has $chapters_count chapters"

    # Traiter chaque chapitre
    for ((chapter_index=0; chapter_index<chapters_count; chapter_index++)); do
        chapter_number=$((chapter_index + 1))
        echo "Processing chapter $chapter_number"

        # Extraire les versets du chapitre
        verses_count=$(echo "$bible_response" | jq --arg book_idx "$book_index" --arg chap_idx "$chapter_index" '.[$book_idx|tonumber].chapters[$chap_idx|tonumber] | length')

        # Traiter chaque verset
        for ((verse_index=0; verse_index<verses_count; verse_index++)); do
            verse_number=$((verse_index + 1))

            # Extraire le texte du verset
            verse_text=$(echo "$bible_response" | jq -r --arg book_idx "$book_index" --arg chap_idx "$chapter_index" --arg verse_idx "$verse_index" '.[$book_idx|tonumber].chapters[$chap_idx|tonumber][$verse_idx|tonumber]')

            # Nettoyer le texte du verset
            verse_text=$(echo "$verse_text" | tr '\n\r' ' ' | sed -e 's/  */ /g' | sed -e 's/^ //' -e 's/ $//')

            # Échapper les apostrophes dans le texte du verset
            verse_text="${verse_text//\'/\'\'}"

            # Générer l'instruction SQL pour insérer le verset
            echo "
            INSERT INTO \"verses\" (\"chapterID\", \"translationID\", \"number\", \"text\") VALUES
            ((SELECT \"id\" FROM \"chapters\" WHERE \"bookID\" = '$db_book_id' AND \"number\" = $chapter_number),
            (SELECT \"id\" FROM \"translations\" WHERE \"code\" = 'rusv'),
            $verse_number, '$verse_text')
            ON CONFLICT (\"chapterID\", \"translationID\", \"number\") DO NOTHING;
            " >> $output_file
        done
    done
done

echo "COMMIT;" >> $output_file

echo "Fichier SQL généré : $output_file"

# Fichier de sortie
output_file="seedRussianSynodal.sql"

# Ouvrir le fichier de sortie
echo "BEGIN;" > $output_file

# Insérer les données dans la table "translations"
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

# Mapping des IDs de livres et noms
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

# Télécharger la Bible en une seule fois
echo "Téléchargement de la Bible russe..."
bible_json_file=$(mktemp)
curl -s "https://raw.githubusercontent.com/MaatheusGois/bible/main/versions/ru/synodal.json" > "$bible_json_file"

if [ ! -s "$bible_json_file" ]; then
    echo "Error: Failed to download Bible data" >&2
    exit 1
fi

# Créer temporairement la base de mapping JSON pour jq
cat > /tmp/book_mapping.json << EOF
{
  "gn": "GEN", "ex": "EXO", "lv": "LEV", "nm": "NUM", "dt": "DEU", "js": "JOS", "jud": "JDG", "rt": "RUT",
  "1sm": "1SA", "2sm": "2SA", "1kgs": "1KI", "2kgs": "2KI", "1ch": "1CH", "2ch": "2CH", "ezr": "EZR",
  "ne": "NEH", "et": "EST", "job": "JOB", "ps": "PSA", "prv": "PRO", "ec": "ECC", "so": "SNG", "is": "ISA",
  "jr": "JER", "lm": "LAM", "ez": "EZK", "dn": "DAN", "ho": "HOS", "jl": "JOL", "am": "AMO", "ob": "OBA",
  "jn": "JON", "mi": "MIC", "na": "NAM", "hk": "HAB", "zp": "ZEP", "hg": "HAG", "zc": "ZEC", "ml": "MAL",
  "mt": "MAT", "mk": "MRK", "lk": "LUK", "jo": "JHN", "act": "ACT", "rm": "ROM", "1co": "1CO", "2co": "2CO",
  "gl": "GAL", "eph": "EPH", "ph": "PHP", "cl": "COL", "1ts": "1TH", "2ts": "2TH", "1tm": "1TI", "2tm": "2TI",
  "tt": "TIT", "phm": "PHM", "hb": "HEB", "jm": "JAS", "1pe": "1PE", "2pe": "2PE", "1jo": "1JN", "2jo": "2JN",
  "3jo": "3JN", "jd": "JUD", "re": "REV"
}
EOF

cat > /tmp/book_names.json << EOF
{
  "GEN": "Бытие", "EXO": "Исход", "LEV": "Левит", "NUM": "Числа", "DEU": "Второзаконие", "JOS": "Иисус Навин",
  "JDG": "Книга Судей", "RUT": "Руфь", "1SA": "1-я Царств", "2SA": "2-я Царств", "1KI": "3-я Царств",
  "2KI": "4-я Царств", "1CH": "1-я Паралипоменон", "2CH": "2-я Паралипоменон", "EZR": "Ездра", "NEH": "Неемия",
  "EST": "Есфирь", "JOB": "Иов", "PSA": "Псалтирь", "PRO": "Притчи", "ECC": "Екклесиаст", "SNG": "Песни Песней",
  "ISA": "Исаия", "JER": "Иеремия", "LAM": "Плач Иеремии", "EZK": "Иезекииль", "DAN": "Даниил", "HOS": "Осия",
  "JOL": "Иоиль", "AMO": "Амос", "OBA": "Авдия", "JON": "Иона", "MIC": "Михей", "NAM": "Наум", "HAB": "Аввакум",
  "ZEP": "Софония", "HAG": "Аггей", "ZEC": "Захария", "MAL": "Малахия", "MAT": "От Матфея", "MRK": "От Марка",
  "LUK": "От Луки", "JHN": "От Иоанна", "ACT": "Деяния", "ROM": "К Римлянам", "1CO": "1-е Коринфянам",
  "2CO": "2-е Коринфянам", "GAL": "К Галатам", "EPH": "К Ефесянам", "PHP": "К Филиппийцам", "COL": "К Колоссянам",
  "1TH": "1-е Фессалоникийцам", "2TH": "2-е Фессалоникийцам", "1TI": "1-е Тимофею", "2TI": "2-е Тимофею",
  "TIT": "К Титу", "PHM": "К Филимону", "HEB": "К Евреям", "JAS": "Иакова", "1PE": "1-e Петра", "2PE": "2-e Петра",
  "1JN": "1-e Иоанна", "2JN": "2-e Иоанна", "3JN": "3-e Иоанна", "JUD": "Иуда", "REV": "Откровение"
}
EOF

# Extraction et traitement des données de livre
echo "Extraction des données des livres..."
echo 'INSERT INTO "bookTranslations" ("bookID", "translationID", "name") VALUES' >> $output_file

first_book=true
jq -r '.[] | .id' "$bible_json_file" | while read -r api_book_id; do
    # Vérifier si le mapping existe
    db_book_id=${book_id_map[$api_book_id]}
    if [ -z "$db_book_id" ]; then
        continue
    fi

    # Obtenir le nom russe du livre
    book_name=${book_names[$db_book_id]}

    # Ajouter la virgule si ce n'est pas le premier livre
    if $first_book; then
        first_book=false
    else
        echo "," >> $output_file
    fi

    echo "('$db_book_id', (SELECT \"id\" FROM \"translations\" WHERE \"code\" = 'rusv'), '$book_name')" >> $output_file
done

echo 'ON CONFLICT ("bookID", "translationID") DO NOTHING;' >> $output_file

# Maintenant, créons une fonction qui traite un livre à la fois pour les versets
process_book() {
    local book_json=$1
    local api_book_id=$(echo "$book_json" | jq -r '.id')
    local db_book_id=${book_id_map[$api_book_id]}

    # Vérifier si le mapping existe
    if [ -z "$db_book_id" ]; then
        return
    fi

    local book_name=${book_names[$db_book_id]}
    echo "Processing book: $book_name ($db_book_id)"

    # Obtenir le nombre de chapitres
    local chapters_count=$(echo "$book_json" | jq '.chapters | length')

    # Traiter chaque chapitre
    for ((chapter_index=0; chapter_index<chapters_count; chapter_index++)); do
        local chapter_number=$((chapter_index + 1))
        echo "  Chapter $chapter_number"

        # Extraire les versets du chapitre et générer une insertion par lot
        local verses_json=$(echo "$book_json" | jq -c --arg idx "$chapter_index" '.chapters[$idx|tonumber]')
        local verses_count=$(echo "$verses_json" | jq 'length')

        if [ "$verses_count" -gt 0 ]; then
            # Commencer l'insertion par lots pour ce chapitre
            echo "INSERT INTO \"verses\" (\"chapterID\", \"translationID\", \"number\", \"text\") VALUES" >> $output_file

            local first_verse=true

            for ((verse_index=0; verse_index<verses_count; verse_index++)); do
                local verse_number=$((verse_index + 1))
                local verse_text=$(echo "$verses_json" | jq -r --arg idx "$verse_index" '.[$idx|tonumber]')

                # Nettoyer et échapper le texte
                verse_text=$(echo "$verse_text" | tr '\n\r' ' ' | sed -e 's/  */ /g' | sed -e 's/^ //' -e 's/ $//')
                verse_text="${verse_text//\'/\'\'}"

                # Ajouter une virgule si ce n'est pas le premier verset
                if $first_verse; then
                    first_verse=false
                else
                    echo "," >> $output_file
                fi

                # Écrire le verset
                echo "((SELECT \"id\" FROM \"chapters\" WHERE \"bookID\" = '$db_book_id' AND \"number\" = $chapter_number),
(SELECT \"id\" FROM \"translations\" WHERE \"code\" = 'rusv'),
$verse_number, '$verse_text')" >> $output_file
            done

            # Terminer l'insertion par lots
            echo "ON CONFLICT (\"chapterID\", \"translationID\", \"number\") DO NOTHING;" >> $output_file
        fi
    done
}

# Traiter les livres un par un, mais beaucoup plus efficacement
echo "Traitement des versets..."
jq -c '.[]' "$bible_json_file" | while read -r book_json; do
    process_book "$book_json"
done

echo "COMMIT;" >> $output_file

# Nettoyer les fichiers temporaires
rm -f "$bible_json_file" /tmp/book_mapping.json /tmp/book_names.json

echo "Fichier SQL généré : $output_file"

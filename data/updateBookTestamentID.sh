#!/bin/bash

# Fichier de sortie
output_file="updateTestamentIDs.sql"

# Ouvrir le fichier de sortie
echo "BEGIN;" > $output_file

# Définir les testamentID pour chaque livre en latin
declare -A testament_ids
testament_ids=(
    ["Genesis"]=1
    ["Exodus"]=1
    ["Leviticus"]=1
    ["Numeri"]=1
    ["Deuteronomium"]=1
    ["Iosue"]=1
    ["Iudicum"]=1
    ["Ruth"]=1
    ["1 Samuelis"]=1
    ["2 Samuelis"]=1
    ["1 Regum"]=1
    ["2 Regum"]=1
    ["1 Paralipomenon"]=1
    ["2 Paralipomenon"]=1
    ["Esdrae"]=1
    ["Nehemiae"]=1
    ["Esther"]=1
    ["Iob"]=1
    ["Psalmi"]=1
    ["Proverbia"]=1
    ["Ecclesiastes"]=1
    ["Canticum Canticorum"]=1
    ["Isaias"]=1
    ["Ieremias"]=1
    ["Lamentationes"]=1
    ["Ezechiel"]=1
    ["Daniel"]=1
    ["Osee"]=1
    ["Ioel"]=1
    ["Amos"]=1
    ["Abdias"]=1
    ["Ionas"]=1
    ["Michaeas"]=1
    ["Nahum"]=1
    ["Habacuc"]=1
    ["Sophonias"]=1
    ["Aggaeus"]=1
    ["Zacharias"]=1
    ["Malachias"]=1
    ["Matthaeus"]=2
    ["Marcus"]=2
    ["Lucas"]=2
    ["Ioannes"]=2
    ["Actus Apostolorum"]=2
    ["Ad Romanos"]=2
    ["1 ad Corinthios"]=2
    ["2 ad Corinthios"]=2
    ["Ad Galatas"]=2
    ["Ad Ephesios"]=2
    ["Ad Philippenses"]=2
    ["Ad Colossenses"]=2
    ["1 ad Thessalonicenses"]=2
    ["2 ad Thessalonicenses"]=2
    ["1 ad Timotheum"]=2
    ["2 ad Timotheum"]=2
    ["Ad Titum"]=2
    ["Ad Philemonem"]=2
    ["Ad Hebraeos"]=2
    ["Iacobi"]=2
    ["1 Petri"]=2
    ["2 Petri"]=2
    ["1 Ioannis"]=2
    ["2 Ioannis"]=2
    ["3 Ioannis"]=2
    ["Iudae"]=2
    ["Apocalypsis"]=2
)

# Mettre à jour les testamentID pour chaque livre en utilisant les noms dans bookTranslations
for book_name in "${!testament_ids[@]}"; do
    testament_id=${testament_ids[$book_name]}
    echo "
    UPDATE books SET testamentID = $testament_id
    WHERE id = (SELECT bookID FROM bookTranslations WHERE name LIKE '$book_name%');
    " >> $output_file
done

echo "COMMIT;" >> $output_file

echo "Fichier SQL généré : $output_file"

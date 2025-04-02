-- Clear existing data and reset identity sequences
TRUNCATE TABLE "verses" RESTART IDENTITY CASCADE;

TRUNCATE TABLE "chapterTranslations" RESTART IDENTITY CASCADE;

TRUNCATE TABLE "bookTranslations" RESTART IDENTITY CASCADE;

TRUNCATE TABLE "testamentTranslations" RESTART IDENTITY CASCADE;

TRUNCATE TABLE "translations" RESTART IDENTITY CASCADE;

TRUNCATE TABLE "chapters" RESTART IDENTITY CASCADE;

TRUNCATE TABLE "books" RESTART IDENTITY CASCADE;

TRUNCATE TABLE "testaments" RESTART IDENTITY CASCADE;

-- Insert testaments
INSERT INTO
	"testaments" ("isNewTestament")
VALUES
	(FALSE),
	(TRUE);

-- Insert books
INSERT INTO
	"books" ("testamentID")
VALUES
	(1),
	(1),
	(2);

-- Insert chapters
INSERT INTO
	"chapters" ("bookID", "number")
VALUES
	(1, 1),
	(1, 2);

-- Insert translations
INSERT INTO
	"translations" ("name", "language", "languageCode", "regionCode")
VALUES
	('King James Version', 'English', 'en', 'US'),
	('Louis Segond', 'French', 'fr', 'FR');

-- Insert testament translations
INSERT INTO
	"testamentTranslations" ("testamentID", "translationID", "name")
VALUES
	(1, 1, 'Old Testament'),
	(1, 2, 'Ancien Testament'),
	(2, 1, 'New Testament'),
	(2, 2, 'Nouveau Testament');

-- Insert book translations
INSERT INTO
	"bookTranslations" ("bookID", "translationID", "name")
VALUES
	(1, 1, 'Genesis'),
	(1, 2, 'Genèse');

-- Insert chapter translations
INSERT INTO
	"chapterTranslations" ("chapterID", "translationID", "name")
VALUES
	(1, 1, 'Chapter 1'),
	(1, 2, 'Chapitre 1'),
	(2, 1, 'Chapter 2'),
	(2, 2, 'Chapitre 2');

-- Insert verses
INSERT INTO
	"verses" ("chapterID", "translationID", "number", "text")
VALUES
	(
		1,
		1,
		1,
		'In the beginning God created the heaven and the earth.'
	),
	(
		1,
		1,
		2,
		'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.'
	),
	(
		1,
		2,
		1,
		'Au commencement, Dieu créa les cieux et la terre.'
	),
	(
		1,
		2,
		2,
		'La terre était informe et vide: il y avait des ténèbres à la surface de l’abîme, et l’esprit de Dieu se mouvait au-dessus des eaux.'
	);

import request from "supertest";

// URL de votre API en cours d'exécution
const API_URL = "http://localhost:3000";

// Utiliser les codes réels disponibles dans votre base de données
const TRANSLATION_CODE = "kjv";
const BOOK_CODE = "GEN";
const CHAPTER_NUMBER = "1";
const VERSE_NUMBER = "1";

describe("Bible API Tests", () => {
	/*
	 * Tests du contrôleur Translation
	 */
	describe("Translation Controller", () => {
		test("GET / should return API information", async () => {
			const response = await request(API_URL).get("/");
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("API Infos");
			expect(response.body["API Infos"]).toHaveProperty("translations");
			expect(Array.isArray(response.body["API Infos"].translations)).toBe(
				true,
			);
		});
	});

	/*
	 * Tests du contrôleur Book
	 */
	describe("Book Controller", () => {
		test("GET /:translationCode should return books for a translation", async () => {
			const response = await request(API_URL).get(`/${TRANSLATION_CODE}`);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("translation");
			expect(response.body).toHaveProperty("books");
			expect(Array.isArray(response.body.books)).toBe(true);
		});

		test("GET /:invalidTranslationCode should return 404", async () => {
			const response = await request(API_URL).get("/invalidcode");
			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty("error");
		});
	});

	/*
	 * Tests du contrôleur Chapter
	 */
	describe("Chapter Controller", () => {
		test("GET /:translationCode/:bookID should return chapters for a book", async () => {
			const response = await request(API_URL).get(
				`/${TRANSLATION_CODE}/${BOOK_CODE}`,
			);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("book");
			expect(response.body).toHaveProperty("chapters");
			expect(Array.isArray(response.body.chapters)).toBe(true);
		});

		test("GET /:translationCode/:invalidBookID should return 404", async () => {
			const response = await request(API_URL).get(
				`/${TRANSLATION_CODE}/INVALID`,
			);
			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty("error");
		});
	});

	/*
	 * Tests du contrôleur Verse
	 */
	describe("Verse Controller", () => {
		test("GET /:translationCode/:bookID/:chapterNumber should return verses from a chapter", async () => {
			const response = await request(API_URL).get(
				`/${TRANSLATION_CODE}/${BOOK_CODE}/${CHAPTER_NUMBER}`,
			);
			expect(response.status).toBe(200);
			expect(Array.isArray(response.body)).toBe(true);
			if (response.body.length > 0) {
				expect(response.body[0]).toHaveProperty("number");
				expect(response.body[0]).toHaveProperty("text");
			}
		});

		test("GET /:translationCode/:bookID/:chapterNumber/:verseNumber should return a single verse", async () => {
			const response = await request(API_URL).get(
				`/${TRANSLATION_CODE}/${BOOK_CODE}/${CHAPTER_NUMBER}/${VERSE_NUMBER}`,
			);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("text");
		});

		test("GET /:translationCode/randomverse should return a random verse", async () => {
			const response = await request(API_URL).get(
				`/${TRANSLATION_CODE}/randomverse`,
			);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("verse");
			expect(response.body).toHaveProperty("reference");
			expect(response.body.verse).toHaveProperty("text");
		});

		test("GET /:translationCode/:bookID/randomverse should return a random verse from a book", async () => {
			const response = await request(API_URL).get(
				`/${TRANSLATION_CODE}/${BOOK_CODE}/randomverse`,
			);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("text");
			expect(response.body).toHaveProperty("number");
		});
	});

	/*
	 * Tests d'intégration pour vérifier la logique métier
	 */
	describe("Integration Tests", () => {
		test("Verse returned should belong to the requested book and chapter", async () => {
			// Obtenir un verset spécifique
			const verseResponse = await request(API_URL).get(
				`/${TRANSLATION_CODE}/${BOOK_CODE}/${CHAPTER_NUMBER}/${VERSE_NUMBER}`,
			);
			expect(verseResponse.status).toBe(200);

			// Obtenir tous les versets du chapitre
			const chapterVersesResponse = await request(API_URL).get(
				`/${TRANSLATION_CODE}/${BOOK_CODE}/${CHAPTER_NUMBER}`,
			);
			expect(chapterVersesResponse.status).toBe(200);

			// Vérifier que le verset est bien dans le chapitre
			const verseText = verseResponse.body.text;
			const verseFound = chapterVersesResponse.body.some(
				(v) =>
					v.text === verseText &&
					v.number.toString() === VERSE_NUMBER,
			);
			expect(verseFound).toBe(true);
		});

		test("Random verse should have valid reference format", async () => {
			const response = await request(API_URL).get(
				`/${TRANSLATION_CODE}/randomverse`,
			);
			expect(response.status).toBe(200);

			// Vérifier le format de la référence (ex: "GEN 1:1")
			const referenceRegex = /^[A-Z0-9]{3,4} \d+:\d+$/;
			expect(referenceRegex.test(response.body.reference)).toBe(true);
		});
	});
});

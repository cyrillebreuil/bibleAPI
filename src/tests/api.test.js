import request from "supertest";

// URL de votre API en cours d'exécution
const API_URL = "http://localhost:3000";

// Utiliser les codes réels disponibles dans votre base de données
const TRANSLATION_CODE = "kjv";
const INVALID_TRANSLATION = "xyz123";
const BOOK_CODE = "GEN";
const INVALID_BOOK = "XYZ";
const CHAPTER_NUMBER = "1";
const INVALID_CHAPTER = "999";
const VERSE_NUMBER = "1";
const INVALID_VERSE = "999";

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

			// Vérifier que les statistiques sont présentes pour chaque traduction
			const firstTranslation = response.body["API Infos"].translations[0];
			expect(firstTranslation).toHaveProperty("stats");
			expect(firstTranslation.stats).toHaveProperty("bookCount");
			expect(firstTranslation.stats).toHaveProperty("chapterCount");
			expect(firstTranslation.stats).toHaveProperty("verseCount");
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

			// Vérifier que chaque livre contient les informations attendues
			const firstBook = response.body.books[0];
			expect(firstBook).toHaveProperty("bookID");
			expect(firstBook).toHaveProperty("name");
			expect(firstBook).toHaveProperty("testament");

			// Vérifier les statistiques de traduction
			expect(response.body.translation).toHaveProperty("stats");
			expect(response.body.translation.stats).toHaveProperty("bookCount");
			expect(response.body.translation.stats).toHaveProperty(
				"verseCount",
			);
			expect(response.body.translation.stats).toHaveProperty(
				"oldTestamentCount",
			);
			expect(response.body.translation.stats).toHaveProperty(
				"newTestamentCount",
			);
		});

		test("GET /:invalidTranslationCode should return 404 with appropriate error structure", async () => {
			const response = await request(API_URL).get(
				`/${INVALID_TRANSLATION}`,
			);
			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty("status", 404);
			expect(response.body).toHaveProperty(
				"message",
				"Translation not found",
			);
			expect(response.body).toHaveProperty("details");
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

			// Vérifier les détails du livre
			expect(response.body.book).toHaveProperty("id");
			expect(response.body.book).toHaveProperty("name");
			expect(response.body.book).toHaveProperty("testament");
			expect(response.body.book).toHaveProperty(
				"Total Number Of Chapters",
			);

			// Vérifier que les chapitres ont la structure attendue
			if (response.body.chapters.length > 0) {
				const firstChapter = response.body.chapters[0];
				expect(firstChapter).toHaveProperty("number");
				expect(firstChapter).toHaveProperty("bookID");
			}
		});

		test("GET /:translationCode/:invalidBookID should return 404", async () => {
			const response = await request(API_URL).get(
				`/${TRANSLATION_CODE}/${INVALID_BOOK}`,
			);
			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty("status", 404);
			expect(response.body).toHaveProperty("message", "Book not found");
		});

		test("GET /:invalidTranslationCode/:bookID should return 404", async () => {
			const response = await request(API_URL).get(
				`/${INVALID_TRANSLATION}/${BOOK_CODE}`,
			);
			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty("status", 404);
			expect(response.body).toHaveProperty(
				"message",
				"Translation not found",
			);
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

		test("GET /:translationCode/:bookID/:invalidChapterNumber should return 404", async () => {
			const response = await request(API_URL).get(
				`/${TRANSLATION_CODE}/${BOOK_CODE}/${INVALID_CHAPTER}`,
			);
			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty("status", 404);
		});

		test("GET /:translationCode/:bookID/:chapterNumber/:verseNumber should return a single verse", async () => {
			const response = await request(API_URL).get(
				`/${TRANSLATION_CODE}/${BOOK_CODE}/${CHAPTER_NUMBER}/${VERSE_NUMBER}`,
			);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("text");
		});

		test("GET /:translationCode/:bookID/:chapterNumber/:invalidVerseNumber should return 404", async () => {
			const response = await request(API_URL).get(
				`/${TRANSLATION_CODE}/${BOOK_CODE}/${CHAPTER_NUMBER}/${INVALID_VERSE}`,
			);
			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty("status", 404);
			expect(response.body).toHaveProperty("message", "Verse not found");
		});

		test("GET /:translationCode/randomverse should return a random verse", async () => {
			const response = await request(API_URL).get(
				`/${TRANSLATION_CODE}/randomverse`,
			);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("verse");
			expect(response.body).toHaveProperty("reference");
			expect(response.body.verse).toHaveProperty("text");
			expect(response.body).toHaveProperty("book");
			expect(response.body).toHaveProperty("chapter");
			expect(response.body).toHaveProperty("testament");
			expect(response.body).toHaveProperty("translation");
		});

		test("GET /:translationCode/randomverse with testament filter should work", async () => {
			const response = await request(API_URL).get(
				`/${TRANSLATION_CODE}/randomverse?testament=new`,
			);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("testament");
			expect(response.body.testament.isNew).toBe(true);
		});

		test("GET /:translationCode/randomverse with bookID filter should work", async () => {
			const response = await request(API_URL).get(
				`/${TRANSLATION_CODE}/randomverse?bookID=${BOOK_CODE}`,
			);
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("book");
			expect(response.body.book.id).toBe(BOOK_CODE);
		});
	});

	/*
	 * Tests du contrôleur Search
	 */
	describe("Search Controller", () => {
		test("GET /search with query parameter should return matching verses", async () => {
			const response = await request(API_URL).get("/search?q=beginning");
			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("search");
			expect(response.body).toHaveProperty("results");
			expect(response.body.results).toHaveProperty("verses");
			expect(Array.isArray(response.body.results.verses)).toBe(true);

			// Vérifier la structure d'un résultat de recherche
			if (response.body.results.verses.length > 0) {
				const firstResult = response.body.results.verses[0];
				expect(firstResult).toHaveProperty("reference");
				expect(firstResult).toHaveProperty("book");
				expect(firstResult).toHaveProperty("chapter");
				expect(firstResult).toHaveProperty("verse");
				expect(firstResult).toHaveProperty("text");
				expect(firstResult).toHaveProperty("translation");
				expect(firstResult).toHaveProperty("highlights");
			}
		});

		test("GET /search without query parameter should return 400", async () => {
			const response = await request(API_URL).get("/search");
			expect(response.status).toBe(400);
			expect(response.body).toHaveProperty("status", 400);
			expect(response.body).toHaveProperty(
				"message",
				"A search term is required",
			);
		});

		test("GET /search with non-existent query should return 404", async () => {
			const response = await request(API_URL).get(
				"/search?q=xyznonexistent123",
			);
			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty("status", 404);
			expect(response.body).toHaveProperty("message");
			expect(response.body.message).toContain(
				"No verses found for search",
			);
		});

		test("GET /search with translation filter should work", async () => {
			const response = await request(API_URL).get(
				`/search?q=God&translation=${TRANSLATION_CODE}`,
			);
			expect(response.status).toBe(200);
			const firstResult = response.body.results.verses[0];
			expect(firstResult.translation.code).toBe(TRANSLATION_CODE);
		});

		test("GET /search with exact parameter should work", async () => {
			const response = await request(API_URL).get(
				"/search?q=in the&exact=true",
			);
			expect(response.status).toBe(200);
			expect(response.body.search.options.exact).toBe(true);
		});

		test("GET /search with OR operator should work", async () => {
			const response = await request(API_URL).get(
				"/search?q=God heaven&operator=or",
			);
			expect(response.status).toBe(200);
			expect(response.body.search.options.operator).toBe("OR");
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

		test("Search results should contain the search term", async () => {
			const searchTerm = "beginning";
			const response = await request(API_URL).get(
				`/search?q=${searchTerm}`,
			);
			expect(response.status).toBe(200);

			// Vérifier que le premier résultat contient bien le terme recherché
			const firstResult = response.body.results.verses[0];
			expect(firstResult.text.toLowerCase()).toContain(
				searchTerm.toLowerCase(),
			);

			// Vérifier que les highlights contiennent le terme recherché
			const highlight = firstResult.highlights.find(
				(h) => h.term.toLowerCase() === searchTerm.toLowerCase(),
			);
			expect(highlight).toBeDefined();
			expect(highlight.count).toBeGreaterThan(0);
		});

		test("Book listing should include both testaments", async () => {
			const response = await request(API_URL).get(`/${TRANSLATION_CODE}`);
			expect(response.status).toBe(200);

			const books = response.body.books;

			// Vérifier qu'il y a des livres de l'Ancien Testament
			const oldTestamentBooks = books.filter((b) =>
				b.testament.toLowerCase().includes("old"),
			);
			expect(oldTestamentBooks.length).toBeGreaterThan(0);

			// Vérifier qu'il y a des livres du Nouveau Testament
			const newTestamentBooks = books.filter((b) =>
				b.testament.toLowerCase().includes("new"),
			);
			expect(newTestamentBooks.length).toBeGreaterThan(0);

			// Vérifier que le total correspond
			expect(oldTestamentBooks.length + newTestamentBooks.length).toBe(
				books.length,
			);
		});
	});

	/*
	 * Tests de gestion d'erreurs
	 */
	describe("Error Handling", () => {
		test("Non-existent endpoint should return 404 with proper structure", async () => {
			const response = await request(API_URL).get("/nonexistentendpoint");
			expect(response.status).toBe(404);
			expect(response.body).toHaveProperty("status", 404);
			expect(response.body).toHaveProperty("message");
		});

		test("Invalid parameters should return appropriate error messages", async () => {
			// Test avec une traduction invalide
			const translationResponse = await request(API_URL).get(
				`/${INVALID_TRANSLATION}`,
			);
			expect(translationResponse.status).toBe(404);
			expect(translationResponse.body).toHaveProperty(
				"message",
				"Translation not found",
			);

			// Test avec un livre invalide
			const bookResponse = await request(API_URL).get(
				`/${TRANSLATION_CODE}/${INVALID_BOOK}`,
			);
			expect(bookResponse.status).toBe(404);
			expect(bookResponse.body).toHaveProperty(
				"message",
				"Book not found",
			);
		});
	});
});

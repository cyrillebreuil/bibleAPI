import {
	BookTranslation,
	Translation,
	Verse,
	Book,
	TestamentTranslation,
} from "../../models/Associations.js";

const getAllBooksFromOneTranslation = async (req, res) => {
	const { translationCode } = req.params;
	const translation = await Translation.findOne({
		where: {
			code: translationCode,
		},
	});
	if (!translation) {
		const error = new Error("Translation not found");
		error.status = 404;
		error.details = { requestedCode: translationCode };
		throw error;
	}
	const [
		verseCount,
		bookCount,
		oldTestamentCount,
		newTestamentCount,
		books,
		testamentTranslations,
	] = await Promise.all([
		Verse.count({ where: { translationID: translation.id } }),
		BookTranslation.count({ where: { translationID: translation.id } }),
		BookTranslation.count({
			where: { translationID: translation.id },
			include: [
				{ model: Book, as: "book", where: { isNewTestament: false } },
			],
		}),
		BookTranslation.count({
			where: { translationID: translation.id },
			include: [
				{ model: Book, as: "book", where: { isNewTestament: true } },
			],
		}),
		BookTranslation.findAll({
			where: { translationID: translation.id },
			attributes: ["bookID", "name"],
			include: [
				{
					model: Book,
					as: "book",
					attributes: ["isNewTestament"],
				},
			],
		}),
		TestamentTranslation.findAll({
			where: { translationID: translation.id },
			attributes: ["isNewTestament", "name"],
		}),
	]);

	// Récupérer les noms des testaments
	const oldTestamentName =
		testamentTranslations.find((t) => !t.isNewTestament)?.name || "Old";
	const newTestamentName =
		testamentTranslations.find((t) => t.isNewTestament)?.name || "New";
	const enhancedBooks = books.map((bookTranslation) => {
		return {
			bookID: bookTranslation.bookID,
			name: bookTranslation.name,
			testament: bookTranslation.book.isNewTestament
				? newTestamentName
				: oldTestamentName,
		};
	});
	const enhancedTranslation = {
		...translation.toJSON(),
		stats: {
			bookCount,
			verseCount,
			newTestamentCount,
			oldTestamentCount,
		},
	};
	const responseObject = {
		translation: enhancedTranslation,
		books: enhancedBooks,
	};
	res.json(responseObject);
};

export { getAllBooksFromOneTranslation };

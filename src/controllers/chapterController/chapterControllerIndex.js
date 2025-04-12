import {
	Chapter,
	Translation,
	BookTranslation,
	Book,
	TestamentTranslation,
} from "../../models/Associations.js";

const getAllChaptersFromBook = async (req, res) => {
	const { bookID, translationCode } = req.params;
	const translation = await Translation.findOne({
		where: {
			code: translationCode,
		},
	});
	if (!translation) {
		return res.status(404).json({ error: "Translation not found" });
	}
	//Find Book first
	const book = await Book.findOne({
		where: {
			id: bookID.toUpperCase(),
		},
	});
	if (!book) {
		return res.status(404).json({ error: "Book not found" });
	}
	// Exécuter les requêtes en parallèle
	const [chapters, chapterCount, bookTranslation, testamentTranslation] =
		await Promise.all([
			Chapter.findAll({
				where: { bookID: bookID.toUpperCase() },
				attributes: ["number", "bookID"],
				order: [["number", "ASC"]],
			}),
			Chapter.count({ where: { bookID: bookID.toUpperCase() } }),
			BookTranslation.findOne({
				where: {
					bookID: bookID.toUpperCase(),
					translationID: translation.id,
				},
				attributes: ["bookID", "name"],
			}),
			TestamentTranslation.findOne({
				where: {
					isNewTestament: book.isNewTestament,
					translationID: translation.id,
				},
				attributes: ["name"],
			}),
		]);
	if (!chapters || chapters.length === 0) {
		return res.status(404).json({ error: "Chapters not found" });
	}
	const responseObject = {
		book: {
			id: bookTranslation.bookID,
			name: bookTranslation.name,
			testament: testamentTranslation.name,
			"Total Number Of Chapters": chapterCount,
		},
		chapters,
	};

	res.status(200).json(responseObject);
};

export { getAllChaptersFromBook };

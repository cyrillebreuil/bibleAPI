import {
	Chapter,
	Translation,
	BookTranslation,
	Book,
	TestamentTranslation,
	Verse,
} from "../../models/Associations.js";

const getAllChaptersFromBook = async (req, res) => {
	const { bookID, translationCode } = req.params;
	const translation = await Translation.findOne({
		where: {
			code: translationCode,
		},
	});
	if (!translation) {
		const error = new Error("Translation not found");
		error.status = 404;
		error.details = `The translation with code ${translationCode} was not found.`;
		throw error;
	}
	//Find Book first
	const book = await Book.findOne({
		where: {
			id: bookID.toUpperCase(),
		},
	});
	if (!book) {
		const error = new Error("Book not found");
		error.status = 404;
		error.details = `The book with ID ${bookID} was not found.`;
		throw error;
	}
	// Exécuter les requêtes en parallèle
	const [chapters, chapterCount, bookTranslation, testamentTranslation] =
		await Promise.all([
			Chapter.findAll({
				where: { bookID: bookID.toUpperCase() },
				attributes: ["number", "bookID"],
				order: [["number", "ASC"]],
			}),
			Chapter.count({
				distinct: true,
				include: [
					{
						model: Verse,
						as: "verses",
						required: true,
						where: {
							translationID: translation.id,
						},
						attributes: [],
					},
				],
				where: {
					bookID: bookID.toUpperCase(),
				},
			}),
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
	if (!bookTranslation) {
		const error = new Error("Book Translation not found");
		error.status = 404;
		error.details = `The book with ID ${bookID} was not found in the translation ${translation.name}.`;
		throw error;
	}
	if (!chapters || chapters.length === 0) {
		const error = new Error("Chapters not found");
		error.status = 404;
		error.details = `No chapters found for book with ID ${bookID}.`;
		throw error;
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

import {
	Verse,
	Chapter,
	Book,
	Translation,
} from "../../models/Associations.js";

const getVersesFromBook = async (req, res) => {
	const { bookID, translationCode } = req.params;

	// Vérifier si le livre existe
	const book = await Book.findByPk(bookID.toUpperCase());
	if (!book) {
		const error = new Error("Book not found");
		error.status = 404;
		error.details = `The book with ID '${bookID}' does not exist`;
		throw error;
	}

	// Vérifier si la traduction existe
	const translation = await Translation.findOne({
		where: { code: translationCode },
	});
	if (!translation) {
		const error = new Error("Translation not found");
		error.status = 404;
		error.details = `The translation with code '${translationCode}' does not exist`;
		throw error;
	}

	// Trouver tous les chapitres du livre
	const chapters = await Chapter.findAll({
		where: { bookID: bookID.toUpperCase() },
		attributes: ["id"],
	});

	if (!chapters || chapters.length === 0) {
		const error = new Error("No chapters found for this book");
		error.status = 404;
		error.details = `No chapters found for the book with ID '${bookID}'`;
		throw error;
	}

	// Extraire les IDs des chapitres
	const chapterIds = chapters.map((chapter) => chapter.id);

	// Trouver tous les versets des chapitres du livre dans la traduction spécifiée
	const verses = await Verse.findAll({
		where: {
			chapterID: chapterIds,
			translationID: translation.id,
		},
		include: [
			{
				model: Chapter,
				as: "chapter",
				attributes: ["number"],
				include: [
					{
						model: Book,
						as: "book",
						attributes: ["id"],
					},
				],
			},
		],
		order: [
			[{ model: Chapter, as: "chapter" }, "number", "ASC"],
			["number", "ASC"],
		],
	});

	if (!verses || verses.length === 0) {
		const error = new Error(
			"No verses found for this book in the specified translation",
		);
		error.status = 404;
		error.details = `No verses found for the book with ID '${bookID}' in the translation with code '${translationCode}'`;
		throw error;
	}

	return res.status(200).json(verses);
};

export { getVersesFromBook };

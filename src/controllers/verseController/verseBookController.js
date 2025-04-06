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
		return res.status(404).json({ error: "Book not found" });
	}

	// Vérifier si la traduction existe
	const translation = await Translation.findOne({
		where: { code: translationCode },
	});
	if (!translation) {
		return res.status(404).json({ error: "Translation not found" });
	}

	// Trouver tous les chapitres du livre
	const chapters = await Chapter.findAll({
		where: { bookID: bookID.toUpperCase() },
		attributes: ["id"],
	});

	if (!chapters || chapters.length === 0) {
		return res
			.status(404)
			.json({ error: "No chapters found for this book" });
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
		return res.status(404).json({
			error: "No verses found for this book in the specified translation",
		});
	}

	return res.status(200).json(verses);
};

export { getVersesFromBook };

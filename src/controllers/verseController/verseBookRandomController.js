import {
	Verse,
	Book,
	Chapter,
	Translation,
	sequelize,
} from "../../models/Associations.js";

const getRandomVerseFromBook = async (req, res) => {
	const { bookID, translationCode } = req.params;

	// Vérifier si le livre existe
	const book = await Book.findByPk(bookID.toUpperCase());
	if (!book) {
		return res.status(404).json({ error: "Book not found" });
	}

	const translation = await Translation.findOne({
		where: { code: translationCode },
	});
	if (!translation) {
		return res.status(404).json({
			error: "Translation not found",
		});
	}

	// Récupérer directement un verset aléatoire du livre avec une seule requête
	const verse = await Verse.findOne({
		where: { translationID: translation.id },
		attributes: ["number", "text"],
		include: [
			{
				model: Chapter,
				as: "chapter",
				where: { bookID: bookID.toUpperCase() },
				attributes: ["number"],
				include: [
					{
						model: Book,
						as: "book",
					},
				],
			},
		],
		order: sequelize.random(),
		limit: 1,
	});

	if (!verse) {
		return res.status(404).json({
			error: "No verses found for this book in this specified translation",
		});
	}

	return res.status(200).json(verse);
};

export { getRandomVerseFromBook };

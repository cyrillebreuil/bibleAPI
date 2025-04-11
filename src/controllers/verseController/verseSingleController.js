import {
	Verse,
	Chapter,
	Book,
	Translation,
	BookTranslation,
} from "../../models/Associations.js";
import { Sequelize } from "sequelize";

const getSingleVerse = async (req, res) => {
	const { translationCode, bookID, chapterNumber, verseNumber } = req.params;
	const upperBookID = bookID.toUpperCase();

	// Récupérer d'abord la traduction
	const translation = await Translation.findOne({
		where: { code: translationCode },
	});

	if (!translation) {
		return res.status(404).json({ message: "Translation not found" });
	}

	// Ensuite, récupérer les autres données en parallèle
	const [chapter, book, bookTranslation] = await Promise.all([
		Chapter.findOne({
			where: { number: chapterNumber, bookID: upperBookID },
		}),
		Book.findOne({
			where: { id: upperBookID },
		}),
		BookTranslation.findOne({
			where: {
				bookID: upperBookID,
				translationID: translation.id, // Utiliser l'ID de traduction obtenu
			},
		}),
	]);

	if (!chapter) {
		return res.status(404).json({ message: "Chapter not found" });
	}

	if (!book) {
		return res.status(404).json({ message: "Book not found" });
	}

	if (!bookTranslation) {
		return res.status(404).json({ message: "Book translation not found" });
	}

	const verse = await Verse.findOne({
		attributes: ["text"],
		where: {
			number: verseNumber,
			chapterID: chapter.id,
			translationID: translation.id,
		},
	});

	if (!verse) {
		return res.status(404).json({ message: "Verse not found" });
	}

	res.json(verse);
};

export { getSingleVerse };

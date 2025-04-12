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
		const error = new Error("Translation not found");
		error.status = 404;
		error.details = `
			Translation not found for code ${translationCode}.
		`;
		throw error;
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
		const error = new Error("Chapter not found");
		error.status = 404;
		error.details = `
			Chapter not found for book ${book.name} and chapter ${chapterNumber} in translation : ${translation.name}.
		`;
		throw error;
	}

	if (!book) {
		const error = new Error("Book not found");
		error.status = 404;
		error.details = `
			Book not found for ID ${upperBookID} in translation : ${translation.name}.
		`;
		throw error;
	}

	if (!bookTranslation) {
		const error = new Error("Book translation not found");
		error.status = 404;
		error.details = `
			Book translation not found for book ${book.name} in translation : ${translation.name}.
		`;
		throw error;
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
		const error = new Error("Verse not found");
		error.status = 404;
		error.details = `
			Verse not found for book ${book.name}, chapter ${chapterNumber}, verse ${verseNumber} in translation : ${translation.name}.
		`;
		throw error;
	}

	res.json(verse);
};

export { getSingleVerse };

import {
	Verse,
	Chapter,
	Book,
	Translation,
	BookTranslation,
} from "../../models/Associations.js";

const getSingleVerse = async (req, res) => {
	const { translationCode, bookID, chapterNumber, verseNumber } = req.params;
	//Checks
	const translationExists = await Translation.findOne({
		where: { code: translationCode },
	});
	if (!translationExists) {
		return res.status(404).json({ message: "Translation not found" });
	}
	const chapterExists = await Chapter.findOne({
		where: { number: chapterNumber, bookID: bookID.toUpperCase() },
	});
	if (!chapterExists) {
		return res.status(404).json({ message: "Chapter not found" });
	}
	const verseExists = await Verse.findOne({
		where: { number: verseNumber, chapterID: chapterExists.id },
	});
	if (!verseExists) {
		return res.status(404).json({ message: "Verse not found" });
	}
	const bookExists = await Book.findOne({
		where: { id: bookID.toUpperCase() },
	});
	if (!bookExists) {
		return res.status(404).json({ message: "Book not found" });
	}
	const bookTranslationExists = await BookTranslation.findOne({
		where: {
			bookID: bookExists.id.toUpperCase(),
			translationID: translationExists.id,
		},
	});
	if (!bookTranslationExists) {
		return res.status(404).json({ message: "Book translation not found" });
	}

	const verse = await Verse.findOne({
		attributes: ["text"],
		where: {
			number: verseNumber,
			chapterID: chapterExists.id,
			translationID: translationExists.id,
		},
	});

	if (!verse) {
		return res.status(404).json({ message: "Verse not found" });
	}

	res.json(verse);
};

export { getSingleVerse };

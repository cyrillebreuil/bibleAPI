import {
	Verse,
	Chapter,
	Book,
	Translation,
	BookTranslation,
} from "../../models/Associations.js";

const getVersesFromOneChapter = async (req, res) => {
	const { translationCode, bookID, chapterNumber } = req.params;

	// Checks
	const chapterExists = await Chapter.findOne({
		where: { number: chapterNumber, bookID: bookID.toUpperCase() },
	});
	if (!chapterExists) {
		return res.status(404).json({
			success: false,
			message: `Chapter number ${chapterNumber} from book ${bookID} not found`,
		});
	}
	const bookExists = await Book.findOne({
		where: { id: bookID.toUpperCase() },
	});
	if (!bookExists) {
		return res.status(404).json({
			success: false,
			message: `Book with ID ${bookID} not found`,
		});
	}
	const translationExists = await Translation.findOne({
		where: { code: translationCode },
	});
	if (!translationExists) {
		return res.status(404).json({
			success: false,
			message: `Translation with code ${translationCode} not found`,
		});
	}
	const chapterID = chapterExists.id;
	//Check if book exists in translation
	const translationID = translationExists.id;
	const bookInTranslation = await BookTranslation.findOne({
		where: { bookID: bookID.toUpperCase(), translationID },
	});
	if (!bookInTranslation) {
		return res.status(404).json({
			success: false,
			message: `Book with ID ${bookID} not found in translation ${translationCode}`,
		});
	}

	const versesFromOneChapter = await Verse.findAll({
		attributes: ["number", "text"],
		include: [
			{
				model: Chapter,
				as: "chapter",
				attributes: [],
				where: {
					id: chapterID,
				},
			},
		],
		order: [["number", "ASC"]],
	});
	res.json(versesFromOneChapter);
};

export { getVersesFromOneChapter };

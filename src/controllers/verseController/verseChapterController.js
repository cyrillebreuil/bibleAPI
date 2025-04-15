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
	const translationExists = await Translation.findOne({
		where: { code: translationCode },
	});
	if (!translationExists) {
		const error = new Error(
			`Translation with code ${translationCode} not found`,
		);
		error.status = 404;
		throw error;
	}
	const bookExists = await Book.findOne({
		where: { id: bookID.toUpperCase() },
	});
	if (!bookExists) {
		const error = new Error(
			`Book with ID ${bookID.toUpperCase()} not found`,
		);
		error.status = 404;
		throw error;
	}
	const chapterExists = await Chapter.findOne({
		where: { number: chapterNumber, bookID: bookExists.id },
	});
	if (!chapterExists) {
		const error = new Error(
			`Chapter number ${chapterNumber} from book : ${bookExists.id} not found`,
		);
		error.status = 404;
		throw error;
	}
	const chapterID = chapterExists.id;
	//Check if book exists in translation
	const translationID = translationExists.id;
	const bookInTranslation = await BookTranslation.findOne({
		where: { bookID: bookExists.id, translationID },
	});
	if (!bookInTranslation) {
		const error = new Error(
			`Book with ID : ${bookExists.id} not found in translation : ${translationExists.name}`,
		);
		error.status = 404;
		throw error;
	}

	const versesFromOneChapter = await Verse.findAll({
		where: {
			translationID,
		},
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
	if (!versesFromOneChapter || versesFromOneChapter.length === 0) {
		const error = new Error(
			`No verses found for chapter ${chapterNumber} from book ${bookExists.id} in translation : ${translationExists.name}`,
		);
		error.status = 404;
		throw error;
	}
	res.json(versesFromOneChapter);
};

export { getVersesFromOneChapter };

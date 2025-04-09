import {
	Chapter,
	Translation,
	BookTranslation,
	Book,
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
	const chapters = await Chapter.findAll({
		where: {
			bookID: bookID.toUpperCase(),
		},
		attributes: ["number", "bookID"],
		order: [["number", "ASC"]],
	});
	const chapterCount = await Chapter.count({
		where: {
			bookID: bookID.toUpperCase(),
		},
	});
	const bookTranslation = await BookTranslation.findOne({
		where: {
			bookID: bookID.toUpperCase(),
			translationID: translation.id,
		},
		attributes: ["bookID", "name"],
	});
	if (!chapters || chapters.length === 0) {
		return res.status(404).json({ error: "Chapters not found" });
	}
	const responseObject = {
		book: {
			translation: translation.name,
			id: bookTranslation.bookID,
			name: bookTranslation.name,
			"Total Number Of Chapters": chapterCount,
		},
		chapters,
	};

	res.status(200).json(responseObject);
};

export { getAllChaptersFromBook };

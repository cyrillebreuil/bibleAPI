import { Chapter, Translation } from "../../models/Associations.js";

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
		order: [["number", "ASC"]],
	});
	if (!chapters || chapters.length === 0) {
		return res.status(404).json({ error: "Chapters not found" });
	}

	res.status(200).json(chapters);
};

export { getAllChaptersFromBook };

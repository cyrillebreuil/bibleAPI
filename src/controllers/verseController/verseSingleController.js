import { Verse, Chapter, Translation } from "../models/index.js";

const getSingleVerse = async (req, res) => {
	const { translationCode, chapterID, verseNumber } = req.params;

	const verse = await Verse.findOne({
		where: { id: verseID },
		include: [
			{
				model: Chapter,
				include: [
					{
						model: Translation,
						where: { code: translationCode },
					},
				],
			},
		],
	});

	if (!verse) {
		return res.status(404).json({ message: "Verse not found" });
	}

	res.json(verse);
};

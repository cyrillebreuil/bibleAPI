import { Verse } from "../../models/Associations.js";
import { Chapter } from "../../models/Associations.js";

const getVersesFromOneChapter = async (req, res) => {
	const versesFromOneChapter = await Verse.findAll({
		include: [
			{
				model: Chapter,
				as: "chapter",
				where: {
					bookID: "GEN",
					number: 1,
				},
			},
		],
	});
	res.json(versesFromOneChapter);
};

export { getVersesFromOneChapter };

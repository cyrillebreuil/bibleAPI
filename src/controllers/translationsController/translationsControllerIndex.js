import { Translation } from "../../models/Associations.js";

const index = async (req, res) => {
	const translations = await Translation.findAll({
		order: [["id", "DESC"]],
	});
	res.json(translations);
};

export { index };

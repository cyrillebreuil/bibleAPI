import { Translation } from "../../models/Associations.js";

const getOne = async (req, res) => {
	const { code } = req.params;
	const translation = await Translation.findOne({
		where: {
			code,
		},
	});
	if (!translation) {
		return res.status(404).json({ message: "Translation not found" });
	}
	return res.status(200).json(translation);
};

export { getOne };

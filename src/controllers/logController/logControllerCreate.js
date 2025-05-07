import { Log } from "../../models/Associations.js";

const createLog = async (req, res) => {
	const { userId, action, path, details } = req.body;

	if (!action) {
		return res.status(400).json({ message: "L'action est requise" });
	}

	const log = await Log.create({
		userId: userId || "anonymous",
		action,
		path,
		ipAddress: req.clientIp,
		userAgent: req.userAgent,
		details: details || {},
	});

	return res
		.status(201)
		.json({ message: "Log créé avec succès", id: log.id });
};

export { createLog };

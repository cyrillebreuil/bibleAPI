// bibleAPI/src/controllers/logController/logControllerDelete.js
import { Log } from "../../models/Associations.js";
import { Op } from "sequelize";

const deleteLogs = async (req, res) => {
	// Calculer la date d'il y a 30 jours
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

	// Supprimer les logs plus anciens que 30 jours
	const deletedCount = await Log.destroy({
		where: {
			createdAt: {
				[Op.lt]: thirtyDaysAgo,
			},
		},
	});

	return res.status(200).json({
		success: true,
		message: `${deletedCount} log entries older than 30 days have been deleted`,
		deletedCount,
	});
};

export { deleteLogs };

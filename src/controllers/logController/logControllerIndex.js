import { Sequelize } from "sequelize";
import { Log } from "../../models/Associations.js";

const getLogs = async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 50;
	const offset = (page - 1) * limit;

	// Construction des conditions de filtrage
	const whereConditions = {};

	// Filtre par action
	if (req.query.action) {
		whereConditions.action = req.query.action;
	}

	// Filtre par plage de dates
	if (req.query.dateFrom || req.query.dateTo) {
		whereConditions.timestamp = {};

		if (req.query.dateFrom) {
			whereConditions.timestamp[Op.gte] = new Date(req.query.dateFrom);
		}

		if (req.query.dateTo) {
			// Ajouter 1 jour pour inclure toute la journée finale
			const dateTo = new Date(req.query.dateTo);
			dateTo.setDate(dateTo.getDate() + 1);
			whereConditions.timestamp[Op.lt] = dateTo;
		}
	}

	// Recherche textuelle
	if (req.query.search) {
		const searchTerm = `%${req.query.search}%`;
		whereConditions[Op.or] = [
			{ userId: { [Op.iLike]: searchTerm } },
			{ action: { [Op.iLike]: searchTerm } },
			{ path: { [Op.iLike]: searchTerm } },
			{ ipAddress: { [Op.iLike]: searchTerm } },
		];
	}

	// Exécuter la requête
	const { count, rows } = await Log.findAndCountAll({
		where: whereConditions,
		order: [["timestamp", "DESC"]],
		limit,
		offset,
	});

	return res.json({
		total: count,
		pages: Math.ceil(count / limit),
		currentPage: page,
		logs: rows,
	});
};

export { getLogs };

import { Log } from "../../models/Associations.js";

// Correction suggérée pour votre contrôleur backend
const getStats = async (req, res) => {
	// Récupérer les statistiques des 30 derniers jours
	const thirtyDaysAgo = new Date();
	thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

	// Requête SQL pour obtenir le nombre de logs par jour
	const dailyStats = await Log.sequelize.query(
		`
        SELECT
            date_trunc('day', "createdAt") as date,
            COUNT(*) as count
        FROM logs
        WHERE "createdAt" >= :thirtyDaysAgo
        GROUP BY date_trunc('day', "createdAt")
        ORDER BY date DESC
        `,
		{
			replacements: { thirtyDaysAgo },
			type: Log.sequelize.QueryTypes.SELECT,
		},
	);

	return res.json({ dailyStats });
};

export { getStats };

import { Log } from "../../models/Associations.js";

const getStats = async (req, res) => {
	try {
		// Récupérer les statistiques des 30 derniers jours
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		// Requête SQL pour obtenir le nombre de logs par jour
		const dailyStats = await Log.sequelize.query(
			`
      SELECT
        date_trunc('day', timestamp) as date,
        COUNT(*) as count
      FROM logs
      WHERE timestamp >= :thirtyDaysAgo
      GROUP BY date_trunc('day', timestamp)
      ORDER BY date DESC
    `,
			{
				replacements: { thirtyDaysAgo },
				type: Log.sequelize.QueryTypes.SELECT,
			},
		);

		return res.json({ dailyStats });
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des statistiques:",
			error,
		);
		return res.status(500).json({ message: "Erreur serveur" });
	}
};

export { getStats };

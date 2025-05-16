const listFavorites = (req, res) => {
	const userId = req.user.id; // Nécessite authentification

	if (!userId) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	Favorite.findAll({
		where: { userId },
		include: [
			{
				model: Book,
				attributes: ["id", "name"],
			},
			{
				model: Chapter,
				attributes: ["id", "number"],
			},
			{
				model: Verse,
				attributes: ["id", "text"],
			},
		],
	}).then((favorites) => {
		res.status(200).json(favorites);
	});
};

export { listFavorites };

import { Favorite, Book, Chapter, Verse } from "../../models/Associations.js";

const listFavorites = async (req, res) => {
	const userId = req.user.id; // Nécessite authentification

	if (!userId) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	console.log(userId);
	console.log("why");

	const favorites = await Favorite.findAll({
		where: { userId },
	});

	if (!favorites || favorites.length === 0) {
		return res.status(404).json({ message: "No favorites found" });
	}
	console.log(favorites);
	res.status(200).json(favorites);
};

export { listFavorites };

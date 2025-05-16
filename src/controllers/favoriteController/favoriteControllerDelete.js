import { Favorite } from "../../models/Associations.js";

const deleteFavorite = async (req, res) => {
	const userId = req.user.id; // Nécessite authentification
	const { bookID, chapterID, verseID } = req.body;

	if (!bookID && !chapterID && !verseID) {
		return res.status(400).json({
			message: "Specify at least one of bookID, chapterID, or verseID",
		});
	}
	if (!userId) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const favorite = await Favorite.findOne({
		where: { userId, bookID, chapterID, verseID },
	});

	if (!favorite) {
		return res.status(404).json({ message: "Favorite not found" });
	}

	await favorite.destroy();

	res.status(200).json({ message: "Favorite deleted successfully" });
};

export { deleteFavorite };

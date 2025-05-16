import { Favorite, Book, Chapter, Verse } from "../../models/Associations.js";

// Ajouter un favori
const addFavorite = async (req, res) => {
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

	// Vérification d'existence (optionnel mais conseillé)
	if (bookID) {
		const book = await Book.findByPk(bookID);
		if (!book) return res.status(404).json({ message: "Book not found" });
	}
	if (chapterID) {
		const chapter = await Chapter.findByPk(chapterID);
		if (!chapter)
			return res.status(404).json({ message: "Chapter not found" });
	}
	if (verseID) {
		const verse = await Verse.findByPk(verseID);
		if (!verse) return res.status(404).json({ message: "Verse not found" });
	}

	const [favorite, created] = await Favorite.findOrCreate({
		where: { userId, bookID, chapterID, verseID },
	});

	if (!created) {
		return res.status(409).json({ message: "Already in favorites" });
	}

	res.status(201).json(favorite);
};

export { addFavorite };

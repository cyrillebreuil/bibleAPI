import {
	BookTranslation,
	Translation,
	Verse,
} from "../../models/Associations.js";

const getAllBooksFromOneTranslation = async (req, res) => {
	const { translationCode } = req.params;
	const translation = await Translation.findOne({
		where: {
			code: translationCode,
		},
	});
	if (!translation) {
		return res.status(404).json({
			error: `Traduction avec le code "${translationCode}" non trouvée`,
			requestedCode: translationCode,
		});
	}
	const verseCount = await Verse.count({
		where: { translationID: translation.id },
	});
	const bookCount = await BookTranslation.count({
		where: { translationID: translation.id },
	});
	const enhancedTranslation = {
		...translation.toJSON(),
		stats: {
			bookCount,
			verseCount,
		},
	};
	const books = await BookTranslation.findAll({
		where: { translationID: translation.id },
		attributes: ["bookID", "name"],
	});
	const responseObject = {
		translation: enhancedTranslation,
		// testament:,
		books,
	};
	res.json(responseObject);
};

export { getAllBooksFromOneTranslation };

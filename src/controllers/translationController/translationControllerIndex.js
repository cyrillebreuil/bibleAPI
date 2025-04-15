import {
	Translation,
	Verse,
	Book,
	BookTranslation,
} from "../../models/Associations.js";

const index = async (req, res) => {
	// Utiliser Promise.all pour paralléliser les requêtes globales
	const [
		translations,
		totalNumberOfVerses,
		totalNumberOfUniqueBooks,
		totalNumberOfBooks,
	] = await Promise.all([
		Translation.findAll({
			order: [["id", "ASC"]],
		}),
		Verse.count(),
		Book.count(),
		BookTranslation.count(),
	]);

	// Récupérer les statistiques pour chaque traduction en parallèle
	const enhancedTranslationsPromises = translations.map(
		async (translation) => {
			const [verseCount, bookCount, chapters] = await Promise.all([
				Verse.count({ where: { translationID: translation.id } }),
				BookTranslation.count({
					where: { translationID: translation.id },
				}),
				Verse.findAll({
					where: { translationID: translation.id },
					attributes: ["chapterID"],
					group: ["chapterID"],
				}),
			]);

			return {
				...translation.toJSON(),
				stats: {
					bookCount,
					chapterCount: chapters.length,
					verseCount,
				},
			};
		},
	);

	// Attendre que toutes les promesses de statistiques se résolvent
	const enhancedTranslations = await Promise.all(
		enhancedTranslationsPromises,
	);

	if (!enhancedTranslations) {
		const error = new Error("Enhanced translations not found");
		error.status = 404;
		error.details = `Enhanced translations not found.`;
		throw error;
	}

	const responseObject = {
		"API Infos": {
			"Total Number Of Translations": translations.length,
			"Total Number Of Unique Books": totalNumberOfUniqueBooks,
			"Total Books Across All Translations": totalNumberOfBooks,
			"Total Number Of Verses Across All Translations":
				totalNumberOfVerses,
			translations: enhancedTranslations,
		},
	};
	res.json(responseObject);
};

export { index };

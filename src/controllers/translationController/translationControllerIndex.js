import {
	Translation,
	Verse,
	Book,
	BookTranslation,
	Chapter,
} from "../../models/Associations.js";
import { Sequelize } from "sequelize";

const index = async (req, res) => {
	const translations = await Translation.findAll({
		order: [["id", "ASC"]],
	});
	const enhancedTranslations = [];
	for (const translation of translations) {
		const verseCount = await Verse.count({
			where: {
				translationID: translation.id,
			},
		});
		const bookCount = await BookTranslation.count({
			where: {
				translationID: translation.id,
			},
		});
		const chapters = await Verse.findAll({
			where: { translationID: translation.id },
			attributes: ["chapterID"],
			group: ["chapterID"],
		});
		const chapterCount = chapters.length;
		enhancedTranslations.push({
			...translation.toJSON(),
			stats: {
				bookCount,
				chapterCount,
				verseCount,
			},
		});
	}
	const numberOfTranslations = translations.length;
	const totalNumberOfVerses = await Verse.count();
	const totalNumberOfUniqueBooks = await Book.count();
	const totalNumberOfBooks = await BookTranslation.count();
	const responseObject = {
		"API Infos": {
			"Total Number Of Translations": numberOfTranslations,
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

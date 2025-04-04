import {
	Verse,
	Chapter,
	Book,
	Translation,
	BookTranslation,
	TestamentTranslation,
	sequelize,
} from "../../models/Associations.js";

const getRandomVerse = async (req, res) => {
	const translation = await Translation.findOne({
		where: {
			code: req.params.translationCode,
		},
	});
	if (!translation) {
		return res.status(404).json({ error: "Translation not found" });
	}
	const verse = await Verse.findOne({
		where: {
			translationID: translation.id,
		},
		attributes: ["number", "text"],
		include: [
			{
				model: Chapter,
				as: "chapter",
				include: [
					{
						model: Book,
						as: "book",
						include: [
							{
								model: BookTranslation,
								as: "translations",
								where: {
									translationID: translation.id,
								},
								required: false, // Utiliser un left join au cas où il n'y a pas de traduction
							},
						],
					},
				],
			},
		],
		order: sequelize.random(),
	});
	if (!verse) {
		return res
			.status(404)
			.json({ message: "No verses found for this translation" });
	}

	//Récupération du testament traduit
	const testamentTranslation = await TestamentTranslation.findOne({
		where: {
			isNewTestament: verse.chapter.book.isNewTestament,
			translationID: translation.id,
		},
	});
	// Créer une réponse plus riche pour l'API
	const response = {
		verse: {
			id: verse.id,
			number: verse.number,
			text: verse.text,
		},
		chapter: verse.chapter.number,
		bookTranslation: verse.chapter.book.translations[0].name || null,
		reference: `${verse.chapter.book.id} ${verse.chapter.number}:${verse.number}`,
		testamentTranslation: testamentTranslation.name,
		translation: translation.name,
	};

	return res.status(200).json(response);
};

export { getRandomVerse };

import {
	Verse,
	Chapter,
	Book,
	Translation,
	BookTranslation,
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
				attributes: ["number"],
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

	// Créer une réponse plus riche pour l'API
	const response = {
		verse: {
			id: verse.id,
			number: verse.number,
			text: verse.text,
		},
		chapter: {
			id: verse.chapter.id,
			number: verse.chapter.number,
		},
		book: {
			id: verse.chapter.book.id,
			isNewTestament: verse.chapter.book.isNewTestament,
		},
		reference: `${verse.chapter.book.id} ${verse.chapter.number}:${verse.number}`,
		translation: {
			code: translation.code,
			name: translation.name,
		},
		bookTranslation: verse.chapter.book.translations[0].name || null,
	};

	return res.status(200).json(response);
};

export { getRandomVerse };

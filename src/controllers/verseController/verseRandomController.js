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
	const { translationCode } = req.params;
	const { testament, bookID } = req.query; // Nouveaux paramètres de filtrage

	// Trouver la traduction
	const translation = await Translation.findOne({
		where: {
			code: translationCode,
		},
	});

	if (!translation) {
		return res.status(404).json({ error: "Translation not found" });
	}

	// Créer un tableau pour stocker toutes les conditions de jointure
	let includeConditions = [];

	// Condition de base: inclure Chapter
	const chapterInclude = {
		model: Chapter,
		as: "chapter",
		attributes: ["number"],
		required: true,
	};

	// Condition pour Book avec filtres éventuels
	const bookInclude = {
		model: Book,
		as: "book",
		attributes: ["id", "isNewTestament"],
		required: true,
	};

	// Ajouter le filtrage par testament si spécifié
	if (testament) {
		const isNewTestament = testament.toLowerCase() === "new";
		bookInclude.where = {
			...bookInclude.where,
			isNewTestament: isNewTestament,
		};
	}

	// Ajouter le filtrage par livre si spécifié
	if (bookID) {
		bookInclude.where = {
			...bookInclude.where,
			id: bookID.toUpperCase(),
		};
	}

	// Ajouter les BookTranslations au Book
	bookInclude.include = [
		{
			model: BookTranslation,
			as: "translations",
			attributes: ["name"],
			where: { translationID: translation.id },
			required: false,
		},
	];

	// Ajouter Book à Chapter
	chapterInclude.include = [bookInclude];

	// Ajouter Chapter aux conditions
	includeConditions.push(chapterInclude);

	// Ajouter Translation aux conditions
	includeConditions.push({
		model: Translation,
		as: "translation",
		attributes: ["code", "name"],
		required: true,
	});

	// Effectuer la requête optimisée
	const verse = await Verse.findOne({
		where: {
			translationID: translation.id,
		},
		attributes: ["id", "number", "text"],
		include: includeConditions,
		order: sequelize.random(),
	});

	if (!verse) {
		return res.status(404).json({
			message:
				"No verses found for this translation with the specified filters",
			filters: {
				translation: translationCode,
				testament: testament || "any",
				bookId: bookID || "any",
			},
		});
	}

	// Récupération du testament traduit
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
		book: {
			id: verse.chapter.book.id,
			name:
				verse.chapter.book.translations[0]?.name ||
				verse.chapter.book.id,
			testament: verse.chapter.book.isNewTestament ? "new" : "old",
		},
		reference: `${verse.chapter.book.id} ${verse.chapter.number}:${verse.number}`,
		testament: {
			isNew: verse.chapter.book.isNewTestament,
			name:
				testamentTranslation?.name ||
				(verse.chapter.book.isNewTestament
					? "New Testament"
					: "Old Testament"),
		},
		translation: {
			code: translation.code,
			name: translation.name,
		},
		filters: {
			testament: testament || "any",
			bookID: bookID || "any",
		},
	};

	return res.status(200).json(response);
};

export { getRandomVerse };

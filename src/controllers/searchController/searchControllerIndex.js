import { Sequelize } from "sequelize";
import {
	Verse,
	Chapter,
	Book,
	Translation,
	BookTranslation,
} from "../../models/Associations.js";

const searchVerses = async (req, res) => {
	// Récupérer les paramètres de recherche
	const {
		q,
		translation,
		exact = "false",
		operator = "and",
		limit = 50,
	} = req.query;

	// Valider les paramètres
	if (!q || q.trim() === "") {
		const error = new Error("A search term is required");
		error.status = 400;
		error.details = "Please provide a search term via the 'q' parameter";
		throw error;
	}

	// Convertir les options de chaîne à booléen
	const isExactMatch = exact.toLowerCase() === "true";
	const useAndOperator = operator.toLowerCase() === "and";
	const searchLimit = parseInt(limit) || 50;

	// Diviser la recherche en termes individuels
	const searchTerms = q
		.trim()
		.split(/\s+/)
		.filter((term) => term.length > 0);

	// Construire la condition de recherche basée sur les options
	let searchCondition;

	if (searchTerms.length === 1 || useAndOperator) {
		// Mode "AND" - tous les termes doivent être présents
		searchCondition = {
			[Sequelize.Op.and]: searchTerms.map((term) => ({
				text: isExactMatch
					? { [Sequelize.Op.iLike]: `% ${term} %` } // Correspondance exacte (entourée d'espaces)
					: { [Sequelize.Op.iLike]: `%${term}%` }, // Correspondance partielle
			})),
		};
	} else {
		// Mode "OR" - n'importe lequel des termes peut être présent
		searchCondition = {
			[Sequelize.Op.or]: searchTerms.map((term) => ({
				text: isExactMatch
					? { [Sequelize.Op.iLike]: `% ${term} %` } // Correspondance exacte
					: { [Sequelize.Op.iLike]: `%${term}%` }, // Correspondance partielle
			})),
		};
	}

	// Récupérer l'ID de traduction si nécessaire
	let translationId = null;
	if (translation) {
		const translationRecord = await Translation.findOne({
			where: { code: translation.toLowerCase() },
		});

		if (!translationRecord) {
			const error = new Error(
				`Translation with code "${translation}" not found`,
			);
			error.status = 404;
			error.details = `Please provide a valid translation code via the 'translation' parameter`;
			throw error;
		}

		translationId = translationRecord.id;
	}

	// Construire la requête complète
	const whereClause = translationId
		? { ...searchCondition, translationID: translationId }
		: searchCondition;

	// Effectuer la recherche dans les versets
	const verses = await Verse.findAll({
		where: whereClause,
		include: [
			{
				model: Chapter,
				as: "chapter",
				attributes: ["number"],
				include: [
					{
						model: Book,
						as: "book",
						attributes: ["id"],
						include: [
							{
								model: BookTranslation,
								as: "translations",
								attributes: ["name"],
							},
						],
					},
				],
			},
			{
				model: Translation,
				as: "translation",
				attributes: ["code", "name"],
			},
		],
		order: [
			[
				{ model: Chapter, as: "chapter" },
				{ model: Book, as: "book" },
				"id",
				"ASC",
			],
			[{ model: Chapter, as: "chapter" }, "number", "ASC"],
			["number", "ASC"],
		],
		limit: searchLimit,
	});

	if (verses.length === 0) {
		const error = new Error(`No verses found for search "${q}"`);
		error.status = 404;
		error.details = {
			info: `Please provide a valid search query via the 'q' parameter`,
			searchTerms: searchTerms,
			options: {
				exact: isExactMatch,
				operator: useAndOperator ? "AND" : "OR",
				translation: translation || "all",
			},
		};
		throw error;
	}

	// Formater les résultats pour une réponse plus propre
	const formattedResults = verses.map((verse) => {
		const bookName =
			verse.chapter.book.translations[0]?.name || verse.chapter.book.id;

		return {
			reference: `${verse.chapter.book.id} ${verse.chapter.number}:${verse.number}`,
			book: {
				id: verse.chapter.book.id,
				name: bookName,
			},
			chapter: verse.chapter.number,
			verse: verse.number,
			text: verse.text,
			translation: {
				code: verse.translation.code,
				name: verse.translation.name,
			},
			highlights: searchTerms.map((term) => ({
				term,
				count: (verse.text.match(new RegExp(term, "gi")) || []).length,
			})),
		};
	});

	// Construire la réponse
	const response = {
		search: {
			query: q,
			terms: searchTerms,
			options: {
				exact: isExactMatch,
				operator: useAndOperator ? "AND" : "OR",
				translation: translation || "all",
				limit: searchLimit,
			},
		},
		results: {
			count: verses.length,
			hasMore: verses.length === searchLimit,
			verses: formattedResults,
		},
	};

	res.json(response);
};

export { searchVerses };

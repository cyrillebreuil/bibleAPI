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
		return res.status(400).json({
			error: "Un terme de recherche est requis",
			message:
				"Veuillez fournir un terme de recherche via le paramètre 'q'",
		});
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
			return res.status(404).json({
				error: `Traduction avec le code "${translation}" non trouvée`,
				requestedCode: translation,
			});
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
		return res.status(404).json({
			message: `Aucun verset trouvé pour la recherche "${q}"`,
			searchTerms,
			options: {
				exact: isExactMatch,
				operator: useAndOperator ? "AND" : "OR",
				translation: translation || "all",
			},
		});
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

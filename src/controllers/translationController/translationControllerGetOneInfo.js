import {
	Translation,
	BookTranslation,
	Verse,
	sequelize,
} from "../../models/Associations.js";

import { Op } from "sequelize";

const getOneInfo = async (req, res) => {
	const { code } = req.params;
	// Récupérer la traduction
	const translation = await Translation.findOne({
		where: {
			code,
		},
	});

	if (!translation) {
		return res.status(404).json({ message: "Translation not found" });
	}

	// Récupérer des statistiques supplémentaires
	const translationId = translation.id;

	// Nombre de livres dans cette traduction
	const bookCount = await BookTranslation.count({
		where: { translationID: translationId },
	});

	// Nombre de versets dans cette traduction
	const verseCount = await Verse.count({
		where: { translationID: translationId },
	});

	// Créer l'objet de réponse enrichi
	const enhancedTranslation = {
		...translation.toJSON(),
		stats: {
			bookCount,
			verseCount,
		},
	};

	return res.status(200).json(enhancedTranslation);
};

export { getOneInfo };

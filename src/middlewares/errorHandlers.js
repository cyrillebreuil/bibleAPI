//Besoin de 3 parametres meme si ils ne sont pas tous utilisés pour la compatibilité avec Express
function notFound(req, res, next) {
	const err = new Error(
		`La ressource demandée '${req.originalUrl}' n'existe pas`,
	);
	err.status = 404;
	next(err);
}

function catchErrors(fn) {
	return async function (req, res, next) {
		try {
			await fn(req, res, next);
		} catch (error) {
			next(error);
		}
	};
}

//Besoin de 4 parametres meme si ils ne sont pas tous utilisés pour la compatibilité avec Express
function errorHandler(err, req, res, next) {
	const statusCode = err.status || 500;

	// Format de réponse standardisé pour toutes les erreurs
	const errorResponse = {
		status: statusCode,
		message: err.message,
		// Optionnellement, ajoutez d'autres détails si disponibles
		...(err.details && { details: err.details }),
	};

	return res.status(statusCode).json(errorResponse);
}

export { notFound, catchErrors, errorHandler };

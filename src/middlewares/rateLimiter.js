import rateLimit from "express-rate-limit";

// Configuration de base du limiteur
const createLimiter = (options) => {
	return rateLimit({
		windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes par défaut
		max: options.max || 100, // 100 requêtes par défaut
		standardHeaders: true,
		legacyHeaders: false,
		// Utiliser le handler personnalisé au lieu du message
		handler: (req, res, next, options) => {
			// Créer une erreur dans le format que votre middleware catchErrors attend
			const error = new Error(
				options.message || "Too many requests. Please try again later.",
			);
			error.status = 429; // Status code standard pour rate limiting
			error.details =
				options.details ||
				"Our service is free but we need to ensure fair usage for all.";

			// Passer l'erreur au middleware suivant (qui sera votre errorHandler)
			next(error);
		},
		skip: (req) => {
			// Ignorer les requêtes locales (environnement de développement)
			return (
				req.ip === "::1" ||
				req.ip === "127.0.0.1" ||
				req.ip === "::ffff:127.0.0.1"
			);
		},
	});
};

// Limiteur global
const globalLimiter = createLimiter({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: "Too many requests. Please try again later.",
	details: "Our service is free but we need to ensure fair usage for all.",
});

// Limiteur pour les recherches
const searchLimiter = createLimiter({
	windowMs: 15 * 60 * 1000,
	max: 30,
	message: "Too many search requests, please try again later.",
	details: "Search operations are limited to preserve server resources.",
});

const loginLimiter = createLimiter({
	windowsMs: 15 * 60 * 1000,
	max: 5,
	message: "Too many login requests, please try again later.",
	details: "Login operations are limited to preserve security.",
});

export { globalLimiter, searchLimiter, loginLimiter };

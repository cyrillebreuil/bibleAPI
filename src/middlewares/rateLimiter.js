import rateLimit from "express-rate-limit";

// Configuration de base du limiteur
const createLimiter = (options) => {
	return rateLimit({
		windowMs: options.windowMs || 15 * 60 * 1000,
		max: options.max || 100,
		standardHeaders: true,
		legacyHeaders: false,
		handler: (req, res, next, options) => {
			const error = new Error(
				options.message || "Too many requests. Please try again later.",
			);
			error.status = 429;
			error.details =
				options.details ||
				"Our service is free but we need to ensure fair usage for all.";
			next(error);
		},
		// Utiliser la même logique que votre logEnricher
		keyGenerator: (req) => {
			let clientIp =
				req.headers["x-forwarded-for"] || req.socket.remoteAddress;

			// Si x-forwarded-for contient plusieurs IPs, prendre la première
			if (clientIp && clientIp.includes(",")) {
				clientIp = clientIp.split(",")[0].trim();
			}

			return clientIp;
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
	max: 10,
	message: "Too many login requests, please try again later.",
	details: "Login operations are limited to preserve security.",
});

export { globalLimiter, searchLimiter, loginLimiter };

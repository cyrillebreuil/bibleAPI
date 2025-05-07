/**
 * Middleware pour enrichir les requêtes de logs avec des informations supplémentaires
 */
const logEnricher = (req, res, next) => {
	// Récupérer l'adresse IP réelle (prend en compte les proxies)
	req.clientIp =
		req.headers["x-forwarded-for"] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket?.remoteAddress;

	// Si x-forwarded-for contient plusieurs IPs, prendre la première
	if (req.clientIp && req.clientIp.includes(",")) {
		req.clientIp = req.clientIp.split(",")[0].trim();
	}

	// Récupérer l'user agent
	req.userAgent = req.headers["user-agent"];

	next();
};

export { logEnricher };

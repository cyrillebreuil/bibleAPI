import express from "express";
import "dotenv/config";

// Configuration de base
const __dirname = import.meta.dirname;
const port = process.env.PORT || 3000;
const url = process.env.URL || "http://127.0.0.1";

// Middlewares
import { globalLimiter } from "./src/middlewares/rateLimiter.js";
import { router } from "./src/routers/router.js";
import { notFound, errorHandler } from "./src/middlewares/errorHandlers.js";

// Initialisation
const app = express();

// Middleware de limitation des requêtes
app.use(globalLimiter);

// Routes de l'API
app.use(router);

// Gestion des erreurs
app.use(notFound);
app.use(errorHandler);

// Codes couleurs ANSI
const colors = {
	green: "\x1b[32m",
	blue: "\x1b[34m",
	yellow: "\x1b[33m",
	reset: "\x1b[0m",
};

// Démarrage du serveur
app.listen(process.env.PORT, () => {
	console.log(
		`${colors.green}📖${colors.blue} Bible API server running at ${colors.yellow}${url}:${port}${colors.reset}`,
	);
});

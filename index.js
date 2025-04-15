import express from "express";
import "dotenv/config";

// Configuration de base
import { ANSIIColors } from "./src/utils/colors.js";
const __dirname = import.meta.dirname;
const port = process.env.PORT || 3000;
const url = process.env.URL || "http://127.0.0.1";
import cors from "cors";
import { corsOptions } from "./src/utils/cors.js";

// Middlewares
import { globalLimiter } from "./src/middlewares/rateLimiter.js";
import { router } from "./src/routers/router.js";
import { notFound, errorHandler } from "./src/middlewares/errorHandlers.js";

// Initialisation
const app = express();

// Middleware de limitation des requêtes
app.use(globalLimiter);

// Middleware CORS
app.use(cors(corsOptions));

// Routes de l'API
app.use(router);

// Gestion des erreurs
app.use(notFound);
app.use(errorHandler);

// Démarrage du serveur
app.listen(process.env.PORT, () => {
	console.log(
		`📖${ANSIIColors.blue} Bible API server running at ${ANSIIColors.magenta}${url}:${port}${ANSIIColors.reset}`,
	);
});

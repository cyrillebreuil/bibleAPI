import { Router } from "express";
import { catchErrors } from "../middlewares/errorHandlers.js";
import { logEnricher } from "../middlewares/logEnricher.js";

import { logController } from "../controllers/logController/logController.js";
import { verifyAdmin } from "../middlewares/isAdmin.js";

const logRouter = Router();

logRouter.post("/log", logEnricher, catchErrors(logController.createLog));
logRouter.get(
	"/log",
	catchErrors(verifyAdmin),
	catchErrors(logController.getLogs),
);
logRouter.get(
	"/log/stats",
	catchErrors(verifyAdmin),
	catchErrors(logController.getStats),
);
logRouter.delete(
	"/log",
	catchErrors(verifyAdmin),
	catchErrors(logController.deleteLogs),
);

export { logRouter };

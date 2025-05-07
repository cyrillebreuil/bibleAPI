import { Router } from "express";
import { catchErrors } from "../middlewares/errorHandlers.js";
import { logEnricher } from "../middlewares/logEnricher.js";

import { logController } from "../controllers/logController/logController.js";

const logRouter = Router();

logRouter.post("/log", logEnricher, catchErrors(logController.createLog));
logRouter.get("/log", catchErrors(logController.getLogs));

export { logRouter };

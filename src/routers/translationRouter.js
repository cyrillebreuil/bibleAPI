import { Router } from "express";
import { catchErrors } from "../middlewares/errorHandlers.js";

import { translationController } from "../controllers/translationController/translationController.js";

const translationRouter = Router();

translationRouter.get("/", catchErrors(translationController.index));

export { translationRouter };

import { Router } from "express";
import { catchErrors } from "../middlewares/errorHandlers.js";

import { chapterController } from "../controllers/chapterController/chapterController.js";

const chapterRouter = Router();

chapterRouter.get(
	"/:translationCode/:bookID",
	catchErrors(chapterController.getAllChaptersFromBook),
);

export { chapterRouter };

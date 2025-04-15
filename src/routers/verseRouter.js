import { Router } from "express";
import { catchErrors } from "../middlewares/errorHandlers.js";

import { verseController } from "../controllers/verseController/verseController.js";

const verseRouter = Router();

verseRouter.get(
	"/:translationCode/randomverse",
	catchErrors(verseController.getRandomVerse),
);
verseRouter.get(
	"/:translationCode/:bookID/:chapterNumber",
	catchErrors(verseController.getVersesFromOneChapter),
);
verseRouter.get(
	"/:translationCode/:bookID/:chapterNumber/:verseNumber",
	catchErrors(verseController.getSingleVerse),
);
export { verseRouter };

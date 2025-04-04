import { Router } from "express";

import { verseController } from "../controllers/verseController/verseController.js";

const verseRouter = Router();

verseRouter.get(
	"/:translationCode/:bookID/:chapterNumber",
	verseController.getVersesFromOneChapter,
);

verseRouter.get(
	"/:translationCode/:bookID/:chapterNumber/:verseNumber",
	verseController.getSingleVerse,
);

export { verseRouter };

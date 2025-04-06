import { Router } from "express";

import { verseController } from "../controllers/verseController/verseController.js";

const verseRouter = Router();

verseRouter.get(
	"/:translationCode/randomverse",
	verseController.getRandomVerse,
);
verseRouter.get(
	"/:translationCode/:bookID/randomverse",
	verseController.getRandomVerseFromBook,
);
verseRouter.get(
	"/:translationCode/:bookID/:chapterNumber",
	verseController.getVersesFromOneChapter,
);
verseRouter.get(
	"/:translationCode/:bookID/:chapterNumber/:verseNumber",
	verseController.getSingleVerse,
);
verseRouter.get("/:translationCode/:bookID", verseController.getVersesFromBook);
export { verseRouter };

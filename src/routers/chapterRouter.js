import { Router } from "express";
import { chapterController } from "../controllers/chapterController/chapterController.js";

const chapterRouter = Router();

chapterRouter.get(
	"/:translationCode/:bookID",
	chapterController.getAllChaptersFromBook,
);

export { chapterRouter };

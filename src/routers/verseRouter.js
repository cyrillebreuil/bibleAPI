import { Router } from "express";

import { verseController } from "../controllers/verseController/verseController.js";

const verseRouter = Router();

verseRouter.get("/verses", verseController.getVersesFromOneChapter);

export { verseRouter };

import { Router } from "express";

import { translationRouter } from "./translationRouter.js";
import { verseRouter } from "./verseRouter.js";
import { bookRouter } from "./bookRouter.js";
import { chapterRouter } from "./chapterRouter.js";

const router = Router();

router.use(translationRouter);
router.use(verseRouter);
router.use(bookRouter);
router.use(chapterRouter);

export { router };

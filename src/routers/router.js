import { Router } from "express";

import { translationRouter } from "./translationRouter.js";
import { verseRouter } from "./verseRouter.js";
import { bookRouter } from "./bookRouter.js";
import { chapterRouter } from "./chapterRouter.js";
import { searchRouter } from "./searchRouter.js";

const router = Router();

router.use(searchRouter);
router.use(translationRouter);
router.use(verseRouter);
router.use(bookRouter);
router.use(chapterRouter);

export { router };

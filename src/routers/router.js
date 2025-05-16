import { Router } from "express";

import { translationRouter } from "./translationRouter.js";
import { verseRouter } from "./verseRouter.js";
import { bookRouter } from "./bookRouter.js";
import { chapterRouter } from "./chapterRouter.js";
import { searchRouter } from "./searchRouter.js";
import { authRouter } from "./authRouter.js";
import { logRouter } from "./logRouter.js";
import { geoRouter } from "./geoRouter.js";
import { favoriteRouter } from "./favoriteRouter.js";

const router = Router();

router.use(logRouter);
router.use(geoRouter);
router.use(searchRouter);
router.use(favoriteRouter);
router.use(translationRouter);
router.use(verseRouter);
router.use(bookRouter);
router.use(chapterRouter);
router.use(authRouter);

export { router };

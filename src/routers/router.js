import { Router } from "express";

import { translationRouter } from "./translationRouter.js";
import { verseRouter } from "./verseRouter.js";

const router = Router();

router.use(translationRouter);
router.use(verseRouter);

export { router };

import { Router } from "express";

import { translationRouter } from "./translationRouter.js";

const router = Router();

router.use(translationRouter);

export { router };

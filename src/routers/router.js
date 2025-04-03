import { Router } from "express";

import { translationRouter } from "./translationRouter";

const router = Router();

router.use(translationRouter);

export { router };

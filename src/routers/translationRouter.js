import { Router } from "express";
import { translationController } from "../controllers/translationController/translationController.js";

const translationRouter = Router();

translationRouter.get("/", translationController.index);

export { translationRouter };

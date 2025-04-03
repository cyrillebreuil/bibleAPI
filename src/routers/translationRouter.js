import { Router } from "express";
import translationsController from "../controllers/translationsController";

const translationRouter = Router();

translationRouter.get("/translations", translationsController.getAll);
translationRouter.get("/translations/:code", translationsController.getOne);

export { translationRouter };

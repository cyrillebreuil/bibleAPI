import { Router } from "express";
import { translationsController } from "../controllers/translationsController/translationsController.js";

const translationRouter = Router();

translationRouter.get("/", (req, res) => {
	res.send("Hello World!");
});

translationRouter.get("/translations", translationsController.index);
//translationRouter.get("/translations/:code", translationsController.getOne);

export { translationRouter };

import { Router } from "express";
import { translationController } from "../controllers/translationController/translationController.js";

const translationRouter = Router();

translationRouter.get("/", (req, res) => {
	res.send("Hello World!");
});

translationRouter.get("/translations", translationController.index);
//translationRouter.get("/translations/:code", translationsController.getOne);

export { translationRouter };

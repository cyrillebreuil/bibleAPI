import { Router } from "express";
import { bookController } from "../controllers/bookController/bookController.js";

const bookRouter = Router();

bookRouter.get(
	"/:translationCode",
	bookController.getAllBooksFromOneTranslation,
);

export { bookRouter };

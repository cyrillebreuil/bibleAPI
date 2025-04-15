import { Router } from "express";
import { catchErrors } from "../middlewares/errorHandlers.js";

import { bookController } from "../controllers/bookController/bookController.js";

const bookRouter = Router();

bookRouter.get(
	"/:translationCode",
	catchErrors(bookController.getAllBooksFromOneTranslation),
);

export { bookRouter };

import { Router } from "express";
import { catchErrors } from "../middlewares/errorHandlers.js";

import { favoriteController } from "../controllers/favoriteController/favoriteController.js";
import { verifyUser } from "../middlewares/isUser.js";

const favoriteRouter = Router();

favoriteRouter.post(
	"/favorites/:translationCode/:bookID/:chapterID",
	catchErrors(verifyUser),
	catchErrors(favoriteController.addFavorite),
);

favoriteRouter.get(
	"/favorites",
	catchErrors(verifyUser),
	catchErrors(favoriteController.listFavorites),
);

favoriteRouter.delete(
	"/favorites/:translationCode/:bookID/:chapterID",
	catchErrors(verifyUser),
	catchErrors(favoriteController.deleteFavorite),
);

export { favoriteRouter };

import { Router } from "express";
import { catchErrors } from "../middlewares/errorHandlers.js";

import { searchController } from "../controllers/searchController/searchController.js";

const searchRouter = Router();

searchRouter.get("/search", catchErrors(searchController.searchVerses));

export { searchRouter };

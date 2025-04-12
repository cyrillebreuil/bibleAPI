import { Router } from "express";
import { searchController } from "../controllers/searchController/searchController.js";

const searchRouter = Router();

searchRouter.get("/search", searchController.searchVerses);

export { searchRouter };

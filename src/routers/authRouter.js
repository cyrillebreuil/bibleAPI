import { Router } from "express";
import { catchErrors } from "../middlewares/errorHandlers.js";

import { authController } from "../controllers/authController/authController.js";

const authRouter = Router();

authRouter.post("/login", catchErrors(authController.auth));

export { authRouter };

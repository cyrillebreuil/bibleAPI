import { Router } from "express";
import { catchErrors } from "../middlewares/errorHandlers.js";

import { authController } from "../controllers/authController/authController.js";

//Import Limiter
import { loginLimiter } from "../middlewares/rateLimiter.js";

const authRouter = Router();

authRouter.post("/login", loginLimiter, catchErrors(authController.auth));

export { authRouter };

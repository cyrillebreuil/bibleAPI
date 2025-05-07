import { Router } from "express";
import { catchErrors } from "../middlewares/errorHandlers.js";
import { verifyAdmin } from "../middlewares/isAdmin.js";
import { geoController } from "../controllers/geoController/geoController.js";

const geoRouter = Router();

geoRouter.get(
	"/geoip/:ip",
	catchErrors(verifyAdmin),
	catchErrors(geoController.lookupIpLocation),
);

export { geoRouter };

import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
	res.send("DEO GRATIAS");
});

export { router };

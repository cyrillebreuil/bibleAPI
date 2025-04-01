import express, { Router } from "express";
import "dotenv/config";

const __dirname = import.meta.dirname;
const port = process.env.PORT || 3000;
const url = process.env.URL || "http://127.0.0.1";

import { router } from "./src/routers/router.js";

const app = express();
app.use(router);

app.listen(process.env.PORT, () => {
	console.log(`Bible Server is running on :${url}:${port}`);
});

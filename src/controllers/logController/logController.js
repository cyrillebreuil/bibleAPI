import { createLog } from "./logControllerCreate.js";
import { getLogs } from "./logControllerIndex.js";
import { getStats } from "./logControllerStats.js";

const logController = {
	createLog,
	getLogs,
	getStats,
};

export { logController };

import { createLog } from "./logControllerCreate.js";
import { getLogs } from "./logControllerIndex.js";
import { getStats } from "./logControllerStats.js";
import { deleteLogs } from "./logControllerDelete.js";

const logController = {
	createLog,
	getLogs,
	getStats,
	deleteLogs,
};

export { logController };

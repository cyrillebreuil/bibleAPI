import { getVersesFromOneChapter } from "./verseChapterController.js";
import { getSingleVerse } from "./verseSingleController.js";
import { getRandomVerse } from "./verseRandomController.js";

const verseController = {
	getVersesFromOneChapter,
	getSingleVerse,
	getRandomVerse,
};

export { verseController };

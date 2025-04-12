import { getVersesFromOneChapter } from "./verseChapterController.js";
import { getSingleVerse } from "./verseSingleController.js";
import { getRandomVerse } from "./verseRandomController.js";
import { getVersesFromBook } from "./verseBookController.js";

const verseController = {
	getVersesFromOneChapter,
	getSingleVerse,
	getRandomVerse,
	getVersesFromBook,
};

export { verseController };

import { getVersesFromOneChapter } from "./verseChapterController.js";
import { getSingleVerse } from "./verseSingleController.js";
import { getRandomVerse } from "./verseRandomController.js";
import { getRandomVerseFromBook } from "./verseBookRandomController.js";

const verseController = {
	getVersesFromOneChapter,
	getSingleVerse,
	getRandomVerse,
	getRandomVerseFromBook,
};

export { verseController };

import { Book } from "./Book.js";
import { Chapter } from "./Chapter.js";
import { Translation } from "./Translation.js";
import { TestamentTranslation } from "./TestamentTranslation.js";
import { BookTranslation } from "./BookTranslation.js";
import { Verse } from "./Verse.js";
import { User } from "./User.js";
import { Log } from "./Log.js";

import { sequelize } from "../database/connection.js";

// Book associations
Book.hasMany(Chapter, { foreignKey: "bookID", as: "chapters" });
Book.hasMany(BookTranslation, { foreignKey: "bookID", as: "translations" });

// Chapter associations
Chapter.belongsTo(Book, { foreignKey: "bookID", as: "book" });
Chapter.hasMany(Verse, { foreignKey: "chapterID", as: "verses" });

// Translation associations
Translation.hasMany(TestamentTranslation, {
	foreignKey: "translationID",
	as: "testamentTranslations",
});
Translation.hasMany(BookTranslation, {
	foreignKey: "translationID",
	as: "bookTranslations",
});
Translation.hasMany(Verse, {
	foreignKey: "translationID",
	as: "verses",
});

// TestamentTranslation associations
TestamentTranslation.belongsTo(Translation, {
	foreignKey: "translationID",
	as: "translation",
});

// BookTranslation associations
BookTranslation.belongsTo(Book, {
	foreignKey: "bookID",
	as: "book",
});
BookTranslation.belongsTo(Translation, {
	foreignKey: "translationID",
	as: "translation",
});

// Verse associations
Verse.belongsTo(Chapter, {
	foreignKey: "chapterID",
	as: "chapter",
});
Verse.belongsTo(Translation, {
	foreignKey: "translationID",
	as: "translation",
});

// Exporter un fichier d'index pour faciliter l'importation
export {
	Book,
	Chapter,
	Translation,
	TestamentTranslation,
	BookTranslation,
	Verse,
	User,
	Log,
	sequelize,
};

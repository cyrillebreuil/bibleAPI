import { sequelize } from "../database/connection.js";
import { DataTypes, Model } from "sequelize";

class BookTranslation extends Model {}

BookTranslation.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		bookID: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		translationID: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "bookTranslations",
		timestamps: false,
		indexes: [
			{
				unique: true,
				fields: ["bookID", "translationID"],
			},
		],
	},
);

export { BookTranslation };

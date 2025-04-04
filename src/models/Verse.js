import { sequelize } from "../database/connection.js";
import { DataTypes, Model } from "sequelize";

class Verse extends Model {}

Verse.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		chapterID: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		translationID: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		number: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		text: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "verses",
		timestamps: false,
		indexes: [
			{
				unique: true,
				fields: ["chapterID", "translationID", "number"],
			},
		],
	},
);

export { Verse };

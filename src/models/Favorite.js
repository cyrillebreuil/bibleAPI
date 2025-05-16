import { sequelize } from "../database/connection.js";
import { DataTypes, Model } from "sequelize";

class Favorite extends Model {}

Favorite.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		bookID: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		chapterID: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		verseID: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		sequelize,
		tableName: "favorites",
		timestamps: true,
		updatedAt: false,
		indexes: [
			{
				unique: true,
				fields: ["userId", "bookID", "chapterID", "verseID"],
			},
		],
	},
);

export { Favorite };

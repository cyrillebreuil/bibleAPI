import { sequelize } from "../database/connection.js";
import { DataTypes, Model } from "sequelize";

class Chapter extends Model {}

Chapter.init(
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
		number: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "chapters",
		timestamps: false,
		indexes: [
			{
				unique: true,
				fields: ["bookID", "number"],
			},
		],
	},
);

export { Chapter };

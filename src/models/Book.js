import { sequelize } from "../database/connection.js";
import { DataTypes, Model } from "sequelize";

class Book extends Model {}

Book.init(
	{
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
		},
		isNewTestament: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "books",
		timestamps: false,
	},
);

export { Book };

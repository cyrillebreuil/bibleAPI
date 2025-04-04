import { sequelize } from "../database/connection.js";
import { DataTypes, Model } from "sequelize";

class Translation extends Model {}

Translation.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		code: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		language: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		languageCode: {
			type: DataTypes.CHAR(3),
			allowNull: false,
		},
		regionCode: {
			type: DataTypes.CHAR(2),
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "translations",
		timestamps: false,
	},
);

export { Translation };

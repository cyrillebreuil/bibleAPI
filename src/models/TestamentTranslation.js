import { sequelize } from "../database/connection.js";
import { DataTypes, Model } from "sequelize";

class TestamentTranslation extends Model {}

TestamentTranslation.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		isNewTestament: {
			type: DataTypes.BOOLEAN,
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
		tableName: "testamentTranslations",
		timestamps: false,
		indexes: [
			{
				unique: true,
				fields: ["isNewTestament", "translationID"],
			},
		],
	},
);

export { TestamentTranslation };

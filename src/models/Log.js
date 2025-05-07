import { sequelize } from "../database/connection.js";
import { DataTypes, Model } from "sequelize";

class Log extends Model {}

Log.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "anonymous",
		},
		action: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		path: DataTypes.STRING,
		ipAddress: DataTypes.STRING,
		userAgent: DataTypes.TEXT,
		details: DataTypes.JSONB,
	},
	{
		sequelize,
		tableName: "logs",
		timestamps: true,
		updatedAt: false,
	},
);

export { Log };

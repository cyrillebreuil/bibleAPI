import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.PG_URL, {
	dialect: "postgres",
	logging: false,
});

export { sequelize };

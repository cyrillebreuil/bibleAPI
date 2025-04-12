// Configuration Jest
export default {
	testEnvironment: "node",
	transform: {},
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
	testMatch: ["**/src/tests/**/*.test.js"],
};

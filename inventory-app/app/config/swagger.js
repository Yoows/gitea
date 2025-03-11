const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Movie API",
			version: "1.0.0",
			description: "API to manage movies",
		},
		servers: [
			{
				description: "Local server",
			},
		],
	},
	apis: ["./app/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
	app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

	// 📌 Serve JSON doc for the gateway
	app.get("/api/docs-json", (req, res) => {
		res.json(swaggerSpec);
	});
};

module.exports = swaggerDocs;

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const amqplib = require("amqplib");
require("dotenv").config();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = process.env.PORT;
const RABBITMQ_URL = process.env.RABBITMQ_URL;
const QUEUE_NAME = process.env.BILLING_QUEUE;

// 📌 Swagger setup
const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "🚀 API Gateway for Microservices",
			version: "1.0.0",
			description: `
				🌐 Welcome to the API Gateway\n
				This gateway acts as a central hub, routing requests to multiple microservices and ensuring seamless communication between them.\n\n 
				🔥 Available Microservices  
				- 🧾 Billing Service → Manage billing operations via \`/api/billing\`\n
				- 📦 Inventory Service → Access and manage inventory via \`/api/inventory\`\n
				---\n
				⚡ Quick Start Guide\n 
				✅ Fetch Inventory  \n
				sh\n
				curl -X GET ${process.env.INVENTORY_SERVICE_URL}/api/inventory\n\n
				✅ Add a New Item to Inventory  \n
				sh
				curl -X POST ${process.env.INVENTORY_SERVICE_URL}/api/inventory \\
				     -H "Content-Type: application/json" \\
				     -d '{
				          "product_id": "12345",
				          "quantity": 10
				      }\n
				---\n
				📖 Additional Documentation\n
				For more details on each microservice, refer to the external documentation below.
			`,
		},
		externalDocs: {
			description: "📘 Explore the full Inventory Service API Documentation",
			url: `${process.env.INVENTORY_SERVICE_URL}/api/docs`,
		},
		servers: [{ url: `http://localhost:${PORT}` }],
	},
	apis: ["./server.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

/**
 * @swagger
 * /api/billing:
 *   post:
 *     summary: Send a billing request to RabbitMQ
 *     tags: [Billing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - number_of_items
 *               - total_amount
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The ID of the user
 *               number_of_items:
 *                 type: integer
 *                 description: Number of items purchased
 *               total_amount:
 *                 type: number
 *                 description: Total amount to be paid
 *     responses:
 *       200:
 *         description: Successfully sent billing request
 *       400:
 *         description: Missing data in request
 */
// 📌 route for rabbitmq
app.post("/api/billing", express.json(), async (req, res) => {
	if (!req.body) {
		return res.status(400).json({ error: "No body" });
	}
	const { user_id, number_of_items, total_amount } = req.body;

	if (!user_id || !number_of_items || !total_amount) {
		return res.status(400).json({ error: "Data missing" });
	}
	await sendToQueue({ user_id, number_of_items, total_amount });
	res.json({ message: "Command is sent" });
});

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Proxy request to inventory service
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Successfully fetched inventory
 */
app.use(
	"/api/inventory",
	createProxyMiddleware({
		target: process.env.INVENTORY_SERVICE_URL,
		changeOrigin: true,
		pathRewrite: { "^/api/inventory": "/" },
	})
);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
	console.log(`API Gateway running on http://localhost:${PORT}`);
	console.log(`Swagger running on http://localhost:${PORT}/api/docs`);
});

async function sendToQueue(message) {
	try {
		const connection = await amqplib.connect(RABBITMQ_URL);
		const channel = await connection.createChannel();
		await channel.assertQueue(QUEUE_NAME, { durable: true });

		channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
			persistent: true, // make sure the message is not lost
		});

		console.log("Message sent to rabbitmq:", message);
		await channel.close();
		await connection.close();
	} catch (error) {
		console.error("Error sending message:", error);
	}
}

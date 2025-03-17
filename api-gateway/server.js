const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const amqplib = require("amqplib");
const fs = require("fs");
const yaml = require("js-yaml");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;
const RABBITMQ_URL = process.env.RABBITMQ_URL;
const QUEUE_NAME = process.env.BILLING_QUEUE;

const swaggerDocument = yaml.load(fs.readFileSync("./swagger.yaml", "utf8"));
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

app.use(
	"/api/movies",
	createProxyMiddleware({
		target: `${process.env.INVENTORY_SERVICE_URL}/api/movies`,
		changeOrigin: true,
		pathRewrite: { "^/api/movies": "/" },
	}),
);

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

import amqplib from "amqplib";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const POSTGRES_URL = process.env.POSTGRES_URL;
const BILLING_QUEUE = process.env.BILLING_QUEUE;

const pool = new Pool({ connectionString: POSTGRES_URL });

async function insertOrder(order) {
	try {
		const res = await pool.query("INSERT INTO orders (user_id, number_of_items, total_amount) VALUES ($1, $2, $3)", [order.user_id, order.number_of_items, order.total_amount]);
		console.log("Order inserted:", res);
	} catch (err) {
		console.error("Error inserting order:", err);
	}
}

async function consumeMessages() {
	try {
		const conn = await amqplib.connect(RABBITMQ_URL);
		const channel = await conn.createChannel();

		await channel.assertQueue(BILLING_QUEUE, { durable: true });

		console.log(`✅ Waiting for messages in ${BILLING_QUEUE}...`);
		channel.consume(BILLING_QUEUE, async (msg) => {
			if (msg !== null) {
				const order = JSON.parse(msg.content.toString());
				console.log("📩 Received order:", order);

				// Insert into orders table
				await insertOrder(order);

				channel.ack(msg); // acknowledge message
				console.log("✅ Order processed and saved.");
			}
		});
	} catch (error) {
		console.error("❌ Error:", error);
	}
}

consumeMessages();

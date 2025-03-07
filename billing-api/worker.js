// handle message through rabbitmq
import amqplib from "amqplib";
import dotenv from "dotenv";
dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const BILLING_QUEUE = process.env.BILLING_QUEUE;

export const runConsumer = async () => {
	const handleMessage = async (msg) => {
		if (msg) {
			const message = JSON.parse(msg.content.toString());
			console.log("Received message: %s", message);
		}
	};

	try {
		const connection = await amqplib.connect(RABBITMQ_URL);
		const channel = await connection.createChannel();
		await channel.assertQueue(BILLING_QUEUE, { durable: true });

		console.log("Waiting for messages in %s. To exit press CTRL+C", BILLING_QUEUE);

		channel.consume(BILLING_QUEUE, handleMessage, { noAck: true });
	} catch (error) {
		console.error("Failed to connect", error);
	}
};

export default runConsumer;

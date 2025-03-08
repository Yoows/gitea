const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const amqplib = require("amqplib");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const RABBITMQ_URL = process.env.RABBITMQ_URL;
const QUEUE_NAME = process.env.BILLING_QUEUE;

app.use(express.json());

// 📌 route for rabbitmq
app.post("/api/billing", async (req, res) => {
  const { user_id, number_of_items, total_amount } = req.body;

  if (!user_id || !number_of_items || !total_amount) {
    return res.status(400).json({ error: "Data missing" });
  }
  await sendToQueue({ user_id, number_of_items, total_amount });
  res.json({ message: "Command is sent" });
});

app.use(
  "/api/inventory",
  createProxyMiddleware({
    target: process.env.INVENTORY_APP_URL,
    changeOrigin: true,
    pathRewrite: { "^/api/inventory": "" },
  }),
);

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
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

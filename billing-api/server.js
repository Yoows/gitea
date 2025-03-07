// server.js
import express from "express";
import { runConsumer } from "./worker.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.get("/", (req, res) => {
	res.send("Billing Service is running.");
});

runConsumer();

app.listen(PORT, () => {
	console.log(`Billing Service is running on http://localhost:${PORT}`);
});

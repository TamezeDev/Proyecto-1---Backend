import express from "express";
import dotenv from "dotenv";
import { connectToDb, disconnectFromDb } from "./config/database.config.js";

dotenv.config({ quiet: true });
const PORT = process.env.PORT;

const server = express();

const initBackend = async () => {
  connectToDb();

  server.use(express.json());

  server.listen(PORT, () => {
    console.warn(`✅ SERVER STARTED AT ADDRESS: http://localhost:${PORT}`);
  });
};

initBackend();

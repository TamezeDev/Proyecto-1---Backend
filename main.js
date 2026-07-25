import express from "express";
import dotenv from "dotenv";
import { connectToDb } from "./config/database.config.js";
import {
  unexpectedError,
  notFoundError,
} from "./shared/middlewares/error.middleware.js";

dotenv.config({ quiet: true });
const PORT = process.env.PORT;

const api = express();

const initBackend = async () => {
  connectToDb();

  api.use(express.json());

  api.use(notFoundError);
  api.use(unexpectedError);

  server.listen(PORT, () => {
    console.warn(`✅ SERVER STARTED AT ADDRESS: http://localhost:${PORT}`);
  });
};

initBackend();

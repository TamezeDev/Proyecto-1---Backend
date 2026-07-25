import express from "express";
import dotenv from "dotenv";

import genreRoutes from "./src/routes/genres.routes.js";

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
  /* USE JSON */
  api.use(express.json());
  /* ROUTES */
  api.use("/api/v1/genre", genreRoutes);
  /* MIDDLEWARES */
  api.use(notFoundError);
  api.use(unexpectedError);
  /* LISTENER */
  api.listen(PORT, () => {
    console.warn(`✅ SERVER STARTED AT ADDRESS: http://localhost:${PORT}`);
  });
};

initBackend();

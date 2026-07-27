import Genre from "./src/models/genre.model.js";
import Song from "./src/models/song.model.js"
import Album from "./src/models/album.model.js";
import User from "./src/models/user.model.js";

import express from "express";
import dotenv from "dotenv";

import genreRoutes from "./src/routes/genres.routes.js";
import userRoutes from "./src/routes/users.routes.js";

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
  api.use("/api/v1/user", userRoutes);
  /* MIDDLEWARES */
  api.use(notFoundError);
  api.use(unexpectedError);
  /* LISTENER */
  api.listen(PORT, () => {
    console.warn(`✅ SERVER STARTED AT ADDRESS: http://localhost:${PORT}`);
  });
};

initBackend();

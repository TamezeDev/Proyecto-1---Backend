import express from "express";
import dotenv from "dotenv";

dotenv.config({ quiet: true });
const PORT = process.env.PORT;

const server = express();

const initBackend = async () => {
  server.use(express.json());
  server.listen(PORT, () => {
    console.warn(`✅ SERVER STARTED AT ADDRESS: http://localhost:${PORT}`);
  });
};

initBackend();

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setServers } from "node:dns/promises";

setServers(["1.1.1.1", "8.8.8.8"]); // Solve dns compatiblily db connection

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env"), quiet: true });
const MONGO_DB_URL = process.env.MONGO_DB_URL;

const connectToDb = async () => {
  try {
    await mongoose.connect(MONGO_DB_URL);
    console.warn(`✅ Connected to Db successfully`);
  } catch (error) {
    console.error("❌ There was a problem connecting to database");
  }
};

const disconnectFromDb = async () => {
  try {
    await mongoose.disconnect();
    console.warn(`✅ Disconnected from Db successfully`);
  } catch (error) {
    console.error("❌ There was a problem disconnecting from database");
  }
};
export { connectToDb, disconnectFromDb };

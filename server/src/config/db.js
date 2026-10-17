import mongoose from "mongoose";
import { config } from "./env.js";
import { AppError } from "../utils/AppError.js";

// One shared connection. On Vercel the server runs as a serverless function that can be
// started many times, so we remember the connection attempt and reuse it.
let connectionPromise = null;

export async function connectDB() {
  if (!config.mongoUri) {
    throw new AppError(503, "The database is not configured. Set MONGODB_URI in server/.env.");
  }

  if (mongoose.connection.readyState === 1) return mongoose.connection;

  if (!connectionPromise) {
    mongoose.set("strictQuery", true);
    connectionPromise = mongoose
      .connect(config.mongoUri, { serverSelectionTimeoutMS: 8000 })
      .then((m) => {
        console.log("MongoDB connected");
        return m.connection;
      })
      .catch((err) => {
        connectionPromise = null; // allow a retry on the next request
        console.error("MongoDB connection error:", err.message); // real reason goes to the server log only
        throw new AppError(
          503,
          "Could not connect to the database. Check MONGODB_URI and the Atlas Network Access list."
        );
      });
  }

  return connectionPromise;
}

// Human-readable connection state for the health check.
export function dbState() {
  if (!config.mongoUri) return "not configured";
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  return states[mongoose.connection.readyState] || "unknown";
}
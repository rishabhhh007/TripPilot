import { config } from "../config/env.js";
import { connectDB, dbState } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getHealth = asyncHandler(async (req, res) => {
  let database = dbState();

  if (req.query.check === "db") {
    try {
      await connectDB();
      database = dbState();
    } catch (err) {
      database = err.status === 503 && !config.mongoUri ? "not configured" : "unreachable";
    }
  }

  res.json({
    status: "ok",
    service: "trippilot-server",
    environment: config.nodeEnv,
    database,
    time: new Date().toISOString(),
  });
});
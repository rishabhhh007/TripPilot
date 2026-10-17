import { connectDB } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const ensureDb = asyncHandler(async (req, res, next) => {
  await connectDB();
  next();
});
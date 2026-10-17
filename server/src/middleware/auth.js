import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { COOKIE_NAME, verifyToken } from "../utils/token.js";

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) throw new AppError(401, "Please log in to continue");

  const payload = verifyToken(token);
  const user = await User.findById(payload.sub);
  if (!user) throw new AppError(401, "This account no longer exists");

  req.user = user;
  next();
});
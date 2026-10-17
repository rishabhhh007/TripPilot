import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { AppError } from "./AppError.js";

export const COOKIE_NAME = "trippilot_token";

const cookieOptions = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: "lax",
  path: "/",
};

function getSecret() {
  if (config.jwtSecret.length < 32) {
    throw new AppError(503, "Login is not configured. Set JWT_SECRET in server/.env (at least 32 characters).");
  }
  return config.jwtSecret;
}

export function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, getSecret(), { expiresIn: "7d" });
}

export function verifyToken(token) {
  const secret = getSecret();
  try {
    return jwt.verify(token, secret);
  } catch {
    throw new AppError(401, "Your session has expired. Please log in again.");
  }
}

export function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

export function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, cookieOptions);
}
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { AppError } from "./AppError.js";

export const AUTH_COOKIE = "token";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function ensureJwtConfigured() {
  if (!config.jwtSecret) {
    throw new AppError(503, "Login is not configured. Set JWT_SECRET in server/.env.");
  }
}

export function signToken(userId) {
  ensureJwtConfigured();
  return jwt.sign({ sub: String(userId) }, config.jwtSecret, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch {
    throw new AppError(401, "Your session has expired. Please log in again.");
  }
}

const cookieOptions = () => ({
  httpOnly: true,
  secure: config.isProduction,
  sameSite: "lax",
  path: "/",
});

export function setAuthCookie(res, token) {
  res.cookie(AUTH_COOKIE, token, { ...cookieOptions(), maxAge: SEVEN_DAYS_MS });
}

export function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE, cookieOptions());
}
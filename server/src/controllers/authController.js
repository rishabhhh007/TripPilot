import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signToken, setAuthCookie, clearAuthCookie } from "../utils/token.js";

export const register = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const email = req.body.email.toLowerCase();

  if (await User.exists({ email })) {
    throw new AppError(409, "An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ name, email, passwordHash });
  const token = signToken(user._id);
  await user.save();

  setAuthCookie(res, token);
  res.status(201).json({ user: user.toPublic() });
});

export const login = asyncHandler(async (req, res) => {
  const email = req.body.email.toLowerCase();
  const user = await User.findOne({ email }).select("+passwordHash");

  const passwordOk = user && (await user.checkPassword(req.body.password));
  if (!passwordOk) throw new AppError(401, "Incorrect email or password");

  setAuthCookie(res, signToken(user._id));
  res.json({ user: user.toPublic() });
});

export const logout = asyncHandler(async (req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out" });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toPublic() });
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, preferences } = req.body;

  if (name) req.user.name = name;
  if (preferences) {
    req.user.preferences = { ...req.user.preferences.toObject(), ...preferences };
  }

  await req.user.save();
  res.json({ user: req.user.toPublic() });
});
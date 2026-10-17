import { Router } from "express";
import { register, login, logout, getMe, updateMe } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";

const router = Router();

const EMAIL = /^\S+@\S+\.\S+$/;

const registerRules = {
  name: { type: "string", required: true, minLength: 2, maxLength: 60 },
  email: { type: "string", required: true, maxLength: 120, pattern: EMAIL, message: "Enter a valid email address" },
  password: { type: "string", required: true, minLength: 8, maxLength: 72, trim: false },
};

const loginRules = {
  email: { type: "string", required: true, maxLength: 120, pattern: EMAIL, message: "Enter a valid email address" },
  password: { type: "string", required: true, maxLength: 72, trim: false },
};

const updateRules = {
  name: { type: "string", minLength: 2, maxLength: 60 },
  preferences: { type: "object" },
};

router.post("/register", validateBody(registerRules), register);
router.post("/login", validateBody(loginRules), login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.patch("/me", protect, validateBody(updateRules), updateMe);

export default router;
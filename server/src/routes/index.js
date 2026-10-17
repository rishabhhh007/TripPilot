import { Router } from "express";
import healthRoutes from "./healthRoutes.js";
import authRoutes from "./authRoutes.js";
import { ensureDb } from "../middleware/ensureDb.js";

const router = Router();

router.use("/health", healthRoutes);

router.use(ensureDb);

router.use("/auth", authRoutes);

export default router;
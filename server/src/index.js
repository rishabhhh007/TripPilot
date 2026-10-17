import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// PLACEHOLDER SERVER. Only a health check exists so far.
// Next backend stages (see README): MongoDB connection, User + Trip models, auth routes,
// trip CRUD routes, Gemini itinerary endpoint, Places / weather services.

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "TripPilot server is running" });
});

// Centralized error handler (all routes will pass errors here with next(err)).
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));

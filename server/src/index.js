import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config/env.js";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { AppError } from "./utils/AppError.js";

// Request flow:  request -> cors -> json/cookies -> /api routes -> notFound -> errorHandler -> response

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1); // behind Vercel's proxy, needed later for secure cookies

app.use(
  cors({
    // Requests with no Origin header (same-origin on Vercel, curl, Postman) are allowed.
    origin(origin, callback) {
      if (!origin || config.clientUrls.includes(origin)) return callback(null, true);
      callback(new AppError(403, "This origin is not allowed"));
    },
    credentials: true, // lets the browser send the login cookie
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

// Local development: start a normal server. On Vercel the exported app is used as a serverless function.
if (!process.env.VERCEL) {
  app.listen(config.port, () => {
    console.log(`TripPilot server running on http://localhost:${config.port}`);
    connectDB().catch((err) => console.warn(`Database not connected yet: ${err.message}`));
  });
}

export default app;
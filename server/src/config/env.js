import "dotenv/config"; // loads server/.env into process.env (local development)

// All settings are read here, once. The rest of the server imports `config`
// instead of reading process.env directly, so you can see every setting in one place.

const nodeEnv = process.env.NODE_ENV || "development";

export const config = {
  nodeEnv,
  isProduction: nodeEnv === "production",
  port: Number(process.env.PORT) || 5000,

  // Browser origins allowed to call the API. Separate several with commas.
  clientUrls: (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),

  // Secrets. Empty means "not set yet". Features that need them explain what is missing.
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "", // used in the auth phase
  geminiApiKey: process.env.GEMINI_API_KEY || "", // used in the Gemini phase
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || "", // used in the weather phase
};
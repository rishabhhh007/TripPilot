import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Vite config: React support + Tailwind CSS v4 (no tailwind.config.js needed).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Local development: forward /api/* to the Express server, so the frontend uses the
    // same relative URLs (/api/...) locally as it does on Vercel (one domain, two services).
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
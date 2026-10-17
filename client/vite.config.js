import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Vite config: React support + Tailwind CSS v4 (no tailwind.config.js needed).
export default defineConfig({
  plugins: [react(), tailwindcss()],
});

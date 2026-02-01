import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Inject API Key from Vercel environment variables during build
    // Safe fallback to empty string to prevent build crash
    "process.env.API_KEY": JSON.stringify(process.env.API_KEY || ""),
  },
  build: {
    rollupOptions: {
      // Tell Vite NOT to bundle these, as they are loaded via importmap in index.html
      // This prevents "Failed to resolve" errors during build for CDN imports
      external: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "lucide-react",
        "recharts",
        "@google/genai",
      ],
      output: {
        format: "es",
      },
    },
  },
});

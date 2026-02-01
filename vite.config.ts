import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Inject API Key from Vercel environment variables during build
    "process.env.API_KEY": JSON.stringify(process.env.API_KEY || ""),
  },
  build: {
    rollupOptions: {
      // Tell Vite NOT to bundle these, as they are loaded via importmap in index.html
      external: [
        "react",
        "react-dom",
        "react-dom/client",
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

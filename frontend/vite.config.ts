import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://job-fit-ai-backend-jrp1.onrender.com",
        changeOrigin: true
      }
    }
  }
});

import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), "");
  
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/api": {
          target: "http://localhost:8082", // Local backend for development
          changeOrigin: true,
          // Only rewrite in development if needed
          rewrite: (path) => mode === 'development' ? path.replace(/^\/api/, '') : path
        }
      }
    }
  };
});

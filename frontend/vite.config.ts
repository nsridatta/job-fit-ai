import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory
  const env = loadEnv(mode, process.cwd(), "");

  const isProduction = mode === 'production';

  return {
    plugins: [react(), tsconfigPaths()],
    server: {
      port: 5173,
      // Proxy only in development
      proxy: !isProduction ? {
        "/api": {
          target: "http://localhost:8082",
          changeOrigin: true
        }
      } : undefined
    }
  };
});
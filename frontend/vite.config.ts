import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@services": path.resolve(__dirname, "src/services"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: process.env.VITE_API_DOMAIN ?? "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});

import { defineConfig, Plugin, UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  return {
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://backend:8000',
          changeOrigin: true,
        },
      },
      fs: {
        allow: ['.'], // Permite que o Vite sirva arquivos fora de src se necessário
      },
    },
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./client"),
        "@shared": path.resolve(__dirname, "./shared"),
      },
    },
  }
});

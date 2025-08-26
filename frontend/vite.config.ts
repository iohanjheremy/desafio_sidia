import { defineConfig, Plugin, UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  // Usar variável de ambiente para o target do proxy
  // No desenvolvimento local: VITE_BACKEND_URL=http://localhost:8000
  // No Docker: VITE_BACKEND_URL=http://backend:8000
  const backendUrl = process.env.VITE_BACKEND_URL || 'http://localhost:8000';
  
  return {
    server: {
      host: true,
      port: 5173,
      proxy: {
        '/api': {
          target: backendUrl,
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

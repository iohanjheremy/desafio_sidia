import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleFifaApiProxy } from "./routes/fifa-api";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // FIFA API Proxy - handle multiple endpoints
  app.get("/api/players", handleFifaApiProxy);
  app.get("/api/players/search", handleFifaApiProxy);
  app.get("/api/players/filter", handleFifaApiProxy);
  app.get("/api/players/top-k", handleFifaApiProxy);
  app.get("/api/players/best-team", handleFifaApiProxy);
  app.get("/api/players/:id", handleFifaApiProxy);

  return app;
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/savings/summary", async (_req, res) => {
    const summary = await storage.getSavingsSummary();
    return res.json(summary);
  });

  app.get("/api/savings/contributions", async (req, res) => {
    const parsedLimit =
      typeof req.query.limit === "string" ? Number(req.query.limit) : undefined;
    const contributions = await storage.getRecentContributions(parsedLimit ?? 6);
    return res.json(contributions);
  });

  app.post("/api/savings/contribute", async (req, res) => {
    const parsedAmount =
      typeof req.body?.amount === "number"
        ? req.body.amount
        : Number(req.body?.amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res
        .status(400)
        .json({ message: "amount must be a finite number greater than 0" });
    }

    const updatedProgress = await storage.addContribution(parsedAmount);
    return res.json(updatedProgress);
  });

  return httpServer;
}

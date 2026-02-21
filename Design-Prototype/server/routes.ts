import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
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
    const progressPercent =
      updatedProgress.goalAmount > 0
        ? Number(
            (
              (updatedProgress.currentAmount / updatedProgress.goalAmount) *
              100
            ).toFixed(2),
          )
        : 0;

    return res.json({
      currentAmount: updatedProgress.currentAmount,
      goalAmount: updatedProgress.goalAmount,
      progressPercent,
    });
  });

  return httpServer;
}

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const configuredPort = parseInt(process.env.PORT || "5000", 10);
  const canRetryPort = process.env.NODE_ENV !== "production";
  const maxAttempts = canRetryPort ? 10 : 1;
  const host = "0.0.0.0";

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const port = configuredPort + attempt;
    const listenOptions = {
      port,
      host,
      ...(process.platform !== "win32" ? { reusePort: true } : {}),
    };

    try {
      await new Promise<void>((resolve, reject) => {
        const onError = (error: NodeJS.ErrnoException) => {
          httpServer.off("listening", onListening);
          reject(error);
        };

        const onListening = () => {
          httpServer.off("error", onError);
          resolve();
        };

        httpServer.once("error", onError);
        httpServer.once("listening", onListening);
        try {
          httpServer.listen(listenOptions);
        } catch (error) {
          httpServer.off("error", onError);
          httpServer.off("listening", onListening);
          reject(error);
        }
      });

      log(`serving on port ${port}`);
      break;
    } catch (error) {
      const err = error as NodeJS.ErrnoException;

      if (err.code === "EADDRINUSE" && attempt < maxAttempts - 1) {
        log(`port ${port} is in use; retrying on port ${port + 1}`, "express");
        continue;
      }

      throw err;
    }
  }
})();

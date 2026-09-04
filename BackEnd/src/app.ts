import crypto from "node:crypto";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import config from "./config/env";
import swaggerSpec from "./docs/swagger";
import apiRouter from "./routes";
import notFound from "./middlewares/notFound";
import errorHandler from "./middlewares/errorHandler";
import AppError from "./utils/AppError";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin(origin, callback): void {
      if (!origin || config.corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new AppError(403, "Origin not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use((req, res, next): void => {
  req.id = req.get("x-request-id")?.trim() || crypto.randomUUID();
  res.setHeader("x-request-id", req.id);
  next();
});

app.get("/", (_req, res): void => {
  res.json({
    name: "LinkVault API",
    version: "1.0.0",
    status: "running",
    documentation: "/api-docs",
  });
});

app.get("/api/v1/health", (_req, res): void => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", apiRouter);
app.use(notFound);
app.use(errorHandler);

export default app;


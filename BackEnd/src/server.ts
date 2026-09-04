import type { Server } from "node:http";
import app from "./app";
import config from "./config/env";
import { connectDatabase, disconnectDatabase } from "./config/database";

let server: Server | undefined;

const start = async (): Promise<void> => {
  try {
    await connectDatabase();
    console.log("MongoDB connected");

    server = app.listen(config.port, () => {
      console.log(`LinkVault API listening on port ${config.port}`);
    });
  } catch (error: unknown) {
    console.error("Unable to start LinkVault API", error);
    process.exitCode = 1;
  }
};

const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
  console.log(`${signal} received. Shutting down gracefully.`);

  if (server) {
    await new Promise<void>((resolve, reject) => {
      server?.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  }

  await disconnectDatabase();
  process.exit(0);
};

process.once("SIGTERM", () => {
  void shutdown("SIGTERM");
});
process.once("SIGINT", () => {
  void shutdown("SIGINT");
});

void start();


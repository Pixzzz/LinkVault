const app = require("./app");
const config = require("./config/env");
const { connectDatabase, disconnectDatabase } = require("./config/database");

let server;

const start = async () => {
  try {
    await connectDatabase();
    console.log("MongoDB connected");

    server = app.listen(config.port, () => {
      console.log(`LinkVault API listening on port ${config.port}`);
    });
  } catch (error) {
    console.error("Unable to start LinkVault API", error);
    process.exitCode = 1;
  }
};

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully.`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await disconnectDatabase();
  process.exit(0);
};

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));

start();

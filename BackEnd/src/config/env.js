const path = require("node:path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const requireEnvironmentVariable = (name) => {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const jwtSecret = requireEnvironmentVariable("JWT_SECRET");

if (jwtSecret.length < 32) {
  throw new Error("JWT_SECRET must contain at least 32 characters");
}

const port = Number(process.env.PORT || 3000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const config = Object.freeze({
  nodeEnv: process.env.NODE_ENV || "development",
  port,
  mongodbUri: requireEnvironmentVariable("MONGODB_URI"),
  jwt: {
    secret: jwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  },
  corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
});

module.exports = config;


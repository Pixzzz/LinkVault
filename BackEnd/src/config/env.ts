import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export interface AppConfig {
  readonly nodeEnv: string;
  readonly port: number;
  readonly mongodbUri: string;
  readonly jwt: {
    readonly secret: string;
    readonly expiresIn: string;
  };
  readonly corsOrigins: readonly string[];
}

const requireEnvironmentVariable = (name: string): string => {
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

const config: AppConfig = Object.freeze({
  nodeEnv: process.env.NODE_ENV || "development",
  port,
  mongodbUri: requireEnvironmentVariable("MONGODB_URI"),
  jwt: Object.freeze({
    secret: jwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  }),
  corsOrigins: Object.freeze(
    (process.env.CORS_ORIGIN || "http://localhost:5173")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  ),
});

export default config;


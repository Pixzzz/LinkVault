import type { ErrorRequestHandler } from "express";
import config from "../config/env";
import AppError from "../utils/AppError";

interface NormalizedError {
  readonly statusCode: number;
  readonly message: string;
  readonly details?: readonly string[];
}

interface DatabaseError extends Error {
  readonly code?: number;
  readonly keyValue?: Record<string, unknown>;
}

const normalizeError = (error: unknown): NormalizedError => {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
    };
  }

  if (error instanceof Error && error.name === "CastError") {
    return { statusCode: 400, message: "The provided identifier is invalid" };
  }

  const databaseError = error as DatabaseError;
  if (databaseError?.code === 11000) {
    const field = Object.keys(databaseError.keyValue ?? {})[0] ?? "value";
    return { statusCode: 409, message: `A record with that ${field} already exists` };
  }

  return { statusCode: 500, message: "Internal server error" };
};

const errorHandler: ErrorRequestHandler = (error, req, res, _next): void => {
  const normalized = normalizeError(error);

  if (normalized.statusCode >= 500) {
    console.error({ requestId: req.id, error });
  }

  const response: {
    error: {
      message: string;
      requestId: string;
      details?: readonly string[];
      stack?: string;
    };
  } = {
    error: {
      message: normalized.message,
      requestId: req.id,
    },
  };

  if (normalized.details) {
    response.error.details = normalized.details;
  }

  if (
    config.nodeEnv === "development" &&
    normalized.statusCode >= 500 &&
    error instanceof Error &&
    typeof error.stack === "string"
  ) {
    response.error.stack = error.stack;
  }

  res.status(normalized.statusCode).json(response);
};

export default errorHandler;

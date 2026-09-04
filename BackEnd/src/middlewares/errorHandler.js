const config = require("../config/env");

const normalizeError = (error) => {
  if (error.name === "CastError") {
    return { statusCode: 400, message: "The provided identifier is invalid" };
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0] || "value";
    return { statusCode: 409, message: `A record with that ${field} already exists` };
  }

  return {
    statusCode: error.statusCode || 500,
    message: error.isOperational ? error.message : "Internal server error",
    details: error.details,
  };
};

const errorHandler = (error, req, res, next) => {
  const normalized = normalizeError(error);

  if (normalized.statusCode >= 500) {
    console.error({ requestId: req.id, error });
  }

  const response = {
    error: {
      message: normalized.message,
      requestId: req.id,
    },
  };

  if (normalized.details) {
    response.error.details = normalized.details;
  }

  if (config.nodeEnv === "development" && normalized.statusCode >= 500) {
    response.error.stack = error.stack;
  }

  res.status(normalized.statusCode).json(response);
};

module.exports = errorHandler;

export default class AppError extends Error {
  public readonly statusCode: number;
  public readonly details: readonly string[] | undefined;
  public readonly isOperational = true;

  public constructor(statusCode: number, message: string, details?: readonly string[]) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

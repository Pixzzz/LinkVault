import type { RequestHandler } from "express";
import type { UserRole } from "../models/User";
import AppError from "../utils/AppError";

const authorize = (...roles: readonly UserRole[]): RequestHandler =>
  (req, _res, next): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(new AppError(403, "You do not have permission to perform this action"));
      return;
    }

    next();
  };

export default authorize;


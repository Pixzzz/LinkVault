import type { RequestHandler } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/env";
import User from "../models/User";
import AppError from "../utils/AppError";
import asyncHandler from "../utils/asyncHandler";

const authenticate: RequestHandler = asyncHandler(async (req, _res, next) => {
  const authorization = req.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new AppError(401, "A Bearer access token is required");
  }

  const token = authorization.slice(7).trim();
  if (!token) {
    throw new AppError(401, "A Bearer access token is required");
  }

  let payload: JwtPayload;
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    if (typeof decoded === "string" || typeof decoded.sub !== "string") {
      throw new Error("Invalid token payload");
    }
    payload = decoded;
  } catch {
    throw new AppError(401, "The access token is invalid or expired");
  }

  const user = await User.findById(payload.sub);
  if (!user) {
    throw new AppError(401, "The user associated with this token no longer exists");
  }

  req.user = user;
  next();
});

export default authenticate;


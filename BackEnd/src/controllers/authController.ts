import type { RequestHandler } from "express";
import * as authService from "../services/authService";
import { getAuthenticatedUser, getValidated } from "../types/http";
import asyncHandler from "../utils/asyncHandler";
import type { LoginBody, RegisterBody } from "../validators/authSchemas";

export const register: RequestHandler = asyncHandler(async (req, res) => {
  const { body } = getValidated<RegisterBody, Record<string, never>, Record<string, never>>(req);
  const result = await authService.register(body);
  res.status(201).json({ data: result });
});

export const login: RequestHandler = asyncHandler(async (req, res) => {
  const { body } = getValidated<LoginBody, Record<string, never>, Record<string, never>>(req);
  const result = await authService.login(body);
  res.json({ data: result });
});

export const me: RequestHandler = (req, res): void => {
  res.json({ data: { user: getAuthenticatedUser(req) } });
};


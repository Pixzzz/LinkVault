import type { RequestHandler } from "express";
import * as userService from "../services/userService";
import { getAuthenticatedUser, getValidated } from "../types/http";
import asyncHandler from "../utils/asyncHandler";
import type {
  ListUsersQuery,
  UpdateRoleBody,
  UserIdParams,
} from "../validators/userSchemas";

export const list: RequestHandler = asyncHandler(async (req, res) => {
  const { query } = getValidated<Record<string, never>, Record<string, never>, ListUsersQuery>(req);
  const result = await userService.listUsers(query);
  res.json(result);
});

export const updateRole: RequestHandler = asyncHandler(async (req, res) => {
  const administrator = getAuthenticatedUser(req);
  const { body, params } = getValidated<UpdateRoleBody, UserIdParams, Record<string, never>>(req);
  const user = await userService.updateUserRole(params.id, body.role, administrator._id);
  res.json({ data: user });
});

export const remove: RequestHandler = asyncHandler(async (req, res) => {
  const administrator = getAuthenticatedUser(req);
  const { params } = getValidated<Record<string, never>, UserIdParams, Record<string, never>>(req);
  await userService.deleteUser(params.id, administrator._id);
  res.status(204).send();
});


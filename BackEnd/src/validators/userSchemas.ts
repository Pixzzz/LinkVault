import type { UserRole } from "../models/User";
import { Joi, objectId, emptyObject } from "./common";

export interface ListUsersQuery {
  page: number;
  limit: number;
}

export interface UserIdParams {
  id: string;
}

export interface UpdateRoleBody {
  role: UserRole;
}

export const listUsersSchema = Joi.object({
  body: emptyObject,
  params: emptyObject,
  query: Joi.object<ListUsersQuery>({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }).default({ page: 1, limit: 10 }),
});

export const updateRoleSchema = Joi.object({
  body: Joi.object<UpdateRoleBody>({
    role: Joi.string().valid("user", "admin").required(),
  }).required(),
  params: Joi.object<UserIdParams>({ id: objectId.required() }).required(),
  query: emptyObject,
});

export const deleteUserSchema = Joi.object({
  body: emptyObject,
  params: Joi.object<UserIdParams>({ id: objectId.required() }).required(),
  query: emptyObject,
});

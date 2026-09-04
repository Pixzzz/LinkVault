import type { Request } from "express";
import AppError from "../utils/AppError";

export interface ValidatedPayload<
  Body = Record<string, never>,
  Params = Record<string, never>,
  Query = Record<string, never>,
> {
  readonly body: Body;
  readonly params: Params;
  readonly query: Query;
}

export const getValidated = <Body, Params, Query>(
  req: Request,
): ValidatedPayload<Body, Params, Query> => {
  if (!req.validated) {
    throw new AppError(500, "Validated request data is unavailable");
  }

  return req.validated as ValidatedPayload<Body, Params, Query>;
};

export const getAuthenticatedUser = (req: Request) => {
  if (!req.user) {
    throw new AppError(401, "Authentication is required");
  }

  return req.user;
};


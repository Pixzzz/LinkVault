import type { RequestHandler } from "express";
import type { ObjectSchema } from "joi";
import type { ValidatedPayload } from "../types/http";
import AppError from "../utils/AppError";

const validate = (schema: ObjectSchema): RequestHandler =>
  (req, _res, next): void => {
    const { error, value } = schema.validate(
      { body: req.body, params: req.params, query: req.query },
      { abortEarly: false, stripUnknown: true },
    );

    if (error) {
      next(
        new AppError(
          400,
          "Request validation failed",
          error.details.map((detail) => detail.message),
        ),
      );
      return;
    }

    const validated = value as ValidatedPayload<unknown, unknown, unknown>;
    req.body = validated.body;
    req.validated = validated;
    next();
  };

export default validate;


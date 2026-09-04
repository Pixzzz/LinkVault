import { Joi, emptyObject } from "./common";

export interface RegisterBody {
  username: string;
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

const password = Joi.string()
  .min(8)
  .max(72)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
  .messages({
    "string.pattern.base":
      "password must contain an uppercase letter, a lowercase letter and a number",
  });

export const registerSchema = Joi.object({
  body: Joi.object<RegisterBody>({
    username: Joi.string().trim().lowercase().min(3).max(30).required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: password.required(),
  }).required(),
  params: emptyObject,
  query: emptyObject,
});

export const loginSchema = Joi.object({
  body: Joi.object<LoginBody>({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().required(),
  }).required(),
  params: emptyObject,
  query: emptyObject,
});


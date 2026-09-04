const { Joi, emptyObject } = require("./common");

const password = Joi.string()
  .min(8)
  .max(72)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
  .messages({
    "string.pattern.base":
      "password must contain an uppercase letter, a lowercase letter and a number",
  });

const registerSchema = Joi.object({
  body: Joi.object({
    username: Joi.string().trim().lowercase().min(3).max(30).required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: password.required(),
  }).required(),
  params: emptyObject,
  query: emptyObject,
});

const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().required(),
  }).required(),
  params: emptyObject,
  query: emptyObject,
});

module.exports = { registerSchema, loginSchema };


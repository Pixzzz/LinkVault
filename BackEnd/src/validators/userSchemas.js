const { Joi, objectId, emptyObject } = require("./common");

const listUsersSchema = Joi.object({
  body: emptyObject,
  params: emptyObject,
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  }).default({}),
});

const updateRoleSchema = Joi.object({
  body: Joi.object({
    role: Joi.string().valid("user", "admin").required(),
  }).required(),
  params: Joi.object({ id: objectId.required() }).required(),
  query: emptyObject,
});

const deleteUserSchema = Joi.object({
  body: emptyObject,
  params: Joi.object({ id: objectId.required() }).required(),
  query: emptyObject,
});

module.exports = { listUsersSchema, updateRoleSchema, deleteUserSchema };

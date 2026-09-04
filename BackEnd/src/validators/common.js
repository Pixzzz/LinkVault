const Joi = require("joi");

const objectId = Joi.string().hex().length(24);
const emptyObject = Joi.object({}).default({});

module.exports = { Joi, objectId, emptyObject };


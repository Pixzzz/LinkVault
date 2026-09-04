const { Joi, objectId, emptyObject } = require("./common");

const bookmarkFields = {
  title: Joi.string().trim().min(1).max(150),
  description: Joi.string().trim().min(1).max(1000),
  url: Joi.string().trim().uri({ scheme: ["http", "https"] }),
  tags: Joi.array()
    .items(Joi.string().trim().lowercase().min(1).max(40))
    .max(7)
    .unique(),
};

const createBookmarkSchema = Joi.object({
  body: Joi.object({
    title: bookmarkFields.title.required(),
    description: bookmarkFields.description.required(),
    url: bookmarkFields.url.required(),
    tags: bookmarkFields.tags.default([]),
  }).required(),
  params: emptyObject,
  query: emptyObject,
});

const updateBookmarkSchema = Joi.object({
  body: Joi.object(bookmarkFields).min(1).required(),
  params: Joi.object({ id: objectId.required() }).required(),
  query: emptyObject,
});

const bookmarkIdSchema = Joi.object({
  body: emptyObject,
  params: Joi.object({ id: objectId.required() }).required(),
  query: emptyObject,
});

const listBookmarksSchema = Joi.object({
  body: emptyObject,
  params: emptyObject,
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    tag: Joi.string().trim().lowercase().max(40),
    search: Joi.string().trim().max(100),
  }).default({}),
});

module.exports = {
  createBookmarkSchema,
  updateBookmarkSchema,
  bookmarkIdSchema,
  listBookmarksSchema,
};


import { Joi, objectId, emptyObject } from "./common";

export interface BookmarkInput {
  title: string;
  description: string;
  url: string;
  tags: string[];
}

export type BookmarkUpdateInput = Partial<BookmarkInput>;

export interface BookmarkIdParams {
  id: string;
}

export interface ListBookmarksQuery {
  page: number;
  limit: number;
  tag?: string;
  search?: string;
}

const bookmarkFields = {
  title: Joi.string().trim().min(1).max(150),
  description: Joi.string().trim().min(1).max(1000),
  url: Joi.string().trim().uri({ scheme: ["http", "https"] }),
  tags: Joi.array()
    .items(Joi.string().trim().lowercase().min(1).max(40))
    .max(7)
    .unique(),
};

export const createBookmarkSchema = Joi.object({
  body: Joi.object<BookmarkInput>({
    title: bookmarkFields.title.required(),
    description: bookmarkFields.description.required(),
    url: bookmarkFields.url.required(),
    tags: bookmarkFields.tags.default([]),
  }).required(),
  params: emptyObject,
  query: emptyObject,
});

export const updateBookmarkSchema = Joi.object({
  body: Joi.object<BookmarkUpdateInput>(bookmarkFields).min(1).required(),
  params: Joi.object<BookmarkIdParams>({ id: objectId.required() }).required(),
  query: emptyObject,
});

export const bookmarkIdSchema = Joi.object({
  body: emptyObject,
  params: Joi.object<BookmarkIdParams>({ id: objectId.required() }).required(),
  query: emptyObject,
});

export const listBookmarksSchema = Joi.object({
  body: emptyObject,
  params: emptyObject,
  query: Joi.object<ListBookmarksQuery>({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    tag: Joi.string().trim().lowercase().max(40),
    search: Joi.string().trim().max(100),
  }).default({ page: 1, limit: 10 }),
});


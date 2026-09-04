import type { RequestHandler } from "express";
import * as bookmarkService from "../services/bookmarkService";
import { getAuthenticatedUser, getValidated } from "../types/http";
import asyncHandler from "../utils/asyncHandler";
import type {
  BookmarkIdParams,
  BookmarkInput,
  BookmarkUpdateInput,
  ListBookmarksQuery,
} from "../validators/bookmarkSchemas";

export const list: RequestHandler = asyncHandler(async (req, res) => {
  const user = getAuthenticatedUser(req);
  const { query } = getValidated<Record<string, never>, Record<string, never>, ListBookmarksQuery>(req);
  const result = await bookmarkService.listBookmarks(user._id, query);
  res.json(result);
});

export const create: RequestHandler = asyncHandler(async (req, res) => {
  const user = getAuthenticatedUser(req);
  const { body } = getValidated<BookmarkInput, Record<string, never>, Record<string, never>>(req);
  const bookmark = await bookmarkService.createBookmark(user._id, body);
  res.status(201).json({ data: bookmark });
});

export const getById: RequestHandler = asyncHandler(async (req, res) => {
  const user = getAuthenticatedUser(req);
  const { params } = getValidated<Record<string, never>, BookmarkIdParams, Record<string, never>>(req);
  const bookmark = await bookmarkService.getOwnedBookmark(params.id, user._id);
  res.json({ data: bookmark });
});

export const update: RequestHandler = asyncHandler(async (req, res) => {
  const user = getAuthenticatedUser(req);
  const { body, params } = getValidated<
    BookmarkUpdateInput,
    BookmarkIdParams,
    Record<string, never>
  >(req);
  const bookmark = await bookmarkService.updateBookmark(params.id, user._id, body);
  res.json({ data: bookmark });
});

export const remove: RequestHandler = asyncHandler(async (req, res) => {
  const user = getAuthenticatedUser(req);
  const { params } = getValidated<Record<string, never>, BookmarkIdParams, Record<string, never>>(req);
  await bookmarkService.deleteBookmark(params.id, user._id);
  res.status(204).send();
});


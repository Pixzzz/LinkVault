import type { QueryFilter, Types } from "mongoose";
import type { IBookmark } from "../models/Bookmark";

export interface BookmarkFilterInput {
  readonly ownerId: Types.ObjectId | string;
  readonly tag?: string;
  readonly search?: string;
}

const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildBookmarkFilter = ({
  ownerId,
  tag,
  search,
}: BookmarkFilterInput): QueryFilter<IBookmark> => {
  const filter: QueryFilter<IBookmark> = { owner: ownerId };

  if (tag) {
    filter.tags = tag;
  }

  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ title: pattern }, { description: pattern }, { url: pattern }];
  }

  return filter;
};

export default buildBookmarkFilter;

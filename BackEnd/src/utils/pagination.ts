export interface PaginationInput {
  readonly page?: unknown;
  readonly limit?: unknown;
}

export interface Pagination {
  readonly page: number;
  readonly limit: number;
  readonly skip: number;
}

export interface PaginationMetadata {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly pages: number;
}

export interface PaginatedResult<T> {
  readonly data: T[];
  readonly pagination: PaginationMetadata;
}

export const createPaginationMetadata = (
  page: number,
  limit: number,
  total: number,
): PaginationMetadata => ({
  page,
  limit,
  total,
  pages: Math.ceil(total / limit),
});

const parsePositiveInteger = (value: unknown): number | undefined => {
  if (typeof value !== "string" && typeof value !== "number") {
    return undefined;
  }

  const parsed = Number.parseInt(String(value), 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
};

const getPagination = (query: PaginationInput = {}): Pagination => {
  const page = parsePositiveInteger(query.page) ?? 1;
  const limit = Math.min(parsePositiveInteger(query.limit) ?? 10, 100);

  return { page, limit, skip: (page - 1) * limit };
};

export default getPagination;

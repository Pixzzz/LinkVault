import test from "node:test";
import assert from "node:assert/strict";
import getPagination from "../src/utils/pagination";

test("pagination uses safe defaults", () => {
  assert.deepEqual(getPagination({}), { page: 1, limit: 10, skip: 0 });
});

test("pagination calculates the correct offset", () => {
  assert.deepEqual(getPagination({ page: "3", limit: "25" }), {
    page: 3,
    limit: 25,
    skip: 50,
  });
});

test("pagination caps the page size at 100", () => {
  assert.equal(getPagination({ limit: "500" }).limit, 100);
});


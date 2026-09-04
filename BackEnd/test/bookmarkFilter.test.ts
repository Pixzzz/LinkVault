import test from "node:test";
import assert from "node:assert/strict";
import buildBookmarkFilter from "../src/utils/bookmarkFilter";

test("bookmark filters always include the owner", () => {
  assert.deepEqual(buildBookmarkFilter({ ownerId: "user-1" }), { owner: "user-1" });
});

test("bookmark search escapes regular-expression characters", () => {
  const filter = buildBookmarkFilter({ ownerId: "user-1", search: "docs.*" });
  const titleFilter = filter.$or?.[0]?.title;

  assert.ok(titleFilter instanceof RegExp);
  assert.equal(titleFilter.source, "docs\\.\\*");
});

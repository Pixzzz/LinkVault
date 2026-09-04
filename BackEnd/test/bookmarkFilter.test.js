const test = require("node:test");
const assert = require("node:assert/strict");
const buildBookmarkFilter = require("../src/utils/bookmarkFilter");

test("bookmark filters always include the owner", () => {
  assert.deepEqual(buildBookmarkFilter({ ownerId: "user-1" }), { owner: "user-1" });
});

test("bookmark search escapes regular-expression characters", () => {
  const filter = buildBookmarkFilter({ ownerId: "user-1", search: "docs.*" });
  assert.equal(filter.$or[0].title.source, "docs\\.\\*");
});

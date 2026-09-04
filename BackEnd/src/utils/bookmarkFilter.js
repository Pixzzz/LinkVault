const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildBookmarkFilter = ({ ownerId, tag, search }) => {
  const filter = { owner: ownerId };

  if (tag) {
    filter.tags = tag;
  }

  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ title: pattern }, { description: pattern }, { url: pattern }];
  }

  return filter;
};

module.exports = buildBookmarkFilter;


const mongoose = require("mongoose");
const config = require("../config/env");
const { connectDatabase, disconnectDatabase } = require("../config/database");

const migrate = async () => {
  await connectDatabase();

  const collection = mongoose.connection.collection("bookmarks");
  const result = await collection.updateMany(
    { owner: { $exists: false }, userID: { $exists: true } },
    { $rename: { userID: "owner" } },
  );

  console.log(`Migrated ${result.modifiedCount} bookmark documents`);
};

migrate()
  .catch((error) => {
    console.error("Bookmark migration failed", error);
    process.exitCode = 1;
  })
  .finally(disconnectDatabase);


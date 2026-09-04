import mongoose from "mongoose";
import { connectDatabase, disconnectDatabase } from "../config/database";

const migrate = async (): Promise<void> => {
  await connectDatabase();

  const collection = mongoose.connection.collection("bookmarks");
  const result = await collection.updateMany(
    { owner: { $exists: false }, userID: { $exists: true } },
    { $rename: { userID: "owner" } },
  );

  console.log(`Migrated ${result.modifiedCount} bookmark documents`);
};

void migrate()
  .catch((error: unknown) => {
    console.error("Bookmark migration failed", error);
    process.exitCode = 1;
  })
  .finally(disconnectDatabase);


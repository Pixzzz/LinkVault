const mongoose = require("mongoose");
const config = require("./env");

const connectDatabase = async () => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(config.mongodbUri);
};

const disconnectDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

module.exports = { connectDatabase, disconnectDatabase };


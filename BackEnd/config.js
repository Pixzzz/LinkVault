require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  mongodb: {
    uri:
      process.env.MONGODB_URI ||
      "MONGODB_URI=mongodb+srv://elemoreta_db_user:vAwh7yenmOkiyeJE@linkvaultcluster1.98ynxiz.mongodb.net/?appName=LinkVaultCluster1",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};

module.exports = config;

require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  enviroment: process.env.NODE_ENV || "development",
  mongodb: {
    uri:
      process.env.MONGODB_URI ||
      "MONGODB_URI=mongodb+srv://elemoreta_db_user:vAwh7yenmOkiyeJE@linkvaultcluster1.98ynxiz.mongodb.net/?appName=LinkVaultCluster1",
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessTokenExpiry: process.env.JWT_EXPIRES_IN || "1h",
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d",
  },
  api: {
    name: "LinkVault API",
    version: "1.0.0",
    baseURL: process.env.API_BASE_URL || "http://localhost:3000/api/v1",
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  },
};

module.exports = config;

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const { swaggerUI, swaggerSpec } = require("./Swagger/swaggerConfig.js");
const config = require("./config.js");
const app = express();

app.use(helmet());
mongoose.connect(config.mongodb.uri);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  }),
);

app.use("/api/v1/bookmarks", require("./endpoints/BookMarks.js"));
app.use("/api/v1/users", require("./endpoints/user.js"));

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use("/", (req, res) => {
  res.json({
    name: "LinkVault",
    version: "1.0.0",
    status: "running",
    endpoints: {
      users: "/api/v1/users",
      bookmarks: "/api/v1/bookmarks",
      docs: "/api-docs",
    },
  });
});

app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found", path: req.path });
});

module.exports = app;

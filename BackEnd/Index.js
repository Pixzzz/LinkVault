require("dotenv").config();
const app = require("./app.js");
const config = require("./config.js");
const { connect } = require("./util/db.js");

const startServer = async () => {
  try {
    await connect();
    console.log("Database connected");

    app.listen(config.port, () => {
      console.log(`API running on http://localhost:${config.port}`);
      console.log(`Docs on http://localhost:${config.port}/api-docs`);
    });
  } catch (error) {
    console.error("Failed to connect server", error);
    process.exit(1);
  }
};

startServer();
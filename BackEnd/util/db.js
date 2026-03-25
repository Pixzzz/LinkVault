const mongoose = require("mongoose");
const config = require("../config.js");

const connect = async () => {
  try {
    await mongoose.connect(config.mongodb.uri, {
      userNewUrlParser: true,
      userUnifiedTopology: true,
    });
    console.log("Mongoose connected");
  } catch (error) {
    console.error("Mongoose connection error", error);
    throw error;
  }
};

const disconnect = async () => {
    try {
        await mongoose.disconnect();
        console.log("Disconnected from mongoDB");
    } catch (error) {
        console.error("Mongoose error disconnection", error)
    }
};

module.exports = {connect, disconnect};

const mongoose = require("mongoose");


require("dotenv").config();

const mongoURL = process.env.MONGODB_URL_LOCAL;
// set up the mongodb connection

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get the default connection
// Mongoose maintains a default connection object representing the mongodb coneection

const db = mongoose.connection;

// define even listeners for database connection

db.on("connected", () => {
  console.log("connected to Mongodb server");
});

db.on("error", (err) => {
  console.error("MongoDb connection error:", err);
});

db.on("disconnected", () => {
  console.log("MongoDb disconnected");
});

module.exports = { db };

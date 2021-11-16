const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

// LOAD ENV VARS
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// DB CONNECTION
const connect = () => {
  const DB_URI = process.env.DB_URI;
  mongoose
    .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => {
      console.log("db connected");
    })
    .catch((err) => {
      console.log(`db failed to connect ${err}`);
    });
};

// DB DISCONNECT
const disconnect = async () => {
  return await mongoose.connection.close();
};

// EXPORT MODULE
module.exports = connect;

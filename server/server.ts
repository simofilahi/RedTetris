import express, { Request, Response, Application } from "express";
import { Model } from "mongoose";
const bodyParser = require("body-parser");
const cors = require("cors");

const path = require("path");
const GameModel = require("./models/game");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// LOAD ENV VARS
dotenv.config({ path: ".env" });

// INIT THE APP
const app: Application = express();

// DB CONNECTION
require("./config/connection");

const server = require("http").createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: { origin: "*" },
});

require("./socket/")(io);

// CORS
app.use(cors());

// PARSER
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const buildPath = path.normalize(path.join(__dirname, "../client/build"));

app.use(express.static(buildPath));

// console.log(path.dirname(filename).split(path.sep).pop());

app.get("/", async (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// SERVER PORT
const PORT = 1337;

server.listen(PORT, (): void => {
  console.log(`Server Running here 👉 http://localhost:${PORT}`);
});

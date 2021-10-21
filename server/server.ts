import express, { Request, Response, Application } from "express";
const bodyParser = require("body-parser");
const cors = require("cors");
import Player from "./utils/Player";

// INIT THE APP
const app: Application = express();

const server = require("http").createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket: any) => {
  const player = new Player();

  io.on("left-key", () => {
    player.moveToLeft();
    socket.emit("map", player.getMap());
  });

  io.on("right-key", () => {
    player.moveToRight();
    socket.emit("map", player.getMap());
  });

  io.on("down-key", () => {
    player.moveDown();
    socket.emit("map", player.getMap());
  });

  io.on("rotate", () => {
    player.rotate();
    socket.emit("map", player.getMap());
  });

  socket.emit("map", player.getMap());
});

// CORS
app.use(cors());

// PARSER
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// TESTING ENDPOINT
app.get("/api/", (req, res) => {
  res.send("Hello from api!");
});

// SERVER PORT
const PORT = 1337;

server.listen(PORT, (): void => {
  console.log(`Server Running here 👉 http://localhost:${PORT}`);
});

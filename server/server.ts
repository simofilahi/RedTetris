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

  socket.on("left-key", () => {
    player.moveToLeft();
    socket.emit("map", player.getMap());
  });

  socket.on("right-key", () => {
    player.moveToRight();
    socket.emit("map", player.getMap());
  });

  setInterval(() => {
    player.moveDown();
    if (player.gameOver) socket.emit("gameOver", true);
    else socket.emit("map", player.getMap());
  }, 800);

  socket.on("down-key", () => {
    player.moveDown();
    console.log(player.gameOver);
    if (player.gameOver) {
      socket.emit("gameOver", true);
    } else {
      socket.emit("map", player.getMap());
    }
  });

  socket.on("rotate", () => {
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

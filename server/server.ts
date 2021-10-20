import express, { Request, Response, Application } from "express";
const bodyParser = require("body-parser");
const cors = require("cors");

// INIT THE APP
const app: Application = express();

const server = require("http").createServer(app);

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket: any) => {
  const player = new Player();

  player.game.on("data", (data: any) => {
    socket.emit("map");
  });

  console.log("a user connected");
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

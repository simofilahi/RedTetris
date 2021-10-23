import Player from "../utils/Player";
const GameModel = require("../models/game");

async function joinToGame(
  socket: any,
  roomTitle: any,
  playerName: any,
  cb: any
) {
  try {
    const game = await GameModel.find({ title: roomTitle });
    let doc;

    if (!game?.length) {
      doc = new GameModel({
        title: roomTitle,
      });
      doc.players.push({ name: playerName, leader: true });
      await doc.save();
    } else {
      doc = await GameModel.findOneAndUpdate(
        { title: roomTitle },
        { $push: { players: { name: playerName } } },
        { new: true }
      );
    }
    console.log({ doc });
    console.log("doc.id:", doc._id.toString());
    socket.data.player = new Player();
    socket.join(doc._id.toString());
    cb(false, { roomTitle, playerName });
  } catch (e) {}
}

async function orderToStartTheGameByLeader(
  socket: any,
  roomTitle: any,
  playerName: any
) {
  const game = await GameModel.findOne({ roomTitle });

  if (game.players[0]["name"] === playerName && game.players[0]["leader"]) {
    console.log({ game });
    socket.to(game._id.toString()).emit("game-started");
    socket.emit("game-started");
  }
}

async function StartGame(socket: any) {
  setInterval(() => {
    socket.data.player.moveDown();
    socket.emit("map", socket.data.player.getMap());
    if (socket.data.player.gameOver) {
      socket.emit("gameOver", true);
    }
  }, 500);
}

function moveToleft(socket: any) {
  socket.data.player.moveToLeft();
  socket.emit("map", socket.data.player.getMap());
}

function moveToRight(socket: any) {
  socket.data.player.moveToRight();
  socket.emit("map", socket.data.player.getMap());
}

function moveDown(socket: any) {
  socket.data.player.moveDown();
  socket.emit("map", socket.data.player.getMap());
  console.log(socket.data.player.gameOver);
  if (socket.data.player.gameOver) {
    socket.emit("gameOver", true);
  }
}

function rotate(socket: any) {
  socket.data.player.rotate();
  socket.emit("map", socket.data.player.getMap());
}

module.exports = (io: any) => {
  io.on("connection", (socket: any) => {
    console.log("connected");

    // Join to the game
    socket.on("join", async ({ roomTitle, playerName }: any, cb: any) => {
      console.log("JOIN");
      joinToGame(socket, roomTitle, playerName, cb);
    });

    // Start the game
    socket.on("start", async ({ roomTitle, playerName }: any) => {
      orderToStartTheGameByLeader(socket, roomTitle, playerName);
    });

    socket.on("start-playing", async () => {
      StartGame(socket);
    });

    // Move shape to the left;
    socket.on("left-key", () => {
      moveToleft(socket);
    });

    // Move shpae to the right
    socket.on("right-key", () => {
      moveToRight(socket);
    });

    // Move shape down
    socket.on("down-key", () => {
      moveDown(socket);
    });

    // Rotate the shape
    socket.on("rotate", () => {
      rotate(socket);
    });
  });
};

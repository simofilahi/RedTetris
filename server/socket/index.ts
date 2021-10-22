import Player from "../utils/Player";
const GameModel = require("../models/game");

function joinToGame(socket: any) {
  socket.on("join", async ({ roomTitle, playerName }: any) => {
    const game = await GameModel.find({ title: roomTitle });
    let doc;

    if (!game?.length) {
      doc = new GameModel({
        title: roomTitle,
      });
      doc.players.push({ name: playerName, leader: true });
      await doc.save();
    } else {
      await GameModel.findOneAndUpdate(
        { title: roomTitle },
        { $push: { players: { name: playerName } } },
        { new: true }
      );
    }
    console.log("doc.id:", doc._id);
    socket.join(doc._id);
  });
}

function startTheGame(socket: any) {
  socket.on("start", async ({ roomTitle, playerName }: any) => {
    const game = await GameModel.findOne({ roomTitle });

    if (game.players["name"] === playerName && game.players["leader"]) {
    }
  });
}

function moveToleft(socket: any) {
  socket.on("left-key", () => {
    player.moveToLeft();
    socket.emit("map", player.getMap());
  });
}

function moveToRight(socket: any) {
  socket.on("right-key", () => {
    player.moveToRight();
    socket.emit("map", player.getMap());
  });
}

function moveDown(socket: any) {
  socket.on("down-key", () => {
    player.moveDown();
    console.log(player.gameOver);
    if (player.gameOver) {
      socket.emit("gameOver", true);
    } else {
      socket.emit("map", player.getMap());
    }
  });
}

function rotate(socket: any) {
  socket.on("rotate", () => {
    player.rotate();
    socket.emit("map", player.getMap());
  });
}

module.exports = (io: any) => {
  io.on("connection", (socket: any) => {
    // const player = new Player();

    // Join to the game
    joinToGame(socket);

    // Start the game
    startTheGame(socket);

    // Move shape to the left;
    moveToleft(socket);

    // Move shpae to the right
    moveToRight(socket);

    // Move shape down
    moveDown(socket);

    // Rotate the shape
    rotate(socket);
  });
};

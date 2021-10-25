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
    const roomId = doc._id.toString();
    socket.join(roomId);
    cb(false, { roomTitle, playerName, roomId });
  } catch (e) {}
}

async function orderToStartTheGameByLeader(
  socket: any,
  roomTitle: any,
  playerName: any
) {
  const game = await GameModel.findOne({ roomTitle });

  if (game.players[0]["name"] === playerName && game.players[0]["leader"]) {
    socket.to(game._id.toString()).emit("game-started");
    socket.emit("game-started");
  }
}

async function StartGame(socket: any, userData: any) {
  setInterval(() => {
    socket.data.player.moveDown();
    socket.emit("map", socket.data.player.getMap());
    console.log("ROOM ID", userData);
    socket.to(userData.roomId).emit("spectrum-map", {
      spectrum: socket.data.player.getlandSpectrum(),
      playerName: userData.playerName,
    });
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

function moveDown(socket: any, userData: any) {
  socket.data.player.moveDown();
  socket.emit("map", socket.data.player.getMap());
  console.log("ROOM ID", userData.roomId);
  socket.to(userData.roomId).emit("spectrum-map", {
    spectrum: socket.data.player.getlandSpectrum(),
    playerName: userData.playerName,
  });
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

    socket.on("start-playing", async (userData: any) => {
      console.log("start playing");
      console.log({ userData });
      StartGame(socket, userData);
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
    socket.on("down-key", (userData: any) => {
      console.log("DOWN KEY");

      moveDown(socket, userData);
    });

    // Rotate the shape
    socket.on("rotate", () => {
      rotate(socket);
    });
  });
};

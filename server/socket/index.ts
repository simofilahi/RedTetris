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
    const roomId = doc._id.toString();
    socket.data.player = new Player();
    socket.data.userData = { roomTitle, playerName, roomId: roomId };
    socket.join(roomId);
    cb(false, { roomTitle, playerName, roomId });
  } catch (e) {}
}

async function orderToStartTheGameByLeader(socket: any) {
  const { playerName, roomTitle } = socket.data.userData;
  const game = await GameModel.findOne({ roomTitle });

  if (game.players[0]["name"] === playerName && game.players[0]["leader"]) {
    socket.to(game._id.toString()).emit("game-started");
    socket.emit("game-started");
  }
}

async function StartGame(socket: any) {
  setInterval(() => {
    const { playerName, roomId } = socket.data.userData;
    const player = socket.data.player;

    player.moveDown();
    if (player.removedLinesCount) {
      socket.to(roomId).emit("drop-rows-count", player.removedLinesCount);
      player.removedLinesCount = 0;
    }

    socket.emit("map", player.getMap());
    socket.to(roomId).emit("spectrum-map", {
      spectrum: player.getlandSpectrum(),
      playerName: playerName,
    });
    if (player.gameOver) {
      socket.emit("gameOver", true);
    }
  }, 500);
}

function moveToleft(socket: any) {
  const player = socket.data.player;
  player.moveToLeft();
  socket.emit("map", player.getMap());
}

function moveToRight(socket: any) {
  const player = socket.data.player;
  player.moveToRight();
  socket.emit("map", player.getMap());
}

function moveDown(socket: any) {
  const { playerName, roomId } = socket.data.userData;
  const player = socket.data.player;

  player.moveDown();
  if (player.removedLinesCount) {
    socket.to(roomId).emit("drop-rows-count", player.removedLinesCount);
    player.removedLinesCount = 0;
  }
  socket.emit("map", player.getMap());
  socket.to(roomId).emit("spectrum-map", {
    spectrum: player.getlandSpectrum(),
    playerName: playerName,
  });
  if (player.gameOver) {
    socket.emit("gameOver", true);
  }
}

function AddLines(socket: any, rowsCount: any) {
  const player = socket.data.player;
  const { roomId, playerName } = socket.data.userData;

  if (rowsCount) {
    player.addRows(rowsCount);
    socket.emit("map", player.getMap());
    socket.to(roomId).emit("spectrum-map", {
      spectrum: player.getlandSpectrum(),
      playerName: playerName,
    });
  }
}

function rotate(socket: any) {
  const player = socket.data.player;
  player.rotate();
  socket.emit("map", player.getMap());
}

module.exports = (io: any) => {
  io.on("connection", (socket: any) => {
    // console.log("connected");

    // Join to the game
    socket.on("join", async ({ roomTitle, playerName }: any, cb: any) => {
      // console.log("JOIN");
      joinToGame(socket, roomTitle, playerName, cb);
    });

    // Start the game
    socket.on("start", () => {
      orderToStartTheGameByLeader(socket);
    });

    // Start playing
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
      // console.log("DOWN KEY");

      moveDown(socket);
    });

    // Rotate the shape
    socket.on("rotate", () => {
      rotate(socket);
    });

    socket.on("drop-rows-count", (rowsCount: any) => {
      AddLines(socket, rowsCount);
    });

    // socket.on("disconnect", () => {
    //   console.log("On disconnect");
    //   socket.data.player = null;
    //   socket.data.userData = null;
    // });
  });
};

import Player from "../utils/Player";
const GameModel = require("../models/game");

// UTILS

// GET THE SOCKET INSTANCES COUNT JOINED INTO THE SAME ROOMID
async function getSocketInstanceCount(
  io: any,
  roomId: number
): Promise<number> {
  const sockets = await io.in(roomId).fetchSockets();
  const subscribersCount = sockets.length;
  return subscribersCount;
}

// GET THE SPECTRUM OF CURRENT PLAYER AND SEND IT TO OTHER PLAYERS
function getSpectrumMap(socket: any, { roomId, player, playerName }: any) {
  socket.to(roomId).emit("spectrum-map", {
    spectrum: player.getlandSpectrum(),
    playerName: playerName,
  });
}

// CHECK THE GAME IF OVER FOR CURRENT SOCKET
function checkGameOver(socket: any, { player, roomId }: any) {
  if (player.gameOver) {
    // SEND TO THE CURRENT PLAYER GAME OVER
    socket.emit("gameOver", true);
    // LEAVE THIS PLAYER FROM GAME ROOM
    socket.leave(roomId);
    // STOP INTERVAL
    socket.data.player = null;
    return true;
  }
  return false;
}

// CHECK IF SOME ROWS OF CURRENT PLAYER'S DROPPED
function droppedRows(socket: any, { player, roomId }: any) {
  if (player.removedLinesCount) {
    // SEND THE COUNT OF FULL ROWS TO OTHER PLAYERS THAT JOINED IN THE SAME ROOM
    socket.to(roomId).emit("add-unusable-rows", player.removedLinesCount);
    // SET FULL ROWS COUNT TO 0;
    player.removedLinesCount = 0;
  }
}

// SET SOCKET DATA TO NULL FOR ALL CLIENT
function setSocketData(io: any) {}

async function checkWinner(io: any, socket: any, { roomId }: any) {
  if ((await getSocketInstanceCount(io, roomId)) == 1) {
    socket.to(roomId).emit("winner");
    io.socketsLeave(roomId);
    // clearInterval(interval);
    return true;
  }
  return false;
}
//

// JOINING THE GAME ROOM
async function joinToGame(
  socket: any,
  roomTitle: any,
  playerName: any,
  cb: any
) {
  try {
    // LOOK FOR GAME IF IT'S CREATED IN THE BACKEND
    const game = await GameModel.find({ title: roomTitle });

    let doc;

    // IN CASE NO GAME FOUND WITH GIVEN NAME
    if (!game?.length) {
      // CREATE DB DOC
      doc = new GameModel({
        title: roomTitle,
      });

      // ADD PLAYER TO PLAYER ARR
      doc.players.push({ name: playerName, leader: true });

      // SAVE DOC
      await doc.save();
    } else {
      // FIND THE GAME AND UPDATE IT BY ADDING NEW PLAYER TO PLAYERS ARRAY IN DB
      doc = await GameModel.findOneAndUpdate(
        { title: roomTitle },
        { $push: { players: { name: playerName } } },
        { new: true }
      );
    }

    // GET THE ROOM_ID FROM THE DOC
    const roomId = doc._id.toString();

    // CREATE NEW INSTANCE AND ADD IT TO PLAYER SOCKET DATA
    socket.data.player = new Player();

    // CREATE USERDATA IN SOCKET DATA
    socket.data.userData = { roomTitle, playerName, roomId: roomId };

    // ADD CURRENT SOCKET TO A ROOM
    socket.join(roomId);

    // SHARE THE DATA WITH THE CLIENT BY A CALLBACK
    cb(false, { roomTitle, playerName, roomId });
  } catch (e) {}
}

// ORDER EVENT FROM GAME LEADER TO START THE GAME
async function orderToStartTheGameByLeader(socket: any) {
  const { playerName, roomTitle } = socket.data.userData;

  // LOOK FOR GAME NAME IF IT'S ALREADY CREATED IN DB
  const game = await GameModel.findOne({ roomTitle });

  // INCOMING USER ORDER EVENT SHOULD MATCH THE FRIST ONE WHO JOINED THE GAME
  if (game?.players[0]["name"] === playerName && game?.players[0]["leader"]) {
    // EMIT GAME STARTD EVENT TO ALL PLAYERS JOINED TO THE GAME ROOM ID EXCEPT THE LEADER
    socket.to(game._id.toString()).emit("game-started");

    // EMIT GAME STARTD EVENT TO THE LEADER
    socket.emit("game-started");
  }
}

// START TH GAME FOR ALL PLAYERS JOINED TO THE SAME GAME
async function StartGame(socket: any, io: any, interval: any) {
  interval = setInterval(falling, 500);

  async function falling() {
    const { playerName, roomId } = socket.data.userData;
    const player = socket.data.player;

    console.log({ playerName, interval });
    // CHECK THE GAME WINNER
    if (await checkWinner(io, socket, { roomId })) {
      clearInterval(interval);
    }

    // MOVE THE TETRIS SHAPE DOWN IN PALYER MAP
    player.moveDown();

    // CHECK IF SOME ROWS OF CURRENT PLAYER'S DROPPED
    droppedRows(socket, { player, roomId });

    // GET THE SPECTRUM MAP AND SEND IT TO OTHER PLAYER IN THE SAME ROOM
    socket.emit("map", player.getMap());

    // GET THE SPECTRUM MAP AND SEND IT TO OTHER PLAYER IN THE SAME ROOM
    getSpectrumMap(socket, { player, playerName, roomId });

    // CHECK THE MAP OF CURRENT PLAYER IS IT FULL
    if (checkGameOver(socket, { player, roomId })) {
      clearInterval(interval);
    }
  }
}

// MOVE SHAPE TO THE LEFT
function moveToleft(socket: any) {
  const player = socket.data.player;

  // MOVE TETRIS SHAPE OF CURRENT PLAYER'S MAP TO THE LEFT
  player.moveToLeft();

  //  GET THE UPDATED MAP AND SEND IT BACK TO THE CURRENT PLAYER
  socket.emit("map", player.getMap());
}

// MOVE SHAPE TO THE RIGHT
function moveToRight(socket: any) {
  const player = socket.data.player;

  // MOVE TETRIS SHAPE OF CURRENT PLAYER'S MAP TO THE RIGHT
  player.moveToRight();

  // GET THE UPDATED MAP AND SEND IT BACK TO THE CURRENT PLAYER
  socket.emit("map", player.getMap());
}

// MOVE SHAPE DOWN
async function moveDown(socket: any, io: any, interval: any) {
  const { playerName, roomId } = socket.data.userData;
  const player = socket.data.player;

  console.log({ playerName });
  // PLAYER MOVE TETRIS SHAPE DOWN IN ITS MAP
  player.moveDown();

  // CHECK THE WINNER OF GAME
  if (await checkWinner(io, socket, { interval, roomId })) {
    clearInterval(interval);
  }

  // MOVE THE TETRIS SHAPE DOWN IN PALYER MAP
  player.moveDown();

  // CHECK IF SOME ROWS OF CURRENT PLAYER'S DROPPED
  droppedRows(socket, { player, roomId });

  // GET THE SPECTRUM MAP AND SEND IT TO OTHER PLAYER IN THE SAME ROOM
  socket.emit("map", player.getMap());

  // GET THE SPECTRUM MAP AND SEND IT TO OTHER PLAYER IN THE SAME ROOM
  getSpectrumMap(socket, { player, playerName, roomId });

  // CHECK THE MAP OF CURRENT PLAYER IS IT FULL
  if (checkGameOver(socket, { player, roomId, interval })) {
    clearInterval(interval);
  }
}

// ADD NEW ROWS TO THE MAP
function AddLines(socket: any, rowsCount: any) {
  const player = socket.data.player;
  const { roomId, playerName } = socket.data.userData;

  if (rowsCount) {
    // ADD ROW COUNT TO THE MAP OF OTHER PLAYER
    player.addRows(rowsCount);

    // GET THE UPDATED MAP AND SEND IT TO THE PLAYER
    socket.emit("map", player.getMap());

    /* GET THE SPECTRUM MAP OF THE CURRENT PLAYER 
    AND SEND IT TO ALL OTHER PLAYER IN THE SAME ROOM JOINED */
    socket.to(roomId).emit("spectrum-map", {
      spectrum: player.getlandSpectrum(),
      playerName: playerName,
    });
  }
}

// HANDLING ROTATTION SOCKET EVENT
function rotate(socket: any) {
  const player = socket.data.player;

  // PLAYER ROTATE THE SHAPE
  player.rotate();

  // GET THE NEW UPDATED MAP AND SEND IT BACK TO THE PLAYER
  socket.emit("map", player.getMap());
}

module.exports = (io: any) => {
  io.on("connection", (socket: any) => {
    let interval: any;

    // JOIN THE GAME
    socket.on("join", async ({ roomTitle, playerName }: any, cb: any) => {
      joinToGame(socket, roomTitle, playerName, cb);
    });

    // ORDER TO START THE GAME
    socket.on("start-order", () => {
      orderToStartTheGameByLeader(socket);
    });

    // START PLAYING
    socket.on("start-playing", async () => {
      StartGame(socket, io, interval);
    });

    // MOVE SHAPE TO THE LEFT
    socket.on("left-key", () => {
      moveToleft(socket);
    });

    // MOVE SHAPE TO THE RIGHT
    socket.on("right-key", () => {
      moveToRight(socket);
    });

    // MOVE SHAPE DOWN
    socket.on("down-key", () => {
      moveDown(socket, io, interval);
    });

    // ROTATE THE SHAPE
    socket.on("rotate", () => {
      rotate(socket);
    });

    // ADD UNUSABLE ROWS TO THE MAP
    socket.on("add-unusable-rows", (rowsCount: any) => {
      AddLines(socket, rowsCount);
    });

    // IF SOCKET CLIENT DISCOONECTED
    // socket.on("disconnect", () => {
    //   socket.data.player = null;
    //   socket.data.userData = null;
    // });
  });
};

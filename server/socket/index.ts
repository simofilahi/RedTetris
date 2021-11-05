import { clear } from "console";
import Player from "../utils/Player";
import ShapesFactory from "../utils/shapesFactory";
const GameModel = require("../models/game");
const mongoose = require("mongoose");

// INTERFACES
interface userData {
  roomId?: number;
  roomTitle?: string;
  playerName?: string;
  player?: any;
  multiplayer?: boolean;
}

// UTILS

// GET THE SOCKET INSTANCES COUNT JOINED INTO THE SAME ROOMID
async function getSocketInstanceCount(
  io: any,
  roomId: number | undefined
): Promise<number> {
  const sockets = await io.in(roomId).fetchSockets();
  const subscribersCount = sockets.length;
  return subscribersCount;
}

// GET THE SPECTRUM OF CURRENT PLAYER AND SEND IT TO OTHER PLAYERS
function getSpectrumMap(
  socket: any,
  { roomId, player, playerName }: userData
): void {
  socket.to(roomId).emit("spectrum-map", {
    spectrum: player.getlandSpectrum(),
    playerName: playerName,
  });
}

// CHECK THE GAME IF OVER FOR CURRENT SOCKET
function checkGameOver(socket: any, { player, roomId }: userData): boolean {
  if (player.gameOver) {
    // SEND TO THE CURRENT PLAYER GAME OVER
    socket.emit("gameOver", true);

    // LEAVE THIS PLAYER FROM GAME ROOM
    socket.leave(roomId);

    // RESET THE GAME DATA FOR THAT CURRENT PLAYER TO NULL
    socket.data.gameData.player = null;

    return true;
  }
  return false;
}

// CHECK IF SOME ROWS OF CURRENT PLAYER'S DROPPED
function droppedRows(socket: any, { player, roomId }: userData): void {
  if (player.removedLinesCount) {
    // SEND THE COUNT OF FULL ROWS TO OTHER PLAYERS THAT JOINED IN THE SAME ROOM
    socket.to(roomId).emit("add-unusable-rows", player.removedLinesCount);
    // SET FULL ROWS COUNT TO 0;
    player.removedLinesCount = 0;
  }
}

// FIND A PLAYER IF IS ALREADY IN GAME DOC
function findPlayer(players: any, playerName: any): boolean {
  return players.some((item: any) => {
    return item.name === playerName;
  });
}

// GET PLAYER ROLE FROM DB DOC
function getPlayerRole(players: any, playerName: any): string {
  for (let i = 0; i < players.length; i++) {
    if (players[i].name === playerName) return players[i].role;
  }
  return "follower";
}

async function checkWinner(
  io: any,
  socket: any,
  roomId: number | undefined,
  multiplayer: boolean | undefined
): Promise<boolean> {
  if (multiplayer && (await getSocketInstanceCount(io, roomId)) < 2) {
    // SEND WINNER
    socket.emit("winner");

    // CURRENT PLAYER LEAVE THE ROOM
    socket.leave(roomId);

    // RESET THE GAME DATA FOR THAT CURRENT PLAYER TO NULL
    socket.data.gameData.player = null;

    // DROP THE GAME DOC
    dropGameDocByWinner(socket);

    return true;
  }
  return false;
}

// GET THE MAP OF CURRENT OF CURRENT PLAYER
async function getMap(socket: any, player: any) {
  socket.emit("map", player.getMap());
}

// GET THE SCORE OF CURRENT PLAYER
async function getScore(socket: any, player: any) {
  socket.emit("score", player.getScore());
}

// GET DROPPED LINE COUNT OF CURRENT PLAYER
async function getDroppedLineCount(socket: any, player: any) {
  socket.emit("dropped-lines", player.getDroppedRowsCount());
}

// GET THE NEXT TETRIS SHAPE OF CURRENT PLAYER
async function getNextShape(socket: any, player: any) {
  socket.emit("next-shape", player.getNextShape());
}

// DROP THE GAME DOC AT THE END
async function dropGameDoc(socket: any) {
  if (socket.data.userData) {
    const { roomId } = socket.data.userData;

    // FIND THE GAME ROOM DOC
    const game = await GameModel.find({ roomId });

    // VERIFY IF THE GAME IS NOT CONCERN MULTIPLAYERS
    if (!game[0].multiplayer) {
      // DELETE THE GAME ROOM
      await GameModel.deleteOne({ roomId });
    }
  }
}

// DROP THE GAME DOC AT THE END BY WINNER
async function dropGameDocByWinner(socket: any) {
  try {
    const { roomId } = socket.data.userData;

    await GameModel.deleteOne({ roomId });
  } catch {}
}
//

// JOINING THE GAME ROOM
async function joinToGame(
  socket: any,
  { roomTitle, playerName, multiplayer }: userData,
  cb: any
) {
  try {
    console.log(multiplayer);
    if (!multiplayer) {
      roomTitle = mongoose.Types.ObjectId().toString();
      playerName = "anonymous";
    }

    console.log({ roomTitle });
    // LOOK FOR GAME IF IT'S CREATED IN THE BACKEND
    let game = await GameModel.find({ title: roomTitle });

    // DOC VARIABLE WILL HOLD THE DATA OF THE ROOM
    let doc;

    // IN CASE NO GAME FOUND WITH GIVEN NAME
    if (!game?.length) {
      // CREATE DB DOC
      doc = new GameModel({
        title: roomTitle,
        multiplayer: multiplayer,
      });

      // ADD PLAYER TO PLAYER ARR, THE FIRST ONE WILL BE THE LEADER OF THE GAME
      doc.players.push({ name: playerName, role: "leader" });

      // SAVE DOC
      await doc.save();
    } else if (findPlayer(game[0].players, playerName)) {
      /*
        IN CASE THE GAME ROOM HAVE THAT PLAYER WHO SEND THE REQUEST TO JOIN,
      */
      doc = game[0];
    } else if (
      game[0]?.players.length < 2 &&
      !findPlayer(game[0].players, playerName)
    ) {
      /*
        IN CASE THE GAME ROOM STILL HAVING LESS THAN TWO PLAYERS,
        AND THE INCOMING REQUEST FROM A PLAYER WHO DOESN'T IN GAME ROOM
      */

      // FIND THE GAME AND UPDATE IT BY ADDING NEW PLAYER TO PLAYERS ARRAY IN DB
      doc = await GameModel.findOneAndUpdate(
        { title: roomTitle },
        { $push: { players: { name: playerName } } },
        { new: true }
      );
    } else {
      console.log("You cannot join");
      return;
    }

    // GET THE ROOM_ID FROM THE DOC
    const roomId: string = doc._id.toString();

    // GET THE PLAYER ROLE
    const playerRole: string = getPlayerRole(doc?.players, playerName);

    /* 
      - CREATE NEW  PLAYER INSTANCE AND ADD IT TO PLAYER SOCKET DATA
      - ADD INTERVAL VARIABLE FOR SETINTERVAL TO CLEAR IT AT THE END OF GAME
    */
    socket.data.gameData = {};
    socket.data.gameData["player"] = new Player(roomId);

    // CREATE USERDATA IN SOCKET DATA
    socket.data.userData = {
      roomTitle,
      playerName,
      roomId,
      playerRole,
    };

    // ADD CURRENT SOCKET TO A ROOM
    socket.join(roomId);

    // SHARE THE DATA WITH THE CLIENT BY A CALLBACK
    cb(false, { roomTitle, playerName, roomId, playerRole });
  } catch (e) {
    console.log({ e });
  }
}

// ORDER EVENT FROM GAME LEADER TO START THE GAME
async function orderToStartTheGameByLeader(socket: any) {
  const { playerName, roomTitle }: userData = socket.data.userData;

  // LOOK FOR GAME NAME IF IT'S ALREADY CREATED IN DB
  const game = await GameModel.findOne({ roomTitle });

  console.log({ game });
  // INCOMING USER ORDER EVENT SHOULD MATCH THE FRIST ONE WHO JOINED THE GAME
  if (
    game?.players[0]["name"] === playerName &&
    game?.players[0]["role"] === "leader"
  ) {
    console.log("Here order ");
    // EMIT GAME STARTD EVENT TO ALL PLAYERS JOINED TO THE GAME ROOM ID EXCEPT THE LEADER
    socket.to(game._id.toString()).emit("game-started");

    // EMIT GAME STARTD EVENT TO THE LEADER
    socket.emit("game-started");
  }
}

// START TH GAME FOR ALL PLAYERS JOINED TO THE SAME GAME
async function StartGame(socket: any, io: any) {
  const { playerName, roomId, multiplayer }: userData = socket.data.userData;

  const { player } = socket.data.gameData;
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  for (;;) {
    await delay(500);

    // CHECK IF CURRENT PLAYER LOSES
    if (checkGameOver(socket, { player, roomId })) {
      return;
    }

    // CHECK THE GAME WINNER
    if (await checkWinner(io, socket, roomId, multiplayer)) {
      return;
    }

    // GET THE NEXT TETRIS SHAPE AND SEND IT TO THE CURRENT PLAYER
    getNextShape(socket, player);

    // MOVE THE TETRIS SHAPE DOWN IN PALYER MAP
    player.moveDown();

    // CHECK IF SOME ROWS OF CURRENT PLAYER'S DROPPED
    droppedRows(socket, { player, roomId });

    // GET THE  MAP AND SEND IT TO OTHER PLAYER IN THE SAME ROOM
    getMap(socket, player);

    // GET THE THE SCORE AND SEND IT TO THE CURRENT PLAYER
    getScore(socket, player);

    // GET THE DROPPED LINES AND SENT IT TO THE CURRENT PLAYER
    getDroppedLineCount(socket, player);

    // GET THE SPECTRUM MAP OF CURRENT PLAYER AND SEND IT TO OTHER PLAYER IN THE SAME ROOM
    getSpectrumMap(socket, { player, playerName, roomId });
  }
}

// MOVE SHAPE TO THE LEFT
function moveToleft(socket: any) {
  const { player } = socket.data.gameData;

  // CHECK IF PLAYER INSTANCE EXIST
  if (player) {
    // MOVE TETRIS SHAPE OF CURRENT PLAYER'S MAP TO THE LEFT
    player.moveToLeft();

    //  GET THE UPDATED MAP AND SEND IT BACK TO THE CURRENT PLAYER
    socket.emit("map", player.getMap());
  }
}

// MOVE SHAPE TO THE RIGHT
function moveToRight(socket: any) {
  const { player } = socket.data.gameData;

  // CHECK IF PLAYER INSTANCE EXIST
  if (player) {
    // MOVE TETRIS SHAPE OF CURRENT PLAYER'S MAP TO THE RIGHT
    player.moveToRight();

    // GET THE UPDATED MAP AND SEND IT BACK TO THE CURRENT PLAYER
    socket.emit("map", player.getMap());
  }
}

// MOVE SHAPE DOWN
async function moveDown(socket: any, io: any) {
  const { playerName, roomId, multiplayer } = socket.data.userData;
  const { player } = socket.data.gameData;

  // CHECK IF PLAYER INSTANCE EXIST
  if (player) {
    // PLAYER MOVE TETRIS SHAPE DOWN IN ITS MAP
    player.moveDown();

    // CHECK THE MAP OF CURRENT PLAYER IS IT FULL
    if (checkGameOver(socket, { player, roomId })) {
      return;
    }

    // CHECK THE WINNER OF GAME
    if (await checkWinner(io, socket, roomId, multiplayer)) {
      return;
    }

    // MOVE THE TETRIS SHAPE DOWN IN PALYER MAP
    player.moveDown();

    // CHECK IF SOME ROWS OF CURRENT PLAYER'S DROPPED
    droppedRows(socket, { player, roomId });

    // GET THE  MAP AND SEND IT TO OTHER PLAYER IN THE SAME ROOM
    getMap(socket, player);

    // GET THE THE SCORE AND SEND IT TO THE CURRENT PLAYER
    getScore(socket, player);

    // GET THE DROPPED LINES AND SENT IT TO THE CURRENT PLAYER
    getDroppedLineCount(socket, player);

    // GET THE NEXT TETRIS SHAPE AND SEND IT TO THE CURRENT PLAYER
    getNextShape(socket, player);

    // GET THE SPECTRUM MAP OF CURRENT PLAYER AND SEND IT TO OTHER PLAYER IN THE SAME ROOM
    getSpectrumMap(socket, { player, playerName, roomId });
  }
}

// ADD NEW ROWS TO THE MAP
function AddLines(socket: any, rowsCount: number) {
  const { player } = socket.data.gameData;
  const { roomId, playerName }: userData = socket.data.userData;

  // CHECK IF PLAYER INSTANCE EXIST AND COUNT OF DROP LINES GREATER THAN 0
  if (rowsCount && player) {
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
  const { player } = socket.data.gameData;

  // CHECK IF PLAYER INSTANCE EXIST
  if (player) {
    // PLAYER ROTATE THE SHAPE
    player.rotate();

    // GET THE NEW UPDATED MAP AND SEND IT BACK TO THE PLAYER
    socket.emit("map", player.getMap());
  }
}

// HANDLING INSTANT DROP OF CURRENT SHPE
function instantDrop(socket: any) {
  const { playerName, roomId }: userData = socket.data.userData;

  const { player } = socket.data.gameData;

  // CHECK IF PLAYER INSTANCE EXIST
  if (player) {
    // MOVE TETRIS SHAPE OF CURRENT PLAYER'S MAP TO THE LEFT
    player.instantDrop();

    // CHECK IF SOME ROWS OF CURRENT PLAYER'S DROPPED
    droppedRows(socket, { player, roomId });

    // GET THE  MAP AND SEND IT TO OTHER PLAYER IN THE SAME ROOM
    getMap(socket, player);

    // GET THE THE SCORE AND SEND IT TO THE CURRENT PLAYER
    getScore(socket, player);

    // GET THE DROPPED LINES AND SENT IT TO THE CURRENT PLAYER
    getDroppedLineCount(socket, player);

    // GET THE NEXT TETRIS SHAPE AND SEND IT TO THE CURRENT PLAYER
    getNextShape(socket, player);

    // GET THE SPECTRUM MAP AND SEND IT TO OTHER PLAYER IN THE SAME ROOM
    getSpectrumMap(socket, { player, playerName, roomId });
  }
}

module.exports = (io: any) => {
  io.on("connection", (socket: any) => {
    try {
      // JOIN THE GAME
      socket.on(
        "join",
        async ({ roomTitle, playerName, multiplayer }: any, cb: any) => {
          joinToGame(socket, { roomTitle, playerName, multiplayer }, cb);
        }
      );

      // ORDER TO START THE GAME
      socket.on("start-order", () => {
        orderToStartTheGameByLeader(socket);
      });

      // START PLAYING
      socket.on("start-playing", () => {
        StartGame(socket, io);
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
        moveDown(socket, io);
      });

      // ROTATE THE SHAPE
      socket.on("rotate", () => {
        rotate(socket);
      });

      // INSTANT DROP OF THE CURRENT SHAPE
      socket.on("upper-key", () => {
        instantDrop(socket);
      });

      // ADD UNUSABLE ROWS TO THE MAP
      socket.on("add-unusable-rows", (rowsCount: number) => {
        AddLines(socket, rowsCount);
      });

      // IF SOCKET CLIENT DISCOONECTED
      socket.on("disconnect", () => {
        dropGameDoc(socket);
      });
    } catch (error) {
      console.log({ error });
    }
  });
};

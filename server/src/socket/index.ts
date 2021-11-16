import { clear } from "console";
import Player from "../utils/Player";
import ShapesFactory from "../utils/shapesFactory";
import { userData } from "./interfaces";
import {
  checkGameOver,
  checkWinner,
  dropGameDoc,
  droppedRows,
  findPlayer,
  getDroppedLineCount,
  getMap,
  getNextShape,
  getPlayerRole,
  getScore,
  getSpectrumMap,
} from "./utils";
const GameModel = require("../models/game");
const mongoose = require("mongoose");

// JOINING THE GAME ROOM
async function joinToGame(
  socket: any,
  { roomTitle, playerName, multiplayer, gravityInterval }: userData,
  cb: any
) {
  try {
    if (!multiplayer) {
      roomTitle = mongoose.Types.ObjectId().toString();
      playerName = "anonymous";
    }

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
        gravityInterval: gravityInterval,
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
      gravityInterval: doc.gravityInterval,
      multiplayer: multiplayer,
      gameStatus: doc.state,
    };

    // ADD CURRENT SOCKET TO A ROOM
    socket.join(roomId);

    // SHARE THE DATA WITH THE CLIENT BY A CALLBACK
    cb(false, {
      roomTitle,
      playerName,
      roomId,
      playerRole,
      gravityInterval: socket.data.userData.gravityInterval,
      multiplayer,
    });
  } catch (e) {
    console.log({ e });
  }
}

// ORDER EVENT FROM GAME LEADER TO START THE GAME
async function orderToStartTheGameByLeader(socket: any) {
  const { playerName, roomTitle, roomId }: userData = socket.data.userData;

  // LOOK FOR GAME NAME IF IT'S ALREADY CREATED IN DB
  const game = await GameModel.findOne({ _id: roomId });

  // INCOMING USER ORDER EVENT SHOULD MATCH THE FRIST ONE WHO JOINED THE GAME
  if (
    game?.players[0]["name"] === playerName &&
    game?.players[0]["role"] === "leader"
  ) {
    // EMIT GAME STARTD EVENT TO ALL PLAYERS JOINED TO THE GAME ROOM ID EXCEPT THE LEADER
    socket.to(game._id.toString()).emit("game-started");

    // EMIT GAME STARTD EVENT TO THE LEADER
    socket.emit("game-started");

    socket.data.userData.gameStatus = "started";
  }
}

// START TH GAME FOR ALL PLAYERS JOINED TO THE SAME GAME
async function StartGame(socket: any, io: any) {
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  for (;;) {
    const {
      playerName,
      roomId,
      multiplayer,
      gravityInterval,
      gameStatus,
    }: userData = socket.data.userData;

    const { player } = socket.data.gameData;
    console.log({ multiplayer });

    if (gameStatus === "pause") break;
    await delay(gravityInterval || 1000);

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
    console.log({ rowsCount });

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

// EDIT GRAVITY DURATION
function garvitySetting(socket: any, duration: number) {
  const { multiplayer } = socket.data.userData;

  // VERIFY FOR THE GAME IS NOT A MULTIPLAYER, THEN UPDATE THE GRAVITY INTERVAL
  if (!multiplayer) socket.data.userData.gravityInterval = duration;
}

// PAUSE AND RESUME THE GAME
function resumeOrPauseTheGame(socket: any, io: any, gameStatus: string) {
  const { multiplayer } = socket.data.userData;

  // VERIFY FOR THE GAME IS NOT A MULTIPLAYER, THEN PAUSE OR RESUME THE GAME
  if (!multiplayer) socket.data.userData.gameStatus = gameStatus;

  // console.log("STATUS ", socket.data.userData.gameStatus);
  if (gameStatus === "resume") StartGame(socket, io);
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

function socketListener(io: any) {
  io.on("connection", (socket: any) => {
    try {
      // JOIN THE GAME
      socket.on(
        "join",
        ({ roomTitle, playerName, multiplayer }: any, cb: any) => {
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
      socket.on("space-key", () => {
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

      // EDIT GRAVITY DURATION
      socket.on("gravitiy-setting", (duration: number) => {
        garvitySetting(socket, duration);
      });

      // PAUSE OR RESUME THE GAME
      socket.on("game-status", (gameStatus: string) => {
        resumeOrPauseTheGame(socket, io, gameStatus);
      });
    } catch (error) {
      console.log({ error });
    }
  });
}

module.exports = socketListener;

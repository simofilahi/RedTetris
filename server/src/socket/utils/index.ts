// UTILS

import { userData } from "../interfaces";
const GameModel = require("../../models/game");

// GET THE SOCKET INSTANCES COUNT JOINED INTO THE SAME ROOMID
export async function getSocketInstanceCount(
  io: any,
  roomId: number | undefined
): Promise<number> {
  const sockets = await io.in(roomId).fetchSockets();
  const subscribersCount = sockets.length;
  return subscribersCount;
}

// GET THE SPECTRUM OF CURRENT PLAYER AND SEND IT TO OTHER PLAYERS
export function getSpectrumMap(
  socket: any,
  { roomId, player, playerName }: userData
): void {
  socket.to(roomId).emit("spectrum-map", {
    spectrum: player.getlandSpectrum(),
    playerName: playerName,
  });
}

// CHECK THE GAME IF OVER FOR CURRENT SOCKET
export function checkGameOver(
  socket: any,
  { player, roomId }: userData
): boolean {
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
export function droppedRows(socket: any, { player, roomId }: userData): void {
  if (player.removedLinesCount) {
    // SEND THE COUNT OF FULL ROWS TO OTHER PLAYERS THAT JOINED IN THE SAME ROOM
    socket.to(roomId).emit("add-unusable-rows", player.removedLinesCount);
    // SET FULL ROWS COUNT TO 0;
    player.removedLinesCount = 0;
  }
}

// FIND A PLAYER IF IS ALREADY IN GAME DOC
export function findPlayer(players: any, playerName: any): boolean {
  return players.some((item: any) => {
    return item.name === playerName;
  });
}

// GET PLAYER ROLE FROM DB DOC
export function getPlayerRole(players: any, playerName: any): string {
  for (let i = 0; i < players.length; i++) {
    if (players[i].name === playerName) return players[i].role;
  }
  return "follower";
}

// CHECK THE WINNER
export async function checkWinner(
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
export async function getMap(socket: any, player: any) {
  socket.emit("map", player.getMap());
}

// GET THE SCORE OF CURRENT PLAYER
export async function getScore(socket: any, player: any) {
  socket.emit("score", player.getScore());
}

// GET DROPPED LINE COUNT OF CURRENT PLAYER
export async function getDroppedLineCount(socket: any, player: any) {
  socket.emit("dropped-lines", player.getDroppedRowsCount());
}

// GET THE NEXT TETRIS SHAPE OF CURRENT PLAYER
export async function getNextShape(socket: any, player: any) {
  socket.emit("next-shape", player.getNextShape());
}

// DROP THE GAME DOC AT THE END
export async function dropGameDoc(socket: any) {
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
export async function dropGameDocByWinner(socket: any) {
  try {
    const { roomId } = socket.data.userData;

    await GameModel.deleteOne({ roomId });
  } catch {}
}
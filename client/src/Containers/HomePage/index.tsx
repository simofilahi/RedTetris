import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
const socket = io("http://localhost:1337");
/* eslint-disable import/first */

import tetrisAudio from "../../assets/audio/tetris.mp3";

import useAudio from "../../hooks/useAudio";
import { EndGameCmp } from "./end_game";
import GameComponents from "./game_map";

interface PlayerDataInt {
  playerData: any;
  socket: any;
  setPlaying: any;
  playing: any;
}

export const PlayerDataContext: any = React.createContext({
  playerData: {},
  socket: {},
  setPlaying: {},
  playing: {},
});

const HomePage = () => {
  const [playerData, updatePlayerData]: any = useState({
    gameStatus: "resume",
    gravityPropsIndex: 0,
  });
  const [playing, setPlaying] = useAudio(tetrisAudio);

  function getKey(e: any) {
    if (e.keyCode === 39) socket.emit("right-key");
    else if (e.keyCode === 37) socket.emit("left-key");
    else if (e.keyCode === 40) {
      socket.emit("down-key");
    } else if (e.keyCode === 32) {
      socket.emit("upper-key");
    } else if (e.keyCode === 38) {
      socket.emit("rotate");
    }
  }

  useEffect(() => {
    try {
      let roomTitle: string = "";
      let playerName: string = "";
      let multiplayer: boolean = false;

      try {
        var url = window.location;

        const params = url.hash.split("#")[1].split("[");

        roomTitle = params[0].replace("/", "");
        playerName = params[1].replace("]", "");
        multiplayer = true;
        console.log({ roomTitle, playerName, multiplayer });
      } catch {
        console.log({ multiplayer });
      }

      socket.emit(
        "join",
        { roomTitle, playerName, multiplayer },
        (err: any, data: any) => {
          updatePlayerData((prevState: any) => {
            return { ...prevState, ...data };
          });
        }
      );

      socket.on("game-started", () => {
        setPlaying(true);
        socket.emit("start-playing", {
          roomTitle: playerData.roomTitle,
          playerName: playerData.playerName,
          roomId: playerData.roomId,
        });
      });

      socket.on("add-unusable-rows", (rowsCount) => {
        console.log("one");
        socket.emit("add-unusable-rows", rowsCount);
      });

      socket.on("map", (data) => {
        updatePlayerData((prevState: any) => {
          return { ...prevState, playerLand: data };
        });
      });

      socket.on("spectrum-map", (icomingSpectrumData) => {
        updatePlayerData((prevState: any) => {
          return { ...prevState, opponentSpecturmMap: icomingSpectrumData };
        });
      });

      socket.on("gameOver", () => {
        setPlaying(false);
        updatePlayerData((prevState: any) => {
          return { ...prevState, loser: true };
        });
      });

      socket.on("winner", () => {
        setPlaying(false);
        updatePlayerData((prevState: any) => {
          return { ...prevState, winner: true };
        });
      });

      socket.on("score", (score) => {
        updatePlayerData((prevState: any) => {
          return { ...prevState, score };
        });
      });

      socket.on("dropped-lines", (droppedLines) => {
        updatePlayerData((prevState: any) => {
          return { ...prevState, droppedLines };
        });
      });

      socket.on("next-shape", (playerNextShape) => {
        updatePlayerData((prevState: any) => {
          return { ...prevState, playerNextShape };
        });
      });

      document.addEventListener("keydown", getKey);
    } catch (e) {
      console.log({ e });
    }

    return () => {
      document.removeEventListener("keydown", getKey);
    };
  }, []);

  return (
    <div className="h-screen bg-black flex w-full justify-center items-center text-white flex-col">
      <PlayerDataContext.Provider
        value={{ playerData, updatePlayerData, setPlaying, playing, socket }}
      >
        <GameComponents />
        <EndGameCmp />
      </PlayerDataContext.Provider>
    </div>
  );
};

export default HomePage;

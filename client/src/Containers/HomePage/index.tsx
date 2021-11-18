import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";

/* eslint-disable import/first */
import tetrisAudio from "../../assets/audio/tetris.mp3";
import useAudio from "../../hooks/useAudio";
import { EndGameCmp } from "./end_game";
import GameComponents from "./game_map";
import {
  ContextInt,
  opponentSpecturmMapInt,
  PlayerDataInt,
  ShapeInterface,
  SquareInt,
} from "./interfaces";

const socket = io("http://10.11.3.11:1337");

export const PlayerDataContext = React.createContext<ContextInt>({
  playerData: {},
  updatePlayerData: () => {},
  setPlaying: () => {},
  playing: false,
  socket: socket,
});

const HomePage = () => {
  // PLAYER DATA
  const [playerData, updatePlayerData] = useState<PlayerDataInt>({
    gameStatus: "resume",
    gravityPropsIndex: 0,
  });

  // SOUND PLAYER SETTING
  const [playing, setPlaying] = useAudio(tetrisAudio);

  // KEYBOARD EVENT KEY HANDLER
  function getKey(e: any) {
    if (e.keyCode === 39) socket.emit("right-key");
    else if (e.keyCode === 37) socket.emit("left-key");
    else if (e.keyCode === 40) {
      socket.emit("down-key");
    } else if (e.keyCode === 32) {
      socket.emit("space-key");
    } else if (e.keyCode === 38) {
      socket.emit("rotate");
    }
  }

  useEffect(() => {
    try {
      let roomTitle: string = "";
      let playerName: string = "";
      // THE GAME IS NOT MULTIPLAYER BY DEFAULT
      let multiplayer: boolean = false;

      try {
        var url = window.location;

        console.log({ url });
        const params = url.hash.split("#")[1].split("[");

        // GET THE TITLE ROOM FROM HASH URL
        roomTitle = params[0].replace("/", "");
        // GET THE PLAYER NAME FROM HASH URL
        playerName = params[1].replace("]", "");

        // THE GAME WILL BE MUTLIPLAYER
        multiplayer = true;
      } catch {
        console.log({ multiplayer });
      }

      // JOIN TO THE GAME ROOM
      socket.emit(
        "join",
        { roomTitle, playerName, multiplayer },
        (err: boolean, data: PlayerDataInt) => {
          updatePlayerData((prevState: PlayerDataInt) => {
            return { ...prevState, ...data };
          });
        }
      );

      // THIS EVENT WILL TRIGGER IN THE CASE LEADER STARTED THE GAME
      socket.on("game-started", () => {
        setPlaying(true);
        // HERE FOR EACH PLAYER IN GAME ROOM WILL START IT'S GAME
        socket.emit("start-playing", {
          roomTitle: playerData.roomTitle,
          playerName: playerData.playerName,
          roomId: playerData.roomId,
        });
      });

      // THIS EVENT WILL TRIGGER IN CASE ANOTHER PLAYER DROP SOME ROWS IN HIS MAP
      socket.on("add-unusable-rows", (rowsCount: number) => {
        console.log("one");
        socket.emit("add-unusable-rows", rowsCount);
      });

      // THIS EVENT WILL TRIGGER TO GET THE PLAYER MAP
      socket.on("map", (data: Array<Array<SquareInt>>) => {
        updatePlayerData((prevState: PlayerDataInt) => {
          return { ...prevState, playerLand: data };
        });
      });

      // THIS EVENT WILL TRIGGER TO GET THE SPECTRUM MAP OF THE OPPONENT
      socket.on(
        "spectrum-map",
        (icomingSpectrumData: opponentSpecturmMapInt) => {
          updatePlayerData((prevState: PlayerDataInt) => {
            return { ...prevState, opponentSpecturmMap: icomingSpectrumData };
          });
        }
      );

      // THIS EVENT WILL TRIGGER IF THE PLAYER LOSES
      socket.on("gameOver", () => {
        setPlaying(false);
        updatePlayerData((prevState: PlayerDataInt) => {
          return { ...prevState, loser: true };
        });
      });

      // THIS EVENT WILL TRIGGER IF THE PLAYER WIN
      socket.on("winner", () => {
        setPlaying(false);
        updatePlayerData((prevState: PlayerDataInt) => {
          return { ...prevState, winner: true };
        });
      });

      // THIS EVENT WILL TRIGGER TO GET THE SCORE GAME OF THE PLAYER
      socket.on("score", (score) => {
        updatePlayerData((prevState: PlayerDataInt) => {
          return { ...prevState, score };
        });
      });

      // THIS EVENT WILL TRIGGER TO GET THE DROOPED ROWS COUNT
      socket.on("dropped-lines", (droppedLines: number) => {
        updatePlayerData((prevState: PlayerDataInt) => {
          return { ...prevState, droppedLines };
        });
      });

      // THIS EVENT WILL TRIGGER TO GET THE NEXT SHAPE
      socket.on("next-shape", (playerNextShape: ShapeInterface) => {
        updatePlayerData((prevState: PlayerDataInt) => {
          return { ...prevState, playerNextShape };
        });
      });

      // EVENT LISTENER FOR KEYBOARD KEY
      document.addEventListener("keydown", getKey);
    } catch (e) {
      console.log({ e });
    }

    return () => {
      // REMOVE EVENT LISTENER IN UNMOUNT OF COMPONENT
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

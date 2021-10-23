import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import { isTemplateExpression } from "typescript";
const socket = io("http://10.11.1.3:1337");

const HomePage = () => {
  const [mapData, updateMap] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [userData, updateUserData] = useState(null);

  function getKey(e) {
    console.log({ e });
    if (e.key === "ArrowRight") socket.emit("right-key");
    else if (e.key === "ArrowLeft") socket.emit("left-key");
    else if (e.key === "ArrowDown") {
      console.log("test");
      socket.emit("down-key");
    } else if (e.keyCode === 32) {
      socket.emit("rotate");
    }
  }

  useEffect(() => {
    try {
      var url = window.location;

      const params = url.pathname.split("[");

      const roomTitle = params[0].replace("/", "");
      const playerName = params[1].replace("]", "");

      console.log({ roomTitle, playerName });
      socket.emit("join", { roomTitle, playerName }, (err, data) => {
        const userData = {
          roomTitle: data.roomTitle,
          playerName: data.playerName,
        };
        console.log("CAllBack");
        updateUserData(userData);
      });

      socket.on("game-started", () => {
        console.log("on game-start");
        socket.emit("start-playing");
      });
      // console.log({ roomTitle, playerName });

      socket.on("map", (data) => {
        // console.log({ data });
        updateMap(data);
      });

      socket.on("gameOver", (data) => {
        console.log(data);
        setGameOver(true);
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
      <div>{gameOver ? "Game Over" : ""}</div>
      {mapData.length > 0 ? (
        <div className=" grid grid-cols-10 border-white border-2">
          {mapData.map((row) => {
            return row.map((col) => {
              // console.log({ col });
              return (
                <div
                  className="h-14 w-14"
                  style={{ backgroundColor: col.color }}
                ></div>
              );
            });
          })}
        </div>
      ) : (
        <div
          className="bg-white h-12 w-52 text-black flex justify-center items-center font-bold text-lg"
          onClick={() => {
            socket.emit("start", {
              roomTitle: userData.roomTitle,
              playerName: userData.playerName,
            });
          }}
        >
          Start Game
        </div>
      )}
    </div>
  );
};

export default HomePage;

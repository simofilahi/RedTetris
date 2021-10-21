import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import { isTemplateExpression } from "typescript";
const socket = io("http://10.11.1.3:1337");

const HomePage = () => {
  const [mapData, updateMap] = useState([]);
  const [gameOver, setGameOver] = useState(false);

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
    socket.on("map", (data) => {
      console.log({ data });
      updateMap(data);
    });

    socket.on("gameOver", (data) => {
      console.log(data);
      setGameOver(true);
    });

    console.log("test");
    document.addEventListener("keydown", getKey);
    return () => {
      document.removeEventListener("keydown", getKey);
    };
  }, []);

  return (
    <div className="h-screen bg-black flex w-full justify-center items-center text-white flex-col">
      <div>{gameOver ? "Game Over" : ""}</div>
      <div className=" grid grid-cols-10 border-white border-2">
        {mapData.length > 0 &&
          mapData.map((row) => {
            return row.map((col) => {
              console.log({ col });
              return (
                <div
                  className="h-14 w-14"
                  style={{ backgroundColor: col.color }}
                ></div>
              );
            });
          })}
      </div>
    </div>
  );
};

export default HomePage;

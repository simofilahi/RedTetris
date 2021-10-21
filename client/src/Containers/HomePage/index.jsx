import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
const socket = io("http://localhost:1337");

const HomePage = () => {
  const [mapData, updateMap] = useState([]);

  function getKey(e) {
    if (e.key === "ArrowRight") socket.emit("right-key");
    else if (e.key === "ArrowLeft") socket.emit("left-key");
    else if (e.key === "ArrowDown") socket.emit("down-key");
  }

  useEffect(() => {
    socket.on("map", (data) => {
      console.log({ data });
      updateMap(data);
    });
    console.log("test");
    document.addEventListener("keydown", getKey);
  }, []);

  return (
    <div className="h-screen bg-black flex w-full justify-center items-center text-white">
      <div className="py-10 bg-red-500 w-1/2 h-1/2 grid grid-cols-10 border-white border-2">
        {mapData.length > 0 &&
          mapData.map((row) => {
            return row.map((col) => {
              return <div className="border-2 border-white">1</div>;
            });
          })}
      </div>
    </div>
  );
};

export default HomePage;

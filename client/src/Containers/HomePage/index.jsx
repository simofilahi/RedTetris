import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
const socket = io("http://localhost:1337");

const HomePage = () => {
  const [map, updateMap] = useState([]);
  useEffect(() => {
    socket.on("map", (data) => {
      console.log({ data });
      updateMap(map);
    });
  }, []);

  return (
    <div className="h-screen bg-black flex justify-center text-white">
      Tetris
    </div>
  );
};

export default HomePage;

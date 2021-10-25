import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
const socket = io("http://10.11.1.3:1337");

const HomePage = () => {
  console.log("Again");
  const [mapData, updateMap] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [userData, updateUserData] = useState({});
  const [spectrumData, updateSpectrumData] = useState(null);

  function getKey(e) {
    if (e.key === "ArrowRight") socket.emit("right-key");
    else if (e.key === "ArrowLeft") socket.emit("left-key");
    else if (e.key === "ArrowDown") {
      console.log("ArrowDown");
      console.log({ userData });
      socket.emit("down-key", {
        roomTitle: userData.roomTitle,
        playerName: userData.playerName,
        roomId: userData.roomId,
      });
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

      // console.log({ roomTitle, playerName });
      socket.emit("join", { roomTitle, playerName }, (err, data) => {
        // console.log({ data });
        updateUserData({ ...data });
      });

      socket.on("game-started", () => {
        console.log("on game-start");
        console.log({ userData });
        socket.emit("start-playing", {
          roomTitle: userData.roomTitle,
          playerName: userData.playerName,
          roomId: userData.roomId,
        });
      });

      // socket.on("spectrum-map", (icomingSpectrumData) => {
      //   updateSpectrumData({ ...icomingSpectrumData });
      // });

      socket.on("map", (data) => {
        // console.log({ data });
        updateMap(data);
      });

      socket.on("gameOver", (data) => {
        // console.log(data);
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

  const StartGameBtn = () => {
    return (
      <div
        className="bg-white h-12 w-52 text-black flex justify-center items-center font-bold text-lg"
        onClick={(e) => {
          e.preventDefault();
          console.log("on Start front-end", userData);
          const copy = JSON.parse(JSON.stringify(userData));
          socket.emit("start", {
            roomTitle: copy.roomTitle,
            playerName: copy.playerName,
          });
        }}
      >
        Start Game
      </div>
    );
  };

  const GameMap = () => {
    return (
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
    );
  };

  const SpectrumMapCmp = (SpectrumMap) => {
    // console.log(SpectrumMap);
    // debugger;
    return (
      <div className="grid grid-cols-10 border-white border-2">
        {SpectrumMap &&
          SpectrumMap.map((row) => {
            // console.log({ row });
            // debugger;
            return row.map((col) => {
              console.log({ col });
              // debugger;
              if (col.value === "*") {
                return (
                  <div
                    className="h-8 w-8 bg-blue-400"
                    // style={{ backgroundColor: col.color }}
                  ></div>
                );
              } else {
                return (
                  <div
                    className="h-4 w-4"
                    // style={{ backgroundColor: col.color }}
                  ></div>
                );
              }
            });
          })}
      </div>
    );
  };

  const OpponentSpecturmMap = () => {
    return (
      <div className="p-10 border-white border-2  w-96  overflow-y-scroll">
        {spectrumData &&
          Object.keys(spectrumData).map((key) => {
            return (
              <div className="flex flex-col">
                <div>{spectrumData["playerName"]}</div>
                {SpectrumMapCmp(spectrumData["spectrum"])}
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <div className="h-screen bg-black flex w-full justify-center items-center text-white flex-col">
      <div>{gameOver ? "Game Over" : ""}</div>
      {mapData.length > 0 ? (
        <div className="flex justify-between">
          {GameMap()}
          {/* {OpponentSpecturmMap()} */}
        </div>
      ) : (
        StartGameBtn()
      )}
    </div>
  );
};

export default HomePage;

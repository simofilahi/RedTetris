import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
const socket = io("http://10.11.12.4:1337");

const HomePage = () => {
  const [mapData, updateMap] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(false);
  const [userData, updateUserData] = useState({});
  const [spectrumData, updateSpectrumData] = useState({});

  function getKey(e) {
    if (e.key === "ArrowRight") socket.emit("right-key");
    else if (e.key === "ArrowLeft") socket.emit("left-key");
    else if (e.key === "ArrowDown") {
      socket.emit("down-key");
    } else if (e.keyCode === 32) {
      socket.emit("rotate");
    }
  }

  socket.on("game-started", () => {
    socket.emit("start-playing", {
      roomTitle: userData.roomTitle,
      playerName: userData.playerName,
      roomId: userData.roomId,
    });
  });

  socket.on("spectrum-map", (icomingSpectrumData) => {
    updateSpectrumData(icomingSpectrumData);
  });

  socket.on("map", (data) => {
    updateMap(data);
  });

  socket.on("gameOver", (data) => {
    setGameOver(true);
  });

  socket.on("winner", () => {
    setWinner(true);
  });

  useEffect(() => {
    try {
      var url = window.location;

      const params = url.pathname.split("[");

      const roomTitle = params[0].replace("/", "");
      const playerName = params[1].replace("]", "");

      socket.emit("join", { roomTitle, playerName }, (err, data) => {
        updateUserData({ ...data });
      });

      socket.on("add-unusable-rows", (rowsCount) => {
        socket.emit("add-unusable-rows", rowsCount);
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
          socket.emit("start-order");
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
          return row.map((col, index) => {
            // console.log({ col });
            if (col.value === "#") {
              return (
                <div key={index} className="h-14 w-14 ">
                  <img
                    src="https://img.icons8.com/ios-filled/50/000000/brick-wall.png"
                    style={{
                      height: "100%",
                      width: "100%",
                      backgroundColor: "#FFFFFF",
                    }}
                  />
                </div>
              );
            }
            return (
              <div
                key={index}
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
    return (
      <div className="grid grid-cols-10 border-white border-2">
        {SpectrumMap &&
          SpectrumMap.map((row) => {
            return row.map((col, index) => {
              if (col.value === "*") {
                return <div key={index} className="h-8 w-8 bg-blue-400"></div>;
              } else {
                return <div key={index} className="h-4 w-4"></div>;
              }
            });
          })}
      </div>
    );
  };

  const OpponentSpecturmMap = () => {
    return (
      <div className="p-10 border-white border-2  w-96  overflow-y-scroll">
        <div className="flex flex-col">
          <div>{spectrumData["playerName"]}</div>
          {SpectrumMapCmp(spectrumData["spectrum"])}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-black flex w-full justify-center items-center text-white flex-col">
      <div className="p-2">{gameOver ? "Game Over" : ""}</div>
      <div className="p-2">{winner ? "Winner" : ""}</div>
      {userData && !mapData.length && (
        <div className="p-2">Role: you are {userData.playerRole}</div>
      )}
      {mapData.length > 0 ? (
        <div className="flex justify-between">
          {GameMap()}
          {OpponentSpecturmMap()}
        </div>
      ) : (
        StartGameBtn()
      )}
    </div>
  );
};

export default HomePage;

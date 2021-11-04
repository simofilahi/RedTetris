import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
const socket = io("http://10.11.12.4:1337");

const HomePage = () => {
  const [playerData, updatePlayerData] = useState({});

  function getKey(e) {
    console.log(e.keyCode);
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
      var url = window.location;

      const params = url.pathname.split("[");

      const roomTitle = params[0].replace("/", "");
      const playerName = params[1].replace("]", "");

      socket.emit("join", { roomTitle, playerName }, (err, data) => {
        updatePlayerData((prevState) => {
          return { ...prevState, ...data };
        });
      });

      socket.on("game-started", () => {
        socket.emit("start-playing", {
          roomTitle: playerData.roomTitle,
          playerName: playerData.playerName,
          roomId: playerData.roomId,
        });
      });

      socket.on("add-unusable-rows", (rowsCount) => {
        socket.emit("add-unusable-rows", rowsCount);
      });

      socket.on("map", (data) => {
        updatePlayerData((prevState) => {
          return { ...prevState, playerLand: data };
        });
      });

      socket.on("spectrum-map", (icomingSpectrumData) => {
        updatePlayerData((prevState) => {
          return { ...prevState, opponentSpecturmMap: icomingSpectrumData };
        });
      });

      socket.on("gameOver", () => {
        updatePlayerData((prevState) => {
          return { ...prevState, loser: true };
        });
      });

      socket.on("winner", () => {
        updatePlayerData((prevState) => {
          return { ...prevState, winner: true };
        });
      });

      socket.on("score", (score) => {
        updatePlayerData((prevState) => {
          return { ...prevState, score };
        });
      });

      socket.on("dropped-lines", (droppedLines) => {
        updatePlayerData((prevState) => {
          return { ...prevState, droppedLines };
        });
      });

      socket.on("next-shape", (playerNextShape) => {
        updatePlayerData((prevState) => {
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
    // console.log(playerData.playerLand);
    return (
      <div className=" grid grid-cols-10 border-white border-2">
        {playerData?.playerLand?.map((row) => {
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
    if (playerData.opponentSpecturmMap) {
      return (
        <div className="p-10 border-white border-2  w-96  overflow-y-scroll">
          <div className="flex flex-col">
            <div>{playerData.opponentSpecturmMap["playerName"]}</div>
            {SpectrumMapCmp(playerData.opponentSpecturmMap["spectrum"])}
          </div>
        </div>
      );
    }
    return <></>;
  };

  const PlayerNextShape = () => {
    return (
      <div className="h-96  w-4/5 flex flex-col py-5">
        <div className="py-1 border-white border-2 flex ">
          <div className="flex-1 text-center">Next Shape</div>
        </div>
        <div className="flex-1 w-full border-white border-2 justify-center items-center flex">
          <div
            className={`grid grid-cols-${playerData?.playerNextShape?.pieces[0].length} p-10 `}
          >
            {playerData?.playerNextShape?.pieces?.map((row) => {
              return row.map((col, index) => {
                return (
                  <div
                    key={index}
                    className="h-8 w-8"
                    style={{ backgroundColor: col.color }}
                  ></div>
                );
              });
            })}
          </div>
        </div>
      </div>
    );
  };

  const PlayerScore = () => {
    return (
      <div className="h-48 w-4/5 flex flex-col py-5">
        <div className="py-1 border-white border-2 flex ">
          <div className="flex-1 text-center">Score</div>
        </div>
        <div className="flex-1 w-full border-white border-2 flex justify-center items-center">
          <div className="text-lg text-bold">{playerData?.score}</div>
        </div>
      </div>
    );
  };

  const PlayerDropedLines = () => {
    return (
      <div className="h-48 w-4/5  flex flex-col py-5">
        <div className="py-1 border-white border-2 flex ">
          <div className="flex-1 text-center">Lines</div>
        </div>
        <div className="flex-1 w-full border-white border-2 flex justify-center items-center">
          <div className="text-lg">{playerData?.droppedLines}</div>
        </div>
      </div>
    );
  };

  const HelperBoard = () => {
    return (
      <div className="p-10 border-white border-2  w-96  overflow-y-scroll">
        <div className="flex flex-col justify-center items-center">
          <PlayerNextShape />
          <PlayerScore />
          <PlayerDropedLines />
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-black flex w-full justify-center items-center text-white flex-col">
      <div className="p-2">{playerData.loser ? "Game Over" : ""}</div>
      <div className="p-2">{playerData.winner ? "Winner" : ""}</div>
      {playerData && (
        <div className="p-2">
          Role: you are {playerData.playerRole ? playerData.playerRole : ""}
        </div>
      )}
      {playerData?.playerLand?.length > 0 ? (
        <div className="flex justify-between">
          {HelperBoard()}
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

import { io } from "socket.io-client";
import React, { useState, useEffect, useRef } from "react";
const socket = io("http://localhost:1337");
/* eslint-disable import/first */
import winnerImg from "../../assets/img/winner.png";
import loserImg from "../../assets/img/loser.png";
import tetrisAudio from "../../assets/audio/tetris.mp3";
import volumeImg from "../../assets/img/volume.png";
import muteImg from "../../assets/img/mute.png";
import useAudio from "../../hooks/useAudio";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCoffee,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  const [playerData, updatePlayerData]: any = useState({
    gameStatus: "resume",
    gravityPropsIndex: 0,
  });
  const [playing, setPlaying] = useAudio(tetrisAudio);

  function getKey(e: any) {
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
      let roomTitle: string = "";
      let playerName: string = "";
      let multiplayer: boolean = false;

      try {
        var url = window.location;

        console.log({ url });
        console.log(url.hash);
        const params = url.hash.split("#")[1].split("[");

        console.log({ params });

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
    if (!playerData?.playerLand) {
      return (
        <div
          className="flex justify-center items-center border-white border-2"
          style={{ width: "50%" }}
        >
          <StartCmp />
        </div>
      );
    } else {
      return (
        <div
          className=" grid grid-cols-10 border-white border-2 "
          style={{ width: "50%" }}
        >
          {playerData?.playerLand?.map((row: any) => {
            return row.map((col: any, index: number) => {
              if (col.value === "#") {
                return (
                  <div key={index}>
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
                <div key={index} style={{ backgroundColor: col.color }}></div>
              );
            });
          })}
        </div>
      );
    }
  };

  const SpectrumMapCmp = (SpectrumMap: any) => {
    return (
      <div className="grid grid-cols-10 border-white border-2">
        {SpectrumMap &&
          SpectrumMap.map((row: any) => {
            return row.map((col: any, index: number) => {
              if (col.value === "*") {
                return <div key={index} className=""></div>;
              } else {
                return <div key={index} className=""></div>;
              }
            });
          })}
      </div>
    );
  };

  const OpponentSpecturmMap = () => {
    return (
      <div
        className=" border-white border-2 flex items-center flex-col "
        style={{ width: "20%" }}
      >
        <div className="flex flex-col">
          <div>
            {playerData.opponentSpecturmMap &&
              playerData.opponentSpecturmMap["playerName"]}
          </div>
          {playerData.opponentSpecturmMap &&
            SpectrumMapCmp(playerData.opponentSpecturmMap["spectrum"])}
        </div>
        <SoundControl />
        <GravityCmp />
        <PauseAndStartCmp />
      </div>
    );
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
            {playerData?.playerNextShape?.pieces?.map((row: any) => {
              return row.map((col: any, index: any) => {
                return (
                  <div
                    key={index}
                    className="p-5"
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
      <div className="h-32 w-4/5 flex flex-col py-5">
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
      <div className="h-32 w-4/5  flex flex-col py-5">
        <div className="py-1 border-white border-2 flex ">
          <div className="flex-1 text-center">Lines</div>
        </div>
        <div className="flex-1 w-full border-white border-2 flex justify-center items-center">
          <div className="text-lg">{playerData?.droppedLines}</div>
        </div>
      </div>
    );
  };

  const gravityProps = [
    { title: "NORMAL", duration: 800 },
    { title: "MEDIUM", duration: 500 },
    { title: "HARD", duration: 100 },
  ];

  const GravityCmp = () => {
    return (
      <div className="h-24 w-4/5  flex flex-col py-5">
        <div className="flex-1 w-full border-white border-2 flex justify-center  items-center bg-white">
          <div
            className="text-black border-2 border-black cursor-pointer px-2"
            onClick={(e) => {
              e.preventDefault();
              console.log("left updated");
              updatePlayerData((prevState: any) => {
                if (prevState?.gravityPropsIndex === 0) return prevState;
                return {
                  ...prevState,
                  gravityPropsIndex: prevState.gravityPropsIndex - 1,
                };
              });

              socket.emit(
                "gravitiy-setting",
                !(playerData?.gravityPropsIndex - 1 < 0)
                  ? gravityProps[playerData.gravityPropsIndex - 1].duration
                  : gravityProps[0].duration
              );
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </div>
          <div className="text-black px-2 border-t-2 border-b-2 border-black">
            {gravityProps[playerData?.gravityPropsIndex].title ||
              gravityProps[0].title}
          </div>
          <div
            className="text-black border-black border-2 cursor-pointer px-2"
            onClick={(e) => {
              e.preventDefault();
              console.log("right updated");
              updatePlayerData((prevState: any) => {
                if (prevState?.gravityPropsIndex === 2) return prevState;

                return {
                  ...prevState,
                  gravityPropsIndex: prevState.gravityPropsIndex + 1,
                };
              });
              socket.emit(
                "gravitiy-setting",
                !(playerData?.gravityPropsIndex + 1 > 2)
                  ? gravityProps[playerData.gravityPropsIndex + 1].duration
                  : gravityProps[0].duration
              );
            }}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
        </div>
      </div>
    );
  };

  const PauseAndStartCmp = () => {
    return (
      <div className="h-24 w-4/5  flex flex-col py-5 ">
        <div className="flex-1 w-full border-white border-2 flex justify-between items-center bg-white">
          <div className="text-black flex pl-5">
            {playerData?.gameStatus === "resume" ? "* PAUSE *" : "* RESUME *"}
          </div>
          <div className="text-black flex pr-5 cursor-pointer">
            <FontAwesomeIcon
              icon={playerData.gameStatus === "resume" ? faPause : faPlay}
              color="black"
              onClick={(e) => {
                e.preventDefault();
                const gameStatus =
                  playerData?.gameStatus === "resume" ? "pause" : "resume";
                console.log("game status ", gameStatus);
                socket.emit("game-status", gameStatus);
                socket.emit("test");
                updatePlayerData((prevState: any) => {
                  if (prevState.gameStatus === "pause")
                    return { ...prevState, gameStatus: "resume" };
                  else return { ...prevState, gameStatus: "pause" };
                });
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  /*
  pause -> pause
  resume -> resume
  */

  const SoundControl = () => {
    return (
      <div className="h-24 w-4/5 flex flex-col py-5">
        <div className="flex-1 w-full border-white border-2 flex justify-center items-center bg-white">
          <img
            src={playing === true ? volumeImg : muteImg}
            className="h-8 w-8 bg-white cursor-pointer"
            onClick={() => {
              setPlaying(!playing);
            }}
          />
        </div>
      </div>
    );
  };

  const HelperBoard = () => {
    return (
      <div className="border-white border-2" style={{ width: "20%" }}>
        <div className="flex flex-col justify-center items-center">
          <PlayerNextShape />
          <PlayerScore />
          <PlayerDropedLines />
        </div>
      </div>
    );
  };

  const EndGameCard = () => {
    return (
      <div className="h-full w-full bg-black opacity-90 absolute top-0 z-index flex flex-col ">
        <div
          className="py-10 px-20 self-end font-medium text-2xl cursor-pointer "
          onClick={() => {
            window.location.reload();
          }}
        >
          x
        </div>
        <div className="flex-auto  m-20 flex justify-center items-center">
          <img
            src={playerData?.winner ? winnerImg : loserImg}
            className="h-98 w-96 self-center"
          />
        </div>
      </div>
    );
  };

  const GameComponents = () => {
    return (
      <div
        className="flex justify-center "
        style={{ height: "95%", width: "90%" }}
      >
        {HelperBoard()}
        {GameMap()}
        {OpponentSpecturmMap()}
      </div>
    );
  };

  const StartCmp = () => {
    if (!playerData?.playerLand?.length && playerData.playerRole === "leader") {
      return (
        <div className="">
          <div className="p-2">
            Role: you are the{" "}
            {playerData.playerRole ? playerData.playerRole : ""}
          </div>
          {StartGameBtn()}
        </div>
      );
    } else if (!playerData?.playerLand?.length) {
      return (
        <div>
          <div className="p-2">
            Role: you are a {playerData.playerRole ? playerData.playerRole : ""}
          </div>
          <p>Waiting for the game to start ...</p>
        </div>
      );
    }
    return <></>;
  };

  const EndGameCmp = () => {
    if (playerData?.winner || playerData?.loser) return <EndGameCard />;
    return <></>;
  };

  return (
    <div className="h-screen bg-black flex w-full justify-center items-center text-white flex-col">
      <GameComponents />
      <EndGameCmp />
    </div>
  );
};

export default HomePage;

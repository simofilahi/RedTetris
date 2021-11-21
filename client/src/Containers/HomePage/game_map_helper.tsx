import {
  faArrowLeft,
  faArrowRight,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlayerDataContext } from ".";
import React, { useContext } from "react";
import volumeImg from "assets/img/volume.png";
import muteImg from "assets/img/mute.png";
import {
  ContextInt,
  SquareInt,
  PlayerDataInt,
  opponentSpecturmMapInt,
} from "./interfaces";

// RIGHT HELPER BOARD COMPONENTS

// SPECTRUM MAP OF THE OPPONENT
const SpectrumMapCmp = (SpectrumMap: Array<Array<SquareInt>>) => {
  return (
    <div className="grid grid-cols-10">
      {SpectrumMap &&
        SpectrumMap.map((row: Array<SquareInt>) => {
          return row.map((col: SquareInt, index: number) => {
            if (col.value === "*") {
              return <div key={index} className="p-2 bg-blue-200"></div>;
            } else {
              return <div key={index} className="p-2"></div>;
            }
          });
        })}
    </div>
  );
};

// SPECTRUM MAP OF THE OPPONENT
const OpponentSpecturmMap = () => {
  const { playerData }: ContextInt = useContext(PlayerDataContext);

  if (!playerData?.opponentSpecturmMap) return null;

  return (
    <div
      className="h-1  w-4/5 flex flex-col py-5 overflow-y-scroll"
      style={{ height: "400px" }}
    >
      {playerData.opponentSpecturmMap.map(
        (spectrum: opponentSpecturmMapInt) => {
          return (
            <div className="h-96  w-4/5 flex flex-col py-5">
              <div className="py-1 border-white border-2 flex ">
                <div className="flex-1 text-center">
                  Opponent : {spectrum["playerName"]}
                </div>
              </div>
              <div className="flex-1 w-full border-white border-2 justify-center items-center flex">
                {SpectrumMapCmp(spectrum["spectrum"])}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

// GRAVITY OF FALLING SHAPES
const GravityCmp = () => {
  const { playerData, socket, updatePlayerData }: ContextInt =
    useContext(PlayerDataContext);

  // PREDEFIND GRAVITY SPEED
  const gravityProps = [
    { title: "NORMAL", duration: 800 },
    { title: "MEDIUM", duration: 500 },
    { title: "HARD", duration: 100 },
  ];

  // CHANGE THE GRAVITY SETTINGS
  const editGravity = (e: any, arrowIcon: string) => {
    e.preventDefault();
    if (arrowIcon === "left") {
      updatePlayerData((prevState: PlayerDataInt) => {
        if (prevState?.gravityPropsIndex === 0) return prevState;
        return {
          ...prevState,
          gravityPropsIndex: prevState.gravityPropsIndex! - 1,
        };
      });

      socket.emit(
        "gravitiy-setting",
        !(playerData?.gravityPropsIndex! - 1 < 0)
          ? gravityProps[playerData.gravityPropsIndex! - 1].duration
          : gravityProps[0].duration
      );
    } else if (arrowIcon === "right") {
      updatePlayerData((prevState: PlayerDataInt) => {
        if (prevState?.gravityPropsIndex === 2) return prevState;

        return {
          ...prevState,
          gravityPropsIndex: prevState.gravityPropsIndex! + 1,
        };
      });
      socket.emit(
        "gravitiy-setting",
        !(playerData?.gravityPropsIndex! + 1 > 2)
          ? gravityProps[playerData.gravityPropsIndex! + 1].duration
          : gravityProps[0].duration
      );
    }
  };

  return (
    <div className="h-32 w-4/5  flex flex-col py-5">
      <div className="bg-white text-black flex justify-center items-center border-b-2 border-black">
        Gravity
      </div>
      <div className="flex-1 w-full border-white border-2 flex justify-center  items-center bg-white">
        <div
          className="text-black border-2 border-black cursor-pointer px-2"
          onClick={(e) => editGravity(e, "left")}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>
        <div className="text-black px-2 border-t-2 border-b-2 border-black">
          {gravityProps[playerData?.gravityPropsIndex!].title ||
            gravityProps[0].title}
        </div>
        <div
          className="text-black border-black border-2 cursor-pointer px-2"
          onClick={(e) => editGravity(e, "right")}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </div>
      </div>
    </div>
  );
};

// PAUSE AND START THE GAME
const PauseAndStartCmp = () => {
  const { playerData, setPlaying, socket, updatePlayerData }: ContextInt =
    useContext(PlayerDataContext);
  const editGameControl = (e: any) => {
    e.preventDefault();
    const gameStatus = playerData?.gameStatus === "resume" ? "pause" : "resume";
    socket.emit("game-status", gameStatus);
    if (gameStatus === "pause") setPlaying(false);
    else setPlaying(true);
    updatePlayerData((prevState: PlayerDataInt) => {
      if (prevState.gameStatus === "pause")
        return { ...prevState, gameStatus: "resume" };
      else return { ...prevState, gameStatus: "pause" };
    });
  };

  return (
    <div className="h-32 w-4/5  flex flex-col py-5 ">
      <div className="bg-white text-black flex justify-center items-center border-b-2 border-black">
        Control
      </div>
      <div className="flex-1 w-full border-white border-2 flex justify-between items-center bg-white">
        <div className="text-black flex pl-5">
          {playerData?.gameStatus === "resume" ? "* PAUSE *" : "* RESUME *"}
        </div>
        <div className="text-black flex pr-5 cursor-pointer">
          <FontAwesomeIcon
            icon={playerData.gameStatus === "resume" ? faPause : faPlay}
            color="black"
            onClick={editGameControl}
          />
        </div>
      </div>
    </div>
  );
};

// SOUND SETTINGS
const SoundControl = () => {
  const { playing, setPlaying }: ContextInt = useContext(PlayerDataContext);
  return (
    <div className="h-32 w-4/5 flex flex-col py-5">
      <div className="bg-white text-black flex justify-center items-center border-b-2 border-black">
        Sound
      </div>
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

// JOINED PLAYERS COUNT
const JoinedPlayers = () => {
  const { playerData }: ContextInt = useContext(PlayerDataContext);
  return (
    <div className="h-32 w-4/5 flex flex-col py-5">
      <div className="bg-white text-black flex justify-center items-center border-b-2 border-black">
        Joined Players
      </div>
      <div className="flex-1 w-full border-white border-2 flex justify-center items-center bg-white text-black">
        {playerData?.joinedPlayersCount}
      </div>
    </div>
  );
};

// RIGHT BOARD COMPONENT
export const RightHelperBoard = () => {
  const { playerData }: ContextInt = useContext(PlayerDataContext);
  return (
    <div
      className=" border-white border-2 flex items-center flex-col "
      style={{ width: "20%" }}
    >
      {playerData?.multiplayer ? (
        <OpponentSpecturmMap />
      ) : (
        <>
          <GravityCmp />
          <PauseAndStartCmp />
        </>
      )}
      <SoundControl />
      <JoinedPlayers />
    </div>
  );
};
//

// LEFT HELPER BORAD COMPONENTS
const PlayerNextShape = () => {
  const { playerData }: ContextInt = useContext(PlayerDataContext);

  console.log({ playerNextShape: playerData?.playerNextShape });
  if (playerData?.playerNextShape) {
    let colNum = playerData.playerNextShape.pieces[0].length;
    return (
      <div className="h-96  w-4/5 flex flex-col py-5">
        <div className="py-1 border-white border-2 flex ">
          <div className="flex-1 text-center">Next Shape</div>
        </div>
        <div className="flex-1 w-full border-white border-2 justify-center items-center flex">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${colNum}, 0fr)`,
            }}
          >
            {playerData.playerNextShape.pieces?.map((row: Array<SquareInt>) => {
              return row.map((col: SquareInt, index: number) => {
                if (col.color === "") {
                  return (
                    <div
                      key={index}
                      className="p-5"
                      style={{ backgroundColor: "" }}
                    ></div>
                  );
                }
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
  }
  return <></>;
};

const PlayerScore = () => {
  const { playerData }: ContextInt = useContext(PlayerDataContext);
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
  const { playerData }: ContextInt = useContext(PlayerDataContext);
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

export const LeftHelperBoard = () => {
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

//

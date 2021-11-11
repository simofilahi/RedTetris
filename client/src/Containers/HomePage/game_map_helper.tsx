import {
  faArrowLeft,
  faArrowRight,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PlayerDataContext } from ".";
import { useContext } from "react";
import volumeImg from "../../assets/img/volume.png";
import muteImg from "../../assets/img/mute.png";

// RIGHT HELPER BOARD COMPONENTS
const SpectrumMapCmp = (SpectrumMap: any) => {
  return (
    <div className="grid grid-cols-10">
      {SpectrumMap &&
        SpectrumMap.map((row: any) => {
          return row.map((col: any, index: number) => {
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

const OpponentSpecturmMap = () => {
  const { playerData } = useContext(PlayerDataContext);
  return (
    <div className="h-96  w-4/5 flex flex-col py-5">
      <div className="py-1 border-white border-2 flex ">
        <div className="flex-1 text-center">
          Opponent :{" "}
          {playerData.opponentSpecturmMap &&
            playerData.opponentSpecturmMap["playerName"]}
        </div>
      </div>
      <div className="flex-1 w-full border-white border-2 justify-center items-center flex">
        {playerData.opponentSpecturmMap &&
          SpectrumMapCmp(playerData.opponentSpecturmMap["spectrum"])}
      </div>
    </div>
  );
};

const GravityCmp = () => {
  const { playerData, socket, updatePlayerData } =
    useContext(PlayerDataContext);

  const gravityProps = [
    { title: "NORMAL", duration: 800 },
    { title: "MEDIUM", duration: 500 },
    { title: "HARD", duration: 100 },
  ];

  const editGravity = (e: any, arrowIcon: string) => {
    e.preventDefault();
    if (arrowIcon === "left") {
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
    } else if (arrowIcon === "right") {
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
          {gravityProps[playerData?.gravityPropsIndex].title ||
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

const PauseAndStartCmp = () => {
  const { playerData, setPlaying, socket, updatePlayerData } =
    useContext(PlayerDataContext);
  const editGameControl = (e: any) => {
    e.preventDefault();
    const gameStatus = playerData?.gameStatus === "resume" ? "pause" : "resume";
    socket.emit("game-status", gameStatus);
    if (gameStatus === "pause") setPlaying(false);
    else setPlaying(true);
    updatePlayerData((prevState: any) => {
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

const SoundControl = () => {
  const { playing, setPlaying } = useContext(PlayerDataContext);
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

export const RightHelperBoard = () => {
  const { playerData } = useContext(PlayerDataContext);
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
    </div>
  );
};
//

// LEFT HELPER BORAD COMPONENTS
const PlayerNextShape = () => {
  const { playerData, socket } = useContext(PlayerDataContext);
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
  const { playerData } = useContext(PlayerDataContext);
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
  const { playerData } = useContext(PlayerDataContext);
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
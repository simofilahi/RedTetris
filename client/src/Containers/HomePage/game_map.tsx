import { LeftHelperBoard, RightHelperBoard } from "./game_map_helper";
import { useContext } from "react";
import { PlayerDataContext } from ".";

const GameMap = () => {
  const { playerData, socket } = useContext(PlayerDataContext);
  const StartGameBtn = () => {
    return (
      <div
        className="bg-white h-12 w-52 text-black flex justify-center cursor-pointer items-center font-bold text-lg"
        onClick={(e) => {
          e.preventDefault();
          socket.emit("start-order");
        }}
      >
        Start Game
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
              return <div key={index} className="bg-white"></div>;
            }
            return (
              <div
                key={index}
                style={{ backgroundColor: col.color, borderWidth: "1px" }}
                className="border-gray-400"
              ></div>
            );
          });
        })}
      </div>
    );
  }
};

const GameComponents = () => {
  return (
    <div
      className="flex justify-center "
      style={{ height: "95%", width: "90%" }}
    >
      <LeftHelperBoard />
      <GameMap />
      <RightHelperBoard />
    </div>
  );
};

export default GameComponents;
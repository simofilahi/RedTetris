import { PlayerDataContext } from ".";
import React, { useContext } from "react";
import winnerImg from "assets/img/winner.png";
import loserImg from "assets/img/loser.png";
import peopleImg from "assets/img/people.png";
import sorryImg from "assets/img/sorry.png";
import { ContextInt } from "./interfaces";

export const EndGameCard = () => {
  const { playerData }: ContextInt = useContext(PlayerDataContext);
  let src: string = "";
  if (playerData.game_room_full) {
    src = peopleImg;
  } else if (playerData.winner) {
    src = winnerImg;
  } else if (playerData.game_state === "started") {
    src = sorryImg;
  } else src = loserImg;
  return (
    <div className="h-full w-full bg-black opacity-95 absolute top-0 z-index flex flex-col ">
      <div
        className="py-10 px-20 self-end font-medium text-2xl cursor-pointer "
        onClick={() => {
          window.location.reload();
        }}
      >
        x
      </div>
      <div className="flex-auto  m-20  justify-center items-center flex flex-col opacity-100">
        <img src={src} className="h-98 w-96 self-center" />
        {playerData.game_state === "started" && (
          <div className="text-white p-4 font-semibold ">
            The game room you are trying to access has already started :)
          </div>
        )}
        {playerData.game_room_full && (
          <div className="text-white p-4 font-semibold ">
            The game room you are trying to access is already full :)
          </div>
        )}
      </div>
    </div>
  );
};

// DISPLAY LOSER OR WINNER IMG DEPEND ON PLAYER IF HE LOSES OR WIN
export const EndGameCmp = () => {
  const { playerData }: ContextInt = useContext(PlayerDataContext);

  if (
    playerData?.winner ||
    playerData?.loser ||
    playerData?.game_room_full ||
    playerData?.game_state === "started"
  )
    return <EndGameCard />;
  return <></>;
};

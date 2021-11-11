import { PlayerDataContext } from ".";
import { useContext } from "react";
import winnerImg from "../../assets/img/winner.png";
import loserImg from "../../assets/img/loser.png";

// DISPLAY LOSER OR WINNER IMG DEPEND ON PLAYER IF HE LOSES OR WIN
export const EndGameCmp = () => {
  const { playerData } = useContext(PlayerDataContext);
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

  if (playerData?.winner || playerData?.loser) return <EndGameCard />;
  return <></>;
};

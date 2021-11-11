import { useState, useEffect } from "react";

// CREAT SOUND PLAYER AND CONTROLE IT
const useAudio = (src: any) => {
  const [audio]: any = useState(new Audio(src));
  const [playing, setPlaying]: any = useState(false);

  // LISTEN TO PLAYING PROP AND START OR PAUSE THE SOUND
  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  /* 
    - CREATE LISTENER FOR THE SOUND,
      SO AT THE END OF SOUND WE CAN REPEAT SOUND AGAIN FROM BEGGING
    - REMOVE LISTENER IF THE COMPONENT UNMOUNTED
  */
  useEffect(() => {
    audio.addEventListener("ended", () => audio.play());
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return [playing, setPlaying];
};

export default useAudio;

import React, { useState, useEffect } from "react";

const useAudio = (src: any) => {
  const [audio]: any = useState(new Audio(src));
  const [playing, setPlaying]: any = useState(false);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => audio.play());
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return [playing, setPlaying];
};

export default useAudio;

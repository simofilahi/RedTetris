import Game from "./Game";
import { playerInt } from "./interfaces";
// const Game = require("./Game");

class Player extends Game implements playerInt {
  constructor(shapesPoolId: string) {
    super(shapesPoolId);
  }

  keyPressEvent(key: string): void {
    if (key === "left") this.moveToLeft();
    else if (key === "right") this.moveToRight();
    else if (key === "down") this.moveDown();
    else if (key === "upper") this.rotate();
    else if (key === "space") this.instantDrop();
  }
}

export default Player;

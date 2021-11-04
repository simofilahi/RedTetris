import Game from "./Game";
// const Game = require("./Game");

class Player extends Game {
  constructor(shapesPoolId: string) {
    super(shapesPoolId);
  }

  keyPressEvent(key: any) {
    if (key === "left") this.moveToLeft();
    else if (key === "right") this.moveToRight();
    else if (key === "down") this.moveDown();
    else if (key === "upper") this.rotate();
    else if (key === "space") this.instantDrop();
  }
}

export default Player;

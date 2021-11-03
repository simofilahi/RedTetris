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
    else if (key === "space") this.rotate();
    else if (key === "a") this.addShapeToMap();
  }
}

export default Player;

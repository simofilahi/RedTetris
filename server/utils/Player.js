const Game = require("./Game");

class Player extends Game {
  constructor() {
    super();
    this.map = this.mapGenerator();
    this.currShape = this.getPiece();
  }

  setNewPos = () => {
    for (let index = 0; index < shape.length; index++) {
      shape[index]["x"] -= 1;
    }
  };

  applyNewPos = () => {
    for (let index = 0; index < shape.length; index++) {
      for (let row = 0; row < this.map.length; row++) {
        if (shape[index].y === row) {
          for (let x = 0; x < this.map[row].length; x++) {
            if (currShape[index].x === x) {
              this.map[row][x] = currShape[index];
              break;
            }
          }
          break;
        }
      }
    }
  };

  clear = () => {
    this.map.forEach((row) => {
      row.forEach((sqaure) => {
        if (!sqaure.floated) sqaure.filled = 0;
      });
    });
  };

  draw = () => {
    this.clear();
    this.map.forEach((row) => {
      row.forEach((item) => process.stdout.write(item.filled.toString()));
      console.log();
    });
  };

  moveToLeft = () => {};

  moveToRight = () => {};

  moveDown = () => {};

  rotate = () => {};

  keyPressEvent(key) {
    if (key === "left") this.moveToLeft();
    else if (key === "right") this.moveToRight();
    else if (key === "down") this.moveDown();
    else if (key === "rotate") this.rotate();

    this.draw();
  }
}

module.exports = Player;

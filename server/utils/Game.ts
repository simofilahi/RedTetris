import Shape from "./Shape";

export interface Square {
  fill: number,
  color: string,
};

class Game extends Shape {
  square: Square = { fill: 0, color: "" };
  map: Array<Array<Square>>;
  shape: any;

  constructor() {
    super()
    this.map = this.mapGenerator();
    this.addShapeToMap();
  }

  * colGeneratore() {
    for (let i: number = 0; i < 10; i++)
      yield this.square;
  }

  * rowGenerator() {
    for (let i: number = 0; i < 10; i++)
      yield [...this.colGeneratore()];
  }

  mapGenerator(): Array<Array<Square>> {
    return [
      ...this.rowGenerator(),
    ];
  };

  updateMap(): void {
    this.clear();
    for (let shapeRow: number = 0; shapeRow < this.shape.length; shapeRow++) {
      for (let shapeCol: number = 0; shapeCol < this.shape[shapeRow].length; shapeCol++) {
        this.map[this.shape[shapeRow][shapeCol].row][this.shape[shapeRow][shapeCol].col] = { ...this.shape[shapeRow][shapeCol] };
      }
    }
    this.draw();
  }

  verticalChecker(): boolean | void {
    for (let shapeRow: number = 0; shapeRow < this.shape.length; shapeRow++) {
      for (let shapeCol: number = 0; shapeCol < this.shape[shapeRow].length; shapeCol++) {
        if (this.shape[shapeRow][shapeCol].row + 1 > 9)
          return true;
      }
    }
    return false;
  }

  horizantalChecker(): boolean | void {
    for (let shapeRow: number = 0; shapeRow < this.shape.length; shapeRow++) {
      for (let shapeCol: number = 0; shapeCol < this.shape[shapeRow].length; shapeCol++) {
        if (this.shape[shapeRow][shapeCol].col > 9 || this.shape[shapeRow][shapeCol].col < 0)
          return true;
      }
    }
    return false;
  }

  addShapeToMap(): void {
    this.shape = this.getShape();
    this.updateMap();
  }

  clear() {
    for (let mapRow: number = 0; mapRow < this.map.length; mapRow++) {
      for (let mapCol: number = 0; mapCol < this.map[mapRow].length; mapCol++) {
        this.map[mapRow][mapCol].fill = 0;
        this.map[mapRow][mapCol].color = "";
      }
    }
  }

  moveToLeft() {
    if (!this.horizantalChecker()) {
      for (let shapeRow: number = 0; shapeRow < this.shape.length; shapeRow++) {
        for (let shapeCol: number = 0; shapeCol < this.shape[shapeRow].length; shapeCol++) {
          this.shape[shapeRow][shapeCol].col--;
        }
      }
      this.updateMap();
    }
  };

  moveToRight() {
    if (!this.horizantalChecker()) {
      for (let shapeRow: number = 0; shapeRow < this.shape.length; shapeRow++) {
        for (let shapeCol: number = 0; shapeCol < this.shape[shapeRow].length; shapeCol++) {
          this.shape[shapeRow][shapeCol].col++;
        }
      }
      this.updateMap();
    }
  };

  moveDown() {
    if (!this.verticalChecker()) {
      for (let shapeRow: number = 0; shapeRow < this.shape.length; shapeRow++) {
        for (let shapeCol: number = 0; shapeCol < this.shape[shapeRow].length; shapeCol++) {
          this.shape[shapeRow][shapeCol].row++;
        }
      }
      this.updateMap();
    }
  };

  rotate() { };

  draw() {
    console.clear();
    this.map.forEach((row) => {
      row.forEach((item) => process.stdout.write(item.fill.toString()));
      process.stdout.write("\n");
    });
  };
}

export default Game;
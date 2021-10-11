import Shape from "./Shape";

export interface Square {
  fill: number,
  color: string,
  value: string,
};

class Game extends Shape {
  square: Square = { fill: 0, color: "", value: "." };
  map: Array<Array<Square>>;
  shape: any;
  colNum: number;
  rowNum: number;

  constructor() {
    super()
    this.map = this.mapGenerator();
    this.addShapeToMap();
    this.colNum = 10;
    this.rowNum = 10;
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

  verticalSpaceChecker(): boolean {
    const mapRowCount = this.map.length;
    const shapeRowCount = this.shape.pieces.length;
    const currRowIndex = (this.shape.cords.row + 1);

    if ((shapeRowCount + currRowIndex) > mapRowCount)
      return true;
    return false;
  }

  horizontalSpaceChecker(sign: string): boolean {
    const mapColCount = this.map[0].length;
    const shapeMaxColCount = this.shape.pieces[0].length;
    let currColIndex = this.shape.cords.col;

    console.log({
      mapColCount,
      shapeMaxColCount,
      currColIndex
    });
    if (sign == "+") {
      if ((shapeMaxColCount + (currColIndex + 1)) > mapColCount)
        return true;
    }
    else if (sign == "-") {
      if ((currColIndex - 1) < 0)
        return true;
    }
    return false;
  }

  updateMap(): void {
    for (let shapeRow: number = 0; shapeRow < this.shape.pieces.length; shapeRow++) {
      for (let shapeCol: number = 0; shapeCol < this.shape.pieces[shapeRow].length; shapeCol++) {
        this.map[shapeRow + this.shape.cords.row][shapeCol + this.shape.cords.col] = { ...this.shape.pieces[shapeRow][shapeCol] };
      }
    }
  }

  addShapeToMap(): void {
    this.shape = this.getShape();
    this.draw();
  }

  // clear() {
  //   for (let mapRow: number = 0; mapRow < this.map.length; mapRow++) {
  //     for (let mapCol: number = 0; mapCol < this.map[mapRow].length; mapCol++) {
  //       if (!(mapRow === this.map.length)) {
  //         this.map[mapRow][mapCol].fill = 0;
  //         this.map[mapRow][mapCol].color = "";
  //         this.map[mapRow][mapCol].value = "."
  //       }
  //     }
  //   }
  // }

  fakeMap() {
    const mapCopy = [...JSON.parse(JSON.stringify(this.map))];
    for (let shapeRow: number = 0; shapeRow < this.shape.pieces.length; shapeRow++) {
      for (let shapeCol: number = 0; shapeCol < this.shape.pieces[shapeRow].length; shapeCol++) {
        mapCopy[shapeRow + this.shape.cords.row][shapeCol + this.shape.cords.col] = { ...this.shape.pieces[shapeRow][shapeCol] };
      }
    }
    return mapCopy;
  }

  draw() {
    console.log("--------------------------------");
    console.log("");
    const mapCopy = this.fakeMap();
    mapCopy.forEach((row) => {
      row.forEach((item) => {
        process.stdout.write(item.value)
      });
      process.stdout.write("\n");
    });
    console.log("");
    console.log("--------------------------------");
  };

  moveDown() {
    if (!this.verticalSpaceChecker()) {
      this.shape.cords.row++;
      this.draw();
    } else {
      this.updateMap();
    }
  };

  moveToLeft() {
    if (
      !this.horizontalSpaceChecker("-")
    ) {
      this.shape.cords.col--;
      this.draw();
    }

  };

  moveToRight() {
    if (!this.horizontalSpaceChecker("+")) {
      this.shape.cords.col++;
      this.draw();
    }
  }

  fall() {
    setInterval(() => {
      this.moveDown();
    }, 2000)
  }

  collisionChecker(): boolean {
    for (let shapeRow: number = 0; shapeRow < this.shape.pieces.length; shapeRow++) {
      for (let shapeCol: number = 0; shapeCol < this.shape.pieces[shapeRow].length; shapeCol++) {
        const col = shapeCol + this.shape.cords.col;
        const row = shapeRow + this.shape.cords.row
        console.log({
          col, row
        });
        if ((col >= 10 || col < 0) || (row >= 10 || row < 0))
          return true;
      }
    }
    return false;
  }

  rotate() {
    const matrix = [];

    for (let shapeRow: number = 0; shapeRow < this.shape.pieces.length; shapeRow++) {
      for (let shapeCol: number = 0; shapeCol < this.shape.pieces[shapeRow].length; shapeCol++) {
        if (!matrix[shapeCol])
          matrix[shapeCol] = [];
        matrix[shapeCol].unshift(this.shape.pieces[shapeRow][shapeCol]);
      }
    }
    this.shape.pieces = matrix;
    if (this.collisionChecker())
      this.rotate();
    this.draw();
  };

}

export default Game;
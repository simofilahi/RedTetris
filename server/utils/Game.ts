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
    this.clear();

    for (let shapeRow: number = 0; shapeRow < this.shape.pieces.length; shapeRow++) {
      for (let shapeCol: number = 0; shapeCol < this.shape.pieces[shapeRow].length; shapeCol++) {
        this.map[shapeRow + this.shape.cords.row][shapeCol + this.shape.cords.col] = { ...this.shape.pieces[shapeRow][shapeCol] };
      }
    }
    this.draw();
  }

  addShapeToMap(): void {
    this.shape = this.getShape();
    this.updateMap();
  }

  clear() {
    for (let mapRow: number = 0; mapRow < this.map.length; mapRow++) {
      for (let mapCol: number = 0; mapCol < this.map[mapRow].length; mapCol++) {
        if (!this.map[mapRow][mapCol]["landed"]) {
          this.map[mapRow][mapCol].fill = 0;
          this.map[mapRow][mapCol].color = "";
          this.map[mapRow][mapCol].value = "."
        }
      }
    }
  }

  setShapeLanded() {
    for (let mapRow: number = 0; mapRow < this.map.length; mapRow++) {
      for (let mapCol: number = 0; mapCol < this.map[mapRow].length; mapCol++) {
        if (this.map[mapRow][mapCol].value !== ".") {
          console.log("Here");
          this.map[mapRow][mapCol]["landed"] = true;
        }

      }
    }
  }

  draw() {
    console.log("--------------------------------");
    console.log("");
    this.map.forEach((row) => {
      row.forEach((item) => {
        process.stdout.write(item.value)
      }
      );
      process.stdout.write("\n");
    });
    console.log("");
    console.log("--------------------------------");
  };

  moveDown() {
    if (!this.verticalSpaceChecker() && !this.neighborShapesCollision()) {
      this.shape.cords.row++;
      this.updateMap();
    } else {
      this.setShapeLanded();
    }
  };

  moveToLeft() {
    if (
      !this.horizontalSpaceChecker("-")
    ) {
      this.shape.cords.col--;
      this.updateMap();
    }

  };

  moveToRight() {
    if (!this.horizontalSpaceChecker("+")) {
      this.shape.cords.col++;
      this.updateMap();
    }
  }




  neighborShapesCollision(): boolean {
    for (let mapRow: number = 0; mapRow < this.map.length; mapRow++) {
      for (let mapCol: number = 0; mapCol < this.map[mapRow].length; mapCol++) {
        const lastShapeRowIndx = this.shape.length;
        for (let shapeCol: number = 0; shapeCol < this.shape[lastShapeRowIndx]; shapeCol++) {
          if (this.shape[lastShapeRowIndx][shapeCol])
        }
        // console.log(this.map[mapRow][mapCol]["landed"]);
        // console.log({ mapRow });
        // const currShapeRow = (this.shape.pieces.length + this.shape.cords.row);
        // console.log(currShapeRow);

        // if (this.map[mapRow][mapCol]["landed"] && (mapRow === currShapeRow))
        //   return true;
      }
    }
    return false;
  }



  mapEdgesCollisionChecker(): boolean {
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
    if (this.mapEdgesCollisionChecker())
      this.rotate();
    this.updateMap();
  };

  // fall() {
  //   setInterval(() => {
  //     this.moveDown();
  //   }, 2000)
  // }


}

export default Game;
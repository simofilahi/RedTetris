import { parse } from "path/posix";
import Shape from "./Shape";

export interface Square {
  status: string;
  color: string;
  value: string;
}

class Game extends Shape {
  square: Square = { status: "", color: "", value: "." };
  map: Array<Array<Square>>;
  shape: any;
  colCount: number;
  rowCount: number;

  constructor() {
    super();
    this.map = this.mapGenerator();
    this.addShapeToMap();
    this.colCount = 10;
    this.rowCount = 10;
  }

  *colGeneratore() {
    for (let i: number = 0; i < 10; i++) yield this.square;
  }

  *rowGenerator() {
    for (let i: number = 0; i < 10; i++) yield [...this.colGeneratore()];
  }

  mapGenerator(): Array<Array<Square>> {
    return [...this.rowGenerator()];
  }

  // ADD SHAPE TO MAP
  updateMap(): void {
    this.clear();
    for (
      let shapeRow: number = 0;
      shapeRow < this.shape.pieces.length;
      shapeRow++
    ) {
      for (
        let shapeCol: number = 0;
        shapeCol < this.shape.pieces[shapeRow].length;
        shapeCol++
      ) {
        const row = shapeRow + this.shape.cords.row;
        const col = shapeCol + this.shape.cords.col;
        try {
          if (
            this.map[row][col].value != "0" ||
            this.map[row][col].value != "."
          )
            this.map[row][col] = {
              ...JSON.parse(
                JSON.stringify(this.shape.pieces[shapeRow][shapeCol])
              ),
            };
        } catch {
          return;
        }
      }
    }
    this.draw();
  }

  // GOT RANDOM SHAPE AND ADD IT INTO MAP
  addShapeToMap(): void {
    this.shape = { ...JSON.parse(JSON.stringify(this.getShape())) };
    this.updateMap();
  }

  // CLEAR THE MAP EXPECEPT FOR LANDED SHAPES
  clear() {
    for (let mapRow: number = 0; mapRow < this.map.length; mapRow++) {
      for (let mapCol: number = 0; mapCol < this.map[mapRow].length; mapCol++) {
        if (this.map[mapRow][mapCol]["status"] === "active") {
          this.map[mapRow][mapCol].status = "";
          this.map[mapRow][mapCol].color = "";
          this.map[mapRow][mapCol].value = ".";
        }
      }
    }
  }

  // SET LANDED VARIABLE TO TRUE OF A SHAPE
  setShapeLanded() {
    for (let mapRow: number = 0; mapRow < this.map.length; mapRow++) {
      for (let mapCol: number = 0; mapCol < this.map[mapRow].length; mapCol++) {
        if (this.map[mapRow][mapCol].value !== ".") {
          console.log("LANDED FUNCTIONS");
          this.map[mapRow][mapCol]["status"] = "landed";
        }
      }
    }
  }

  // DRAW MAP
  draw() {
    console.log("--------------------------------");
    console.log("");
    this.map.forEach((row) => {
      row.forEach((item) => {
        process.stdout.write(item.value);
      });
      process.stdout.write("\n");
    });
    console.log("");
    console.log("--------------------------------");
  }

  // MOVE SHAPE DOWN
  moveDown() {
    /* IF THERE NO COLLISOIN OR NOT THE END OF MAP
       KEEP INCREMENT ROW AND MOVE SHAPE DOWN
       ELSE SET THE ACTIVE SHAPE AS LANDED AND ADD NEW
       SHAPE TO THE MAP
    */
    if (!this.neighborShapesCollision("down")) {
      this.shape.cords.row++;
      this.updateMap();
    } else {
      this.setShapeLanded();
      this.addShapeToMap();
    }
  }

  // MOVE SHAPE TO THE LEFT
  moveToLeft() {
    if (!this.neighborShapesCollision("left")) {
      this.shape.cords.col--;
      this.updateMap();
    } else {
      this.draw();
    }
  }

  // MOVE SHAPE TO THE RIGHT
  moveToRight() {
    if (!this.neighborShapesCollision("right")) {
      this.shape.cords.col++;
      this.updateMap();
    } else {
      this.draw();
    }
  }

  // VERIFY TOP SIDE COLLISSION OF A SHAPE
  topCollission(neighborPostion: any, currPosition: any, rowIndex): boolean {
    // VERIFY THE TOP POINT IS EMPTY OR THE END OF MAP ROWS
    if (
      (neighborPostion &&
        neighborPostion["status"] === "landed" &&
        neighborPostion["value"] != "0" &&
        currPosition["value"] != "0") ||
      rowIndex <= 0
    )
      return true;
    return false;
  }

  // VERIFY RIGHT SIDE COLLISSION OF A SHAPE
  rightCollission(
    neighborPostion: any,
    currPosition: any,
    colIndex: number
  ): boolean {
    // VERIFY RIGHT POINT IS EMPTY OR THE END OF MAP COLUMNS;
    console.log({ colIndex });
    console.log({ colCount: this.colCount });
    if (
      (neighborPostion &&
        neighborPostion?.status === "landed" &&
        neighborPostion.value != "0" &&
        currPosition.value != "0") ||
      colIndex >= this.colCount
    )
      return true;
    return false;
  }

  // VERIFY LEFT SIDE COLLISSION OF A SHAPE
  leftCollission(
    neighborPostion: any,
    currPosition: any,
    colIndex: number
  ): boolean {
    // VERIFY THE LEFT POINT IS EMPTY OR THE END OF MAP COLUMNS
    if (
      (neighborPostion?.status === "landed" &&
        neighborPostion.value != "0" &&
        currPosition.value != "0") ||
      colIndex < 0
    )
      return true;
    return false;
  }

  // VERIFY BOTTOM SIDE COLLISSION OF A SHAPE
  bottomCollission(
    neighborPostion: any,
    currPosition: any,
    rowIndex: number
  ): boolean {
    // VERIFY THE BOTTOM POINT IS EMPTY OR THE END OF MAP ROWS
    console.log("bottom Collission function");
    console.log({ rowIndex });
    console.log({ rowCount: this.rowCount });
    if (
      (neighborPostion?.status === "landed" &&
        neighborPostion.value != "0" &&
        currPosition.value != "0") ||
      rowIndex >= this.rowCount
    )
      return true;
    return false;
  }

  rotationCollisionCheck(mapRow: number, mapCol: number) {
    console.log("Rotation =====> ");
    if (
      this.rightCollission(
        this.map[mapRow][mapCol + 1],
        this.map[mapRow][mapCol],
        mapCol + 1
      )
    ) {
      console.log("right Collission");
      return true;
    } else if (
      this.leftCollission(
        this.map[mapRow][mapCol - 1],
        this.map[mapRow][mapCol],
        mapCol - 1
      )
    ) {
      console.log("left Collission");
      return true;
    } else if (
      this.bottomCollission(
        this.map[mapRow === this.rowCount - 1 ? mapRow : mapRow + 1][mapCol],
        this.map[mapRow][mapCol],
        mapRow + 1
      )
    ) {
      console.log("down collission");
      return true;
    } else if (
      this.topCollission(
        this.map[mapRow === 0 ? mapRow : mapRow - 1][mapCol],
        this.map[mapRow][mapCol],
        mapRow - 1
      )
    ) {
      console.log("down collission");
      return true;
    } else if (
      this.bottomCollission(
        this.map[mapRow === this.rowCount - 1 ? mapRow : mapRow + 1][mapCol],
        this.map[mapRow][mapCol],
        mapRow + 1
      )
    ) {
      console.log("down collission");
      return true;
    }
    return false;
  }

  neighborShapesCollision(sign: string | undefined): boolean {
    // ITERRATE TROUGH THE MAP AND LOOK FOR ACTIVE SHAPE THEN START CHECKING FOR NEIGHBOR COLLESION
    for (let mapRow: number = 0; mapRow < this.map.length; mapRow++) {
      for (let mapCol: number = 0; mapCol < this.map[mapRow].length; mapCol++) {
        // console.log(sign, this.map[mapRow][mapCol]);
        // DO NEIGHBOR COLLISON VERIFICATION JUST FOR CURRENT SHAPE IN OUR CASE MEAN ACTIVE SHAPE
        if (this.map[mapRow][mapCol]["status"] === "active" && sign) {
          console.log("**************");
          console.log({ mapRow });
          console.log("**************");
          // SIGN JUST USED IN CASE LEFT OR RIGHT ARROW PRESSED
          if (
            sign === "right" &&
            this.rightCollission(
              this.map[mapRow][mapCol + 1],
              this.map[mapRow][mapCol],
              mapCol + 1
            )
          ) {
            console.log("right Collission");
            return true;
          } else if (
            sign === "left" &&
            this.leftCollission(
              this.map[mapRow][mapCol - 1],
              this.map[mapRow][mapCol],
              mapCol - 1
            )
          ) {
            console.log("left Collission");
            return true;
          } else if (
            this.bottomCollission(
              this.map[mapRow === this.rowCount - 1 ? mapRow : mapRow + 1][
                mapCol
              ],
              this.map[mapRow][mapCol],
              mapRow + 1
            )
          ) {
            console.log("down Collission");
            return true;
          }
        } else if (this.map[mapRow][mapCol]["status"] === "active") {
          if (this.rotationCollisionCheck(mapRow, mapCol)) return true;
        }
      }
    }
    return false;
  }

  // DO ROTATION 90 DEGREE TO ACTIVE SHAPE
  rotate() {
    const matrix = [];

    for (
      let shapeRow: number = 0;
      shapeRow < this.shape.pieces.length;
      shapeRow++
    ) {
      for (
        let shapeCol: number = 0;
        shapeCol < this.shape.pieces[shapeRow].length;
        shapeCol++
      ) {
        if (!matrix[shapeCol]) matrix[shapeCol] = [];
        matrix[shapeCol].unshift(this.shape.pieces[shapeRow][shapeCol]);
      }
    }
    this.shape.pieces = matrix;
    if (this.neighborShapesCollision(undefined)) {
      this.rotate();
    }
    this.updateMap();
  }
}

export default Game;

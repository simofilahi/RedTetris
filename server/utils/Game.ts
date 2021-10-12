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

  // DROP FULL LINES
  dropLines(): void {
    // INITIALZE NEW MAP
    const newMap = [];

    // COUNTER TO KNOW IF A ROW FULL
    let count = 0;

    // LOOP TROUGH THE WHOLE MAP
    for (let mapRow: number = 0; mapRow < this.map.length; mapRow++) {
      for (let mapCol: number = 0; mapCol < this.map[mapRow].length; mapCol++) {
        // VERIFY FOR VALUES THAT HAS NO NUMBER THEY MEAN LIKE EMPTY
        if (
          this.map[mapRow][mapCol].value !== "0" &&
          this.map[mapRow][mapCol].value !== "." &&
          this.map[mapRow][mapCol]?.status === "landed"
        ) {
          // INCREMENT COUNTER  TO KNOW IF ROW IS FULL
          count++;
        }
      }
      // VERIFY IF ROW NOT FULL PUSH IT TO NEW MAP
      if (count < 9) newMap.push(this.map[mapRow]);

      // RESET COUNT
      count = 0;
    }

    // CALCULATE THE NUMBER OF ROWS NEEDED
    let len = this.rowCount - newMap.length;

    // ADD NEEDED ROWS TO NEW MAP
    for (; len > 0; len--) newMap.unshift([...this.colGeneratore()]);

    // COPY NEW MAP INTO PRIMARY MAP
    this.map = [...JSON.parse(JSON.stringify(newMap))];
  }

  // ADD SHAPE TO MAP
  updateMap(): void {
    // this.dropLines();
    this.clear();
    // ITERRATE TROUGH SHAPE ARRAY
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
        /* CALCULATE THE ROW AND COL OF 
           POSITION IN THE MAP THAT THE SAQURE OF SHAPE WILL BE FIT IN */
        const row = shapeRow + this.shape.cords.row;
        const col = shapeCol + this.shape.cords.col;

        // ADD PIECE AT A POSTION IN THE MAP
        if (
          this.map[row][col]?.value == "." ||
          this.map[row][col]?.value == "0"
        )
          this.map[row][col] = {
            ...JSON.parse(
              JSON.stringify(this.shape.pieces[shapeRow][shapeCol])
            ),
          };
      }
    }
    this.draw();
  }

  // GOT RANDOM SHAPE AND ADD IT INTO MAP
  addShapeToMap(): void {
    this.shape = { ...this.getShape() };
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
    console.log({ "cords.col ": this.shape.cords.col });
    console.log("--------------------------------");
    console.log("");
    console.log("--------------------------------");
    console.log("");
    this.map.forEach((row) => {
      row.forEach((item) => {
        if (item.value === "0") process.stdout.write(".");
        else process.stdout.write(item.value);
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
    /*
    - VERIFY NEIHBOR POINT ITS STATUS LANDED OR NOT
    - VERIFY NEIHBOR POINT IS IT EMPTY OR THE END OF MAP COLUMNS
    - VERIFY THE VALUE OF CURRENT POINT IF IS IT DIFFRENT THAN ZERO 
    */
    console.log("right collision");
    console.log({ colIndex });
    console.log({ colCount: this.colCount });
    console.log({ "neibghour-pos": neighborPostion?.status });
    console.log({ "neibghour-value": neighborPostion?.value });
    console.log({ "curr-pos": currPosition.value });
    if (
      (neighborPostion?.status === "landed" &&
        neighborPostion?.value != "0" &&
        currPosition.value != "0") ||
      colIndex >= this.colCount
    ) {
      return true;
    }
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
        neighborPostion?.value != "0" &&
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
    // console.log("bottom Collission function");
    // console.log({ rowIndex });
    // console.log({ rowCount: this.rowCount });
    if (
      (neighborPostion?.status === "landed" &&
        neighborPostion.value != "0" &&
        currPosition.value != "0") ||
      rowIndex >= this.rowCount
    )
      return true;
    return false;
  }

  // // ROTATION MOVEMENT COLLISION CHECKER
  // rotationCollisionChecker(mapRow: number, mapCol: number) {
  //   console.log("Rotation =====> ");
  //   if (
  //     this.rightCollission(
  //       this.map[mapRow][mapCol + 1],
  //       this.map[mapRow][mapCol],
  //       mapCol + 1
  //     )
  //   ) {
  //     console.log("right Collission");
  //     return true;
  //   } if (
  //     this.leftCollission(
  //       this.map[mapRow][mapCol - 1],
  //       this.map[mapRow][mapCol],
  //       mapCol - 1
  //     )
  //   ) {
  //     console.log("left Collission");
  //     return true;
  //   } else if (
  //     this.bottomCollission(
  //       this.map[mapRow === this.rowCount - 1 ? mapRow : mapRow + 1][mapCol],
  //       this.map[mapRow][mapCol],
  //       mapRow + 1
  //     )
  //   ) {
  //     console.log("down collission");
  //     return true;
  //   } else if (
  //     this.topCollission(
  //       this.map[mapRow === 0 ? mapRow : mapRow - 1][mapCol],
  //       this.map[mapRow][mapCol],
  //       mapRow - 1
  //     )
  //   ) {
  //     console.log("down collission");
  //     return true;
  //   } else if (
  //     this.bottomCollission(
  //       this.map[mapRow === this.rowCount - 1 ? mapRow : mapRow + 1][mapCol],
  //       this.map[mapRow][mapCol],
  //       mapRow + 1
  //     )
  //   ) {
  //     console.log("down collission");
  //     return true;
  //   }
  //   return false;
  // }

  // NORMAL MOVMENT COLLISION CHECKER
  normalMovCollisionChecker(mapRow: number, mapCol: number, sign: string) {
    if (
      sign === "right" &&
      this.rightCollission(
        this.map[mapRow][mapCol + 1],
        this.map[mapRow][mapCol],
        mapCol + 1
      )
    ) {
      console.log("right Collission ______");
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
      sign === "down" &&
      this.bottomCollission(
        this.map[mapRow === this.rowCount - 1 ? mapRow : mapRow + 1][mapCol],
        this.map[mapRow][mapCol],
        mapRow + 1
      )
    ) {
      console.log("down Collission");
      return true;
    }
    return false;
  }

  neighborShapesCollision(sign: string | undefined): boolean {
    // ITERRATE TROUGH THE MAP AND LOOK FOR ACTIVE SHAPE THEN START CHECKING FOR NEIGHBOR COLLESION
    for (let mapRow: number = 0; mapRow < this.map.length; mapRow++) {
      for (let mapCol: number = 0; mapCol < this.map[mapRow].length; mapCol++) {
        // DO NEIGHBOR COLLISON VERIFICATION JUST FOR CURRENT SHAPE IN OUR CASE MEAN ACTIVE SHAPE
        if (this.map[mapRow][mapCol]["status"] === "active" && sign) {
          // SIGN JUST USED IN CASE LEFT OR RIGHT OR DOWN ARROW PRESSED
          // CHECK COLLISION FOR NORMAL MOVMENTS
          if (this.normalMovCollisionChecker(mapRow, mapCol, sign)) return true;
        }
        // } else if (this.map[mapRow][mapCol]["status"] === "active") {
        //   // CHECK COLLISION AN CASE SHAPE ROTATED
        //   if (this.rotationCollisionChecker(mapRow, mapCol)) return true;
        // }
      }
    }
    return false;
  }

  rotationCollision() {
    const shapeCpy = { ...JSON.parse(JSON.stringify(this.shape)) };
    console.log("I'm here");
    for (
      let shapeRow: number = 0;
      shapeRow < shapeCpy.pieces.length;
      shapeRow++
    ) {
      for (
        let shapeCol: number = 0;
        shapeCol < shapeCpy.pieces[shapeRow].length;
        shapeCol++
      ) {
        /* CALCULATE THE ROW AND COL OF 
           POSITION IN THE MAP THAT THE SAQURE OF SHAPE WILL BE FIT IN */
        const row = shapeRow + shapeCpy.cords.row;
        const col = shapeCol + shapeCpy.cords.col;

        console.log("insided => ", row);
        if (
          row >= this.rowCount ||
          col >= this.colCount ||
          col < 0 ||
          (this.map[row][col]?.status == "landed" &&
            (this.map[row][col]?.value != "." ||
              this.map[row][col]?.value != "0"))
        ) {
          console.log("before true");
          return true;
        }
      }
    }
    console.log("OUT");
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
    this.shape.pieces = [...JSON.parse(JSON.stringify(matrix))];
    if (this.rotationCollision()) {
      this.rotate();
    }
    this.updateMap();
  }
}

export default Game;

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
  gravityInterval: number;
  gameOver: boolean;

  constructor() {
    super();
    this.colCount = 10;
    this.rowCount = 10;
    this.map = this.mapGenerator();
    this.addShapeToMap();
    this.gravityInterval = 1000;
    this.gameOver = false;
  }

  *colGeneratore() {
    for (let i: number = 0; i < this.colCount; i++) yield this.square;
  }

  *rowGenerator() {
    for (let i: number = 0; i < this.rowCount; i++)
      yield [...this.colGeneratore()];
  }

  mapGenerator(): Array<Array<Square>> {
    return [...this.rowGenerator()];
  }

  // DROP FULL LINES
  dropRows(): void {
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
      if (count < this.rowCount) newMap.push(this.map[mapRow]);

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
    // DROP ROWS THAT ARE FULL
    this.dropRows();

    // CLEAR THE MAP
    this.clear();
    // ITERATE TROUGH ROWS OF CURRENT SHAPE
    for (
      let shapeRow: number = 0;
      shapeRow < this.shape.pieces.length;
      shapeRow++
    ) {
      // ITERATE TROUGH ROWS OF CURRENT SHAPE
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
    // DRAW THE MAP
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
    /* 
      IF THE CURRENT SHAPE LANDED SET
      ITS STATUS TO LANDED SO THE CLEAR
      FUNC CAN'T REMOVE IT FROM THE MAP
    */
    for (let mapRow: number = 0; mapRow < this.map.length; mapRow++) {
      for (let mapCol: number = 0; mapCol < this.map[mapRow].length; mapCol++) {
        if (this.map[mapRow][mapCol].value !== ".") {
          this.map[mapRow][mapCol]["status"] = "landed";
        }
      }
    }
  }

  // DRAW MAP
  draw() {
    console.log("--------------------------------");
    console.log("--------------------------------");
    console.log("");
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
    /* IF THERE ARE NO COLLISOINS
       KEEP INCREMENT ROW AND MOVE SHAPE DOWN
       ELSE SET THE CURRENT SHAPE AS LANDED AND ADD NEW
       SHAPE TO THE MAP
    */
    if (!this.gameOver) {
      this.shape.cords.row++;
      if (!this.collisionDetecter()) {
        this.updateMap();
      } else {
        this.shape.cords.row--;
        this.setShapeLanded();
        this.addShapeToMap();
      }
      if (this.gameOver) console.log("Game Over!");
    } else {
      console.log("Game Over!");
    }
  }

  // MOVE SHAPE TO THE LEFT
  moveToLeft() {
    /* IF THERE ARE NO COLLISOINS
       KEEP DEINCREMENT COL AND MOVE SHAPE TO LEFT
    */
    this.shape.cords.col--;
    if (!this.collisionDetecter()) {
      this.updateMap();
    } else {
      this.shape.cords.col++;
      this.draw();
    }
  }

  // MOVE SHAPE TO THE RIGHT
  moveToRight() {
    /* IF THERE ARE NO COLLISOINS
       KEEP INCREMENT COL AND MOVE SHAPE TO RIGHT
    */
    this.shape.cords.col++;
    if (!this.collisionDetecter()) {
      this.updateMap();
    } else {
      this.shape.cords.col--;
      this.draw();
    }
  }

  collisionDetecter() {
    // DEEP COPY OF CURRENT SHAPE
    const shapeCpy = { ...JSON.parse(JSON.stringify(this.shape)) };

    // ITERATE TROUGH ROWS OF CURRENT SHAPE
    for (
      let shapeRow: number = 0;
      shapeRow < shapeCpy.pieces.length;
      shapeRow++
    ) {
      // ITERATE TROUGH COLS OF CURRENT SHAPE
      for (
        let shapeCol: number = 0;
        shapeCol < shapeCpy.pieces[shapeRow].length;
        shapeCol++
      ) {
        /* CALCULATE THE ROW AND COL OF 
           POSITION IN THE MAP THAT THE  POINT OF THE CURRENT SHAPE WILL BE FIT IN */
        const row = shapeRow + shapeCpy.cords.row;
        const col = shapeCol + shapeCpy.cords.col;

        // DATA OF CURRENT POINT IN MAP
        const currtPointData = this.map[row] ? this.map[row][col] : undefined;

        // DATA OF NEW POINT THAT WILL BE ADDED IN MAP
        const shapePointData = shapeCpy.pieces[shapeRow][shapeCol];

        /*
            - CHECK FOR X AXIS COLLISION
            - CEHCK FOR Y AXIS COLLISION
            - CHECK FOR NEIBHOUR COLLISION
            - HANDLE COLLISION IF MAP IS FULL VERTICALLY
        */
        console.log({
          row,
          col,
          currtPointData,
        });
        if (col >= this.colCount || col < 0) {
          return true;
        } else if (row >= this.rowCount) {
          return true;
        } else if (row === 1 && currtPointData?.status == "landed") {
          console.log("map full");
          this.gameOver = true;
          return true;
        } else if (
          currtPointData?.status == "landed" &&
          currtPointData?.value != "0" &&
          currtPointData?.value != "." &&
          shapePointData?.value != "0"
        ) {
          console.log("collision happen");
          return true;
        }
      }
    }
    // IN CASE THERE NO COLLISION
    return false;
  }

  // ROTATION 90 DEGREE TO CURRENT SHAPE
  rotate() {
    // THIS ARRAY WILL HOLD ARRAYS THAT REPRESONT ROWS OF A CURRENT SHAPE
    const matrix = [];

    // ITERATE TROUGH ROWS OF CURRENT SHAPE
    for (
      let shapeRow: number = 0;
      shapeRow < this.shape.pieces.length;
      shapeRow++
    ) {
      // ITERATE TROUGH COLS OF CURRENT SHAPE
      for (
        let shapeCol: number = 0;
        shapeCol < this.shape.pieces[shapeRow].length;
        shapeCol++
      ) {
        /* 
          - ADD ARRAY INSIDE MATRIX IF NOT ALREADY THERE 
          - THE NUMBER OF ARRAYS THAT WILL BE IN MATRIX 
            DEPENDS ON THE COUNT OF COLS IN CURRENT SHAPE ARRAY.
          - EACH ARRAY CREATED WE WILL PUSH INTO IT SHAPE[ROW][COL] DATA OF CURRENT SHAPES
          - THE ARRAY INSIDE MATRIX WILL BE USED AS STACK DATA STRUCTURE
          - EACH TIME WE ADD DATA TO THE ARRAYS OF MATRIX WILL BE ADDED AT INDEX 0
        */
        if (!matrix[shapeCol]) matrix[shapeCol] = [];
        matrix[shapeCol].unshift(this.shape.pieces[shapeRow][shapeCol]);
      }
    }
    // COPY NEW ROTATED SHAPE INTO OLD SHAPE VARIABLE
    this.shape.pieces = [...JSON.parse(JSON.stringify(matrix))];

    /*
      - EACH TIME THERE IS A COLLISION DETECT THE FUNCTION
        WILL CALL IT SELF TO KEEP ROTATING SHAPE UNTIL
        GOT THE FITTED ROTATION
    */
    if (this.collisionDetecter()) {
      this.rotate();
    }
    /* IF NEW ROTATION FITTED DRAW IT INTO THE MAP*/
    this.updateMap();
  }

  // falling() {
  //   setInterval(() => {
  //     this.moveDown();
  //   }, this.gravityInterval);
  // }
}

// // VERIFY TOP SIDE COLLISSION OF A SHAPE
// topCollission(neighborPostion: any, currPosition: any, rowIndex): boolean {
//   // VERIFY THE TOP POINT IS EMPTY OR THE END OF MAP ROWS
//   if (
//     (neighborPostion &&
//       neighborPostion["status"] === "landed" &&
//       neighborPostion["value"] != "0" &&
//       currPosition["value"] != "0") ||
//     rowIndex <= 0
//   )
//     return true;
//   return false;
// }

// // VERIFY RIGHT SIDE COLLISSION OF A SHAPE
// rightCollission(
//   neighborPostion: any,
//   currPosition: any,
//   colIndex: number
// ): boolean {
//   /*
//   - VERIFY NEIHBOR POINT ITS STATUS LANDED OR NOT
//   - VERIFY NEIHBOR POINT IS IT EMPTY OR THE END OF MAP COLUMNS
//   - VERIFY THE VALUE OF CURRENT POINT IF IS IT DIFFRENT THAN ZERO
//   */
//   console.log("right collision");
//   console.log({ colIndex });
//   console.log({ colCount: this.colCount });
//   console.log({ "neibghour-pos": neighborPostion?.status });
//   console.log({ "neibghour-value": neighborPostion?.value });
//   console.log({ "curr-pos": currPosition.value });
//   if (
//     (neighborPostion?.status === "landed" &&
//       neighborPostion?.value != "0" &&
//       currPosition.value != "0") ||
//     colIndex >= this.colCount
//   ) {
//     return true;
//   }
//   return false;
// }

// // VERIFY LEFT SIDE COLLISSION OF A SHAPE
// leftCollission(
//   neighborPostion: any,
//   currPosition: any,
//   colIndex: number
// ): boolean {
//   // VERIFY THE LEFT POINT IS EMPTY OR THE END OF MAP COLUMNS
//   if (
//     (neighborPostion?.status === "landed" &&
//       neighborPostion?.value != "0" &&
//       currPosition.value != "0") ||
//     colIndex < 0
//   )
//     return true;
//   return false;
// }

// // VERIFY BOTTOM SIDE COLLISSION OF A SHAPE
// bottomCollission(
//   neighborPostion: any,
//   currPosition: any,
//   rowIndex: number
// ): boolean {
//   // VERIFY THE BOTTOM POINT IS EMPTY OR THE END OF MAP ROWS
//   // console.log("bottom Collission function");
//   // console.log({ rowIndex });
//   // console.log({ rowCount: this.rowCount });
//   if (
//     (neighborPostion?.status === "landed" &&
//       neighborPostion.value != "0" &&
//       currPosition.value != "0") ||
//     rowIndex >= this.rowCount
//   )
//     return true;
//   return false;
// }

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

// // NORMAL MOVMENT COLLISION CHECKER
// normalMovCollisionChecker(mapRow: number, mapCol: number, sign: string) {
//   if (
//     sign === "right" &&
//     this.rightCollission(
//       this.map[mapRow][mapCol + 1],
//       this.map[mapRow][mapCol],
//       mapCol + 1
//     )
//   ) {
//     console.log("right Collission ______");
//     return true;
//   } else if (
//     sign === "left" &&
//     this.leftCollission(
//       this.map[mapRow][mapCol - 1],
//       this.map[mapRow][mapCol],
//       mapCol - 1
//     )
//   ) {
//     console.log("left Collission");
//     return true;
//   } else if (
//     sign === "down" &&
//     this.bottomCollission(
//       this.map[mapRow === this.rowCount - 1 ? mapRow : mapRow + 1][mapCol],
//       this.map[mapRow][mapCol],
//       mapRow + 1
//     )
//   ) {
//     console.log("down Collission");
//     return true;
//   }
//   return false;
// }

// neighborShapesCollision(sign: string | undefined): boolean {
//   // ITERRATE TROUGH THE MAP AND LOOK FOR ACTIVE SHAPE THEN START CHECKING FOR NEIGHBOR COLLESION
//   for (let mapRow: number = 0; mapRow < this.map.length; mapRow++) {
//     for (let mapCol: number = 0; mapCol < this.map[mapRow].length; mapCol++) {
//       // DO NEIGHBOR COLLISON VERIFICATION JUST FOR CURRENT SHAPE IN OUR CASE MEAN ACTIVE SHAPE
//       if (this.map[mapRow][mapCol]["status"] === "active" && sign) {
//         // SIGN JUST USED IN CASE LEFT OR RIGHT OR DOWN ARROW PRESSED
//         // CHECK COLLISION FOR NORMAL MOVMENTS
//         if (this.normalMovCollisionChecker(mapRow, mapCol, sign)) return true;
//       }
//       // } else if (this.map[mapRow][mapCol]["status"] === "active") {
//       //   // CHECK COLLISION AN CASE SHAPE ROTATED
//       //   if (this.rotationCollisionChecker(mapRow, mapCol)) return true;
//       // }
//     }
//   }
//   return false;
// }

export default Game;

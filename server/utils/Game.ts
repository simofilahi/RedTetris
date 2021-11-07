import ShapesFactory from "./shapesFactory";
import { Square, ShapeInterface, GameInt } from "./interfaces/index";

class Game extends ShapesFactory implements GameInt {
  // DATA OF SQUARE IN SHAPE
  square: Square = { status: "", color: "", value: "." };

  /* 
    DATA OF SQUARE IN SHAPE, THESE FOR THE SHAPES
    ADDED AT THE BOTOM TO MAKE MAP SMALL
  */
  baseSquare: Square = {
    status: "landed",
    color: "#FFFFFF",
    value: "#",
  };

  // THE PLAYER MAP
  map: Array<Array<Square>>;

  // THE PLAYER SPCTRUM MAP
  spectrumMap: Array<Array<Square>>;

  // TETRIS SHAPE
  shape: ShapeInterface;

  // COLUMN COUNT OF THE MAP
  colCount: number;

  // ROW COUNT OF THE MAP
  rowCount: number;

  // GRAVITY INTERVAL
  gravityInterval: number;

  // GAME OVER STATUS
  gameOver: boolean;

  // PLAYER'S SCORE
  score: number;

  // THE COUNT OF ROWS THAT PLAYER DROPED
  removedLinesCount: number;

  // THE COUNT OF TOTAL ROWS DROPED
  droppedRowsCount: number;

  /* THE POOLID OF POOL SHAPE
    THAT WILL BE USED BY THE CURRENT PLAYER
  */
  shapesPoolId: string;

  /* THE SHAPE INDEX WILL BE USE TO GET
   SHAPE BY INDEX FROM THE SHAPES POOL
  */
  shapeIndex: number;

  /* THIS VAR WILL HOLD THE NEXT SHAPE 
   THAT WE WILL SEND TO PLAYER AFTER THIS
   CURRENT SHAPE LANDED
  */
  nextShape: ShapeInterface;

  constructor(shapesPoolId: string) {
    super(shapesPoolId);
    this.shapesPoolId = shapesPoolId;
    this.shapeIndex = 0;
    this.colCount = 10;
    this.rowCount = 20;
    this.map = this.mapGenerator();
    this.spectrumMap = this.mapGenerator();
    this.shape = this.getShape(this.shapesPoolId, this.shapeIndex);
    this.nextShape = this.getShape(this.shapesPoolId, this.shapeIndex + 1);
    this.addShapeToMap();
    this.gravityInterval = 1000;
    this.gameOver = false;
    this.score = 0;
    this.removedLinesCount = 0;
    this.droppedRowsCount = 0;
  }

  // GENERATE COLOS FOR THE MAP
  *colGenerator(square: Square = this.square): any {
    for (let i: number = 0; i < this.colCount; i++) yield square;
  }

  // GENERATE ROWS FOR THE MAP
  *rowGenerator(): any {
    for (let i: number = 0; i < this.rowCount; i++)
      yield [...this.colGenerator()];
  }

  // GENERATE THE INITAL MAP
  mapGenerator(): Array<Array<Square>> {
    return [...this.rowGenerator()];
  }

  // MAKE THE MAP SMALLER
  addRows(rowsCount: number): void {
    if (rowsCount) {
      // REMOVE FIRST ROWS DEPEND ON ROW COUNT
      for (let i = 0; i < rowsCount; i++) {
        this.map.shift();
      }

      // ADD ROWS AT THE END OF MAP, THESE ROW ARE NOT USABLE
      for (let i = 0; i < rowsCount; i++) {
        this.map.push([...this.colGenerator(this.baseSquare)]);
      }
    }
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
          this.map[mapRow][mapCol].value !== "#" &&
          this.map[mapRow][mapCol]?.status === "landed"
        ) {
          // INCREMENT COUNTER  TO KNOW IF ROW IS FULL
          count++;
        }
      }
      // VERIFY IF ROW NOT FULL PUSH IT TO NEW MAP
      if (count < this.colCount) newMap.push(this.map[mapRow]);

      // RESET COUNT
      count = 0;
    }

    // CALCULATE THE NUMBER OF ROWS NEEDED
    let len = this.rowCount - newMap.length;

    // SET REMOVED LINES COUNT
    this.removedLinesCount = len;

    // SET DROPPED LINES
    this.droppedRowsCount += len;

    // ADD NEEDED ROWS TO NEW MAP
    for (; len > 0; len--) {
      // console.log("inside dropRows loop");
      this.score += 10;
      newMap.unshift([...this.colGenerator()]);
    }

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
  }

  // GOT RANDOM SHAPE AND ADD IT INTO MAP
  addShapeToMap(): void {
    this.shape = this.getShape(this.shapesPoolId, this.shapeIndex);
    this.shapeIndex += 1;
    this.nextShape = this.getShape(this.shapesPoolId, this.shapeIndex);
    this.updateMap();
  }

  // GET THE NEXT TETRIS SHAPE FOR THE CURRENT PLAYER
  getNextShape(): ShapeInterface {
    return JSON.parse(JSON.stringify(this.nextShape));
  }

  // CLEAR THE MAP EXPECEPT FOR LANDED SHAPES
  clear(): void {
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
  setShapeLanded(): void {
    /* 
      IF THE CURRENT SHAPE LANDED SET
      ITS STATUS TO LANDED SO THE CLEAR
      FUNC CAN'T REMOVE IT FROM THE MAP
    */
    let landed = false;
    for (let mapRow: number = 0; mapRow < this.map.length; mapRow++) {
      for (let mapCol: number = 0; mapCol < this.map[mapRow].length; mapCol++) {
        if (this.map[mapRow][mapCol].value !== ".") {
          landed = true;
          this.map[mapRow][mapCol]["status"] = "landed";
        }
      }
    }

    /* 
      - IF SHAPE LANDED, 
      - WE UPDATE SPECTURM MAP,
        BY ADDING RECENT LANDED SHAPE TO SPECTRUM LAND
    */
    if (landed) this.landSpectrum();
  }

  // DRAW MAP (DEBUGGING PURPOSE)
  draw(): void {
    console.log("--------------------------------");
    console.log("--------------------------------");
    console.log("");
    console.log("--------------------------------");
    console.log("Game map");
    this.map.forEach((row: any) => {
      row.forEach((item: any) => {
        if (item.value === "0") process.stdout.write(".");
        else process.stdout.write(item.value);
      });
      process.stdout.write("\n");
    });
    console.log("");
    console.log("--------------------------------");
  }

  // MOVE SHAPE DOWN
  moveDown(): boolean {
    /* IF THERE ARE NO COLLISOINS
       KEEP INCREMENT ROW AND MOVE SHAPE DOWN
       ELSE SET THE CURRENT SHAPE AS LANDED AND ADD NEW
       SHAPE TO THE MAP
    */
    if (!this.gameOver) {
      this.shape.cords.row++;
      if (!this.collisionDetecter()) {
        this.updateMap();
        return true;
      } else {
        this.shape.cords.row--;
        this.setShapeLanded();
        this.addShapeToMap();
        return false;
      }
    }
    return false;
  }

  // MOVE SHAPE DOWN UNTIL REACH THE LAND OF MAP
  instantDrop(): void {
    while (this.moveDown());
  }

  // MOVE SHAPE TO THE LEFT
  moveToLeft(): void {
    /* IF THERE ARE NO COLLISOINS
       KEEP DEINCREMENT COL AND MOVE SHAPE TO LEFT
    */
    if (!this.gameOver) {
      this.shape.cords.col--;
      if (!this.collisionDetecter()) {
        this.updateMap();
      } else {
        this.shape.cords.col++;
        // this.draw();
      }
    }
  }

  // MOVE SHAPE TO THE RIGHT
  moveToRight(): void {
    /* IF THERE ARE NO COLLISOINS
       KEEP INCREMENT COL AND MOVE SHAPE TO RIGHT
    */
    if (!this.gameOver) {
      this.shape.cords.col++;
      if (!this.collisionDetecter()) {
        this.updateMap();
      } else {
        this.shape.cords.col--;
        // this.draw();
      }
    }
  }

  // DETECT THE COLLISION
  collisionDetecter(): boolean {
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
            - HANDLE COLLISION IF MAP IS FULL VERTICALLY, 
              AND IF HAPPEND THE GAME IS OVER.
        */
        if (col >= this.colCount || col < 0) {
          return true;
        } else if (row >= this.rowCount) {
          return true;
        } else if (row === 1 && currtPointData?.status == "landed") {
          this.gameOver = true;
          return true;
        } else if (
          currtPointData?.status == "landed" &&
          currtPointData?.value != "0" &&
          currtPointData?.value != "." &&
          shapePointData?.value != "0"
        ) {
          // console.log("collision happen");
          return true;
        }
      }
    }
    // IN CASE THERE IS NO COLLISION
    return false;
  }

  // ROTATION 90 DEGREE TO CURRENT SHAPE
  rotate(): void {
    // THIS ARRAY WILL HOLD ARRAYS THAT REPRESONT ROWS OF A CURRENT SHAPE
    const matrix: Array<any> = [];

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
        WILL CALL ITSELF TO KEEP ROTATING SHAPE UNTIL
        GOT THE FITTED ROTATION
    */
    if (this.collisionDetecter()) {
      this.rotate();
    }
    /* IF NEW ROTATION FITTED DRAW IT INTO THE MAP*/
    this.updateMap();
  }

  // SPECTRUM OF CURRENT PLAYER MAP
  landSpectrum(): void {
    /*
      - ITERATE TROUGH GAME MAP
      - VERIFY CURRENT POINT IF IS IT NOT EMPTY
      - IF POINT OF GAME NOT EMPTY UPDATE THE SAME POINT
        IN SPECTURM MAP BY ADDNG * TO ITS VALUE
      - IF POINT OF MAP GAME EMPTY VERIFY
        THE VERTICAL PARALLEL OF SPECTURM MAP
        IF IS IT HAS * VALUE, THE CURRENT POINT SHOULD ALSO HAS *
    */
    for (let mapRow: number = 0; mapRow < this.map.length; mapRow++) {
      for (let mapCol: number = 0; mapCol < this.map[mapRow].length; mapCol++) {
        if (
          this.map[mapRow][mapCol].value !== "." &&
          this.map[mapRow][mapCol].value !== "0"
        ) {
          this.spectrumMap[mapRow][mapCol] = {
            status: "landed",
            color: "",
            value: "*",
          };
        } else {
          if (mapRow != 0 && this.spectrumMap[mapRow - 1][mapCol].value === "*")
            this.spectrumMap[mapRow][mapCol] = {
              status: "landed",
              color: "",
              value: "*",
            };
        }
      }
    }
  }

  // CHECK FOR GAME IS OVER
  gameOverStatus(): boolean {
    if (this.gameOver) return true;
    return false;
  }

  // GET THE LAND SPECTURM OF THE PLAYER
  getlandSpectrum(): Array<Array<ShapeInterface>> {
    return JSON.parse(JSON.stringify(this.spectrumMap));
  }

  // GET THE SCORE OF THE PLAYER
  getScore(): number {
    return this.score;
  }

  // GET DROPPED LINES COUNT
  getDroppedRowsCount(): number {
    return this.droppedRowsCount;
  }

  // GET THE GAME MAP OF THE PLAYER
  getMap(): Array<Array<ShapeInterface>> {
    this.dropRows();
    return JSON.parse(JSON.stringify(this.map));
  }
}

export default Game;

//  SQUARE OBJ
export interface Square {
  status: string;
  color: string;
  value: string;
}

// CORDS OF A SHAPE
export interface Cords {
  row: number;
  col: number;
}

// SHAPE OBJ
export interface ShapeInterface {
  cords: Cords;
  pieces: Array<Array<Square>>;
}

// SHAPE FACTORY CLASS
export interface shapeFactoryInt {
  generateShapesPool(poolId: string): void;
  addMoreShapeToPool(poolId: string): void;
  dropShapePool(poolId: string): void;
  getShape(poolId: string, index: number): ShapeInterface | null;
}

// PLAYER CLASS
export interface playerInt {
  keyPressEvent(key: string): void;
}

// GAME CLASS

export interface GameInt {
  square: Square;
  baseSquare: Square;

  // THE PLAYER MAP
  map: Array<Array<Square>>;

  // THE PLAYER SPCTRUM MAP
  spectrumMap: Array<Array<Square>>;

  // TETRIS SHAPE
  shape: ShapeInterface | null;

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
  nextShape: ShapeInterface | null;

  // GENERATE COLOS FOR THE MAP
  colGenerator(square: Square): any;

  // GENERATE ROWS FOR THE MAP
  rowGenerator(): any;

  // GENERATE THE INITAL MAP
  mapGenerator(): Array<Array<Square>>;

  // MAKE THE MAP SMALLER BY ADDING UNUSABLE ROWS
  addRows(rowsCount: number): void;

  // DROP FULL ROWS
  dropRows(): void;

  // ADD SHAPE TO MAP
  updateMap(): void;

  // GOT RANDOM SHAPE AND ADD IT INTO MAP
  addShapeToMap(): void;

  // GET THE NEXT TETRIS SHAPE FOR THE CURRENT PLAYER
  getNextShape(): ShapeInterface;

  // CLEAR THE MAP EXPECEPT FOR LANDED SHAPES
  clear(): void;

  // SET LANDED VARIABLE TO TRUE OF A SHAPE
  setShapeLanded(): void;

  // DRAW MAP (DEBUGGING PURPOSE)
  draw(): void;

  // MOVE SHAPE DOWN
  moveDown(): boolean;

  // MOVE SHAPE DOWN UNTIL REACH THE LAND OF MAP
  instantDrop(): void;

  // MOVE SHAPE TO THE LEFT
  moveToLeft(): void;

  // MOVE SHAPE TO THE RIGHT
  moveToRight(): void;

  // DETECT THE COLLISION
  collisionDetecter(): boolean;

  // ROTATION 90 DEGREE TO CURRENT SHAPE
  rotate(): void;

  // SPECTRUM OF CURRENT PLAYER MAP
  landSpectrum(): void;

  // CHECK FOR GAME IS OVER
  gameOverStatus(): boolean;

  // GET THE LAND SPECTURM OF THE PLAYER
  getlandSpectrum(): Array<Array<ShapeInterface>>;

  // GET THE SCORE OF THE PLAYER
  getScore(): number;

  // GET DROPPED LINES COUNT
  getDroppedRowsCount(): number;

  // GET THE GAME MAP OF THE PLAYER
  getMap(): Array<Array<Square>>;
}

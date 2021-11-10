import { ShapeInterface, shapeFactoryInt } from "./interfaces/index";

const shapes: any = {
  "I-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [
        { color: "#32C7EF", value: "1", status: "active" },
        { color: "#32C7EF", value: "1", status: "active" },
        { color: "#32C7EF", value: "1", status: "active" },
        { color: "#32C7EF", value: "1", status: "active" },
      ],
    ],
  },
  "O-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [
        { color: "#F7D20C", value: "2", status: "active" },
        { color: "#F7D20C", value: "2", status: "active" },
      ],
      [
        { color: "#F7D20C", value: "2", status: "active" },
        { color: "#F7D20C", value: "2", status: "active" },
      ],
    ],
  },
  "T-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [
        { color: "", value: "0", status: "active" },
        { color: "#AD4D9B", value: "3", status: "active" },
        { color: "", value: "0", status: "active" },
      ],
      [
        { color: "#AD4D9B", value: "3", status: "active" },
        { color: "#AD4D9B", value: "3", status: "active" },
        { color: "#AD4D9B", value: "3", status: "active" },
      ],
    ],
  },
  "S-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [
        { color: "", value: "0", status: "active" },
        { color: "#43B642", value: "4", status: "active" },
        { color: "#43B642", value: "4", status: "active" },
      ],
      [
        { color: "#43B642", value: "4", status: "active" },
        { color: "#43B642", value: "4", status: "active" },
        { color: "", value: "0", status: "active" },
      ],
    ],
  },
  "Z-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [
        { color: "#EF1F2A", value: "5", status: "active" },
        { color: "#EF1F2A", value: "5", status: "active" },
        { color: "", value: "0", status: "active" },
      ],
      [
        { color: "", value: "0", status: "active" },
        { color: "#EF1F2A", value: "5", status: "active" },
        { color: "#EF1F2A", value: "5", status: "active" },
      ],
    ],
  },
  "J-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [
        { color: "#5A65AD", value: "6", status: "active" },
        { color: "", value: "0", status: "active" },
        { color: "", value: "0", status: "active" },
      ],
      [
        { color: "#5A65AD", value: "6", status: "active" },
        { color: "#5A65AD", value: "6", status: "active" },
        { color: "#5A65AD", value: "6", status: "active" },
      ],
    ],
  },
  "L-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [
        { color: "", value: "0", status: "active" },
        { color: "", value: "0", status: "active" },
        { color: "#EF7920", value: "7", status: "active" },
      ],
      [
        { color: "#EF7920", value: "7", status: "active" },
        { color: "#EF7920", value: "7", status: "active" },
        { color: "#EF7920", value: "7", status: "active" },
      ],
    ],
  },
};

let shapesPools: any = {};

class ShapesFactory implements shapeFactoryInt {
  constructor(poolId: string) {
    this.generateShapesPool(poolId);
  }

  // GENERATE POOL OF SHAPES FOR A SPECIFIC GAME BY POOLID
  generateShapesPool(poolId: string): void {
    // VERIFY POOL  ALREADY EXIST
    if (!shapesPools[poolId]) {
      // CREATE NEW ARRAY FOR THE POOLID PROPERTY
      shapesPools[poolId] = [];

      // GET THE KEYS OF SHAPES ARRAY, (KEYS ARE THE NAMES OF TETRIS PIECES)
      const keys = Object.keys(shapes);

      // ADD 100 RANDOM SHAPE TO THE POOL
      for (let index = 0; index < 100; index++) {
        // GET RANDOM SHAPE FROM SHAPES COLLECTION
        const shape = shapes[keys[Math.floor(keys.length * Math.random())]];

        // PUSH RANDOM SHAPE TO THE ARRAY
        shapesPools[poolId].push(JSON.parse(JSON.stringify(shape)));
      }
    }
  }

  // IN CASE IF A POOL OF SHAPES CONSUMED, WE ADD MORE 100 SHAPES TO IT
  addMoreShapeToPool(poolId: string): void {
    if (shapesPools[poolId]) {
      const keys = Object.keys(shapes);
      for (let index: number = 0; index < 100; index++) {
        // GET RANDOM SHAPE FROM SHAPES COLLECTION
        const shape = shapes[keys[Math.floor(keys.length * Math.random())]];

        // ADD SHAPE TO THE POOL ARRAY
        shapesPools[poolId].push(JSON.parse(JSON.stringify(shape)));
      }
    }
  }

  // DROP THE POOL OF SHAPES AT THE END OF GAME
  dropShapePool(poolId: string) {
    if (!shapesPools[poolId]) {
    }
  }

  // GET A SHAPE FROM A SPECIFIC POOL BY INDEX
  getShape = (poolId: string, index: number): ShapeInterface => {
    /* VERIFY IF THE POOL OF SHAPES IS EMPTY, 
      IF IT'S CALL FUNCTION TO ADD MORE SHAPES TO IT
    */
    if (index > shapesPools[poolId].length) this.addMoreShapeToPool(poolId);

    // GET THE SHAPE BY INDEX
    return JSON.parse(JSON.stringify(shapesPools[poolId][index]));
  };

  // GET SHAPES POOL BY POOL ID
  getShapesPool = (poolId: string): Array<Array<ShapeInterface>> | null => {
    // SHAPES POOL IF NOT EXIST RETURN NULL
    if (!shapesPools[poolId]) return null;

    // IN CASE SHAPES POOL EXIST RETURN ITS CONTENT
    return JSON.parse(JSON.stringify(shapesPools[poolId]));
  };
}

export default ShapesFactory;

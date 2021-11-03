// interface Pieces = Array<
// {name: string, shape: Array<Array<number>>, startPos: {row: number, col: number}}
// >

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

class ShapesFactory {
  constructor(poolId: string) {
    this.generateShapesPool(poolId);
  }

  generateShapesPool(poolId: string) {
    if (!shapesPools[poolId]) {
      shapesPools[poolId] = [];
      const keys = Object.keys(shapes);
      // console.log({ keys });
      for (let index = 0; index < 100; index++) {
        const shape = shapes[keys[(keys.length * Math.random()) << 0]];
        console.log({ shape });
        shapesPools[poolId].push(shape);
      }
    }
  }

  addMoreShapeToPool(poolId: string) {
    if (shapesPools[poolId]) {
      const keys = Object.keys(shapes);
      for (let index = 0; index < 100; index++) {
        const shape = shapes[keys[(keys.length * Math.random()) << 0]];
        shapesPools[poolId].push(shape);
      }
    }
  }

  dropShapePool(poolId: number) {
    // if (!shapesPools[poolId])
  }

  getShape = (poolId: string, index: number) => {
    // console.log({ poolId });
    // console.log(shapesPools[poolId]);
    if (shapesPools[poolId]) {
      for (let i = 0; i < shapesPools[poolId].length; i++) {
        if (i == index)
          return {
            ...JSON.parse(JSON.stringify(shapesPools[poolId][index])),
          };
      }
      return null;
    }
    return null;
  };
}

export default ShapesFactory;

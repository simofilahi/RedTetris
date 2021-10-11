// interface Pieces = Array<
// {name: string, shape: Array<Array<number>>, startPos: {row: number, col: number}}
// >

const shapes: any = {
  "I-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [{ fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }],
      [{ fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }],
    ]
  },
  "O-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [{ fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }],
      [{ fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }],
    ]
  },
  "T-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [{ fill: 0, color: "", value: "0" }, { fill: 1, color: "", value: "1" }, { fill: 0, color: "", value: "0" }],
      [{ fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }],
    ]
  },
  "S-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [{ fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }, { fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }],
      [{ fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }, { fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }],
    ]
  },
  "Z-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [{ fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }, { fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" },],
      [{ fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }, { fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" },],
    ]
  },
  "J-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [{ fill: 1, color: "", value: "1" }, { fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }],
      [{ fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }, { fill: 0, color: "", value: "1" }],
    ]
  },
  "L-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [{ fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "1" }],
      [{ fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }, { fill: 0, color: "", value: "1" }],
    ]
  },
};

class Shape {
  index: number;
  constructor() {
    this.index = 0;
  }

  getShape = () => {
    var keys = Object.keys(shapes);

    return { ...shapes[keys[keys.length * Math.random() << 0]] };
  };
}

export default Shape;

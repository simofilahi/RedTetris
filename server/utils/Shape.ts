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
      [{ fill: 1, color: "", value: "2" }, { fill: 1, color: "", value: "2" }],
      [{ fill: 1, color: "", value: "2" }, { fill: 1, color: "", value: "2" }],
    ]
  },
  "T-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [{ fill: 0, color: "", value: "0" }, { fill: 1, color: "", value: "3" }, { fill: 0, color: "", value: "0" }],
      [{ fill: 1, color: "", value: "3" }, { fill: 1, color: "", value: "3" }, { fill: 1, color: "", value: "3" }],
    ]
  },
  "S-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [{ fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }, { fill: 1, color: "", value: "4" }, { fill: 1, color: "", value: "4" }],
      [{ fill: 1, color: "", value: "4" }, { fill: 1, color: "", value: "4" }, { fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }],
    ]
  },
  "Z-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [{ fill: 1, color: "", value: "5" }, { fill: 1, color: "", value: "5" }, { fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" },],
      [{ fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }, { fill: 1, color: "", value: "5" }, { fill: 1, color: "", value: "5" },],
    ]
  },
  "J-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [{ fill: 1, color: "", value: "6" }, { fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }],
      [{ fill: 1, color: "", value: "6" }, { fill: 1, color: "", value: "6" }, { fill: 0, color: "", value: "6" }],
    ]
  },
  "L-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [{ fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "7" }],
      [{ fill: 1, color: "", value: "7" }, { fill: 1, color: "", value: "7" }, { fill: 0, color: "", value: "7" }],
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

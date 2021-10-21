// interface Pieces = Array<
// {name: string, shape: Array<Array<number>>, startPos: {row: number, col: number}}
// >

const shapes: any = {
  "I-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [
        { color: "#32C7EF", value: "1" },
        { color: "#32C7EF", value: "1" },
        { color: "#32C7EF", value: "1" },
        { color: "#32C7EF", value: "1" },
      ],
    ],
  },
  "O-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [
        { color: "#F7D20C", value: "2" },
        { color: "#F7D20C", value: "2" },
      ],
      [
        { color: "#F7D20C", value: "2" },
        { color: "#F7D20C", value: "2" },
      ],
    ],
  },
  "T-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [
        { color: "", value: "0" },
        { color: "#AD4D9B", value: "3" },
        { color: "", value: "0" },
      ],
      [
        { color: "#AD4D9B", value: "3" },
        { color: "#AD4D9B", value: "3" },
        { color: "#AD4D9B", value: "3" },
      ],
    ],
  },
  "S-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [
        { color: "", value: "0" },
        { color: "#43B642", value: "4" },
        { color: "#43B642", value: "4" },
      ],
      [
        { color: "#43B642", value: "4" },
        { color: "#43B642", value: "4" },
        { color: "", value: "0" },
      ],
    ],
  },
  "Z-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [
        { color: "#EF1F2A", value: "5" },
        { color: "#EF1F2A", value: "5" },
        { color: "", value: "0" },
      ],
      [
        { color: "", value: "0" },
        { color: "#EF1F2A", value: "5" },
        { color: "#EF1F2A", value: "5" },
      ],
    ],
  },
  "J-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [
        { color: "#5A65AD", value: "6" },
        { color: "", value: "0" },
        { color: "", value: "0" },
      ],
      [
        { color: "#5A65AD", value: "6" },
        { color: "#5A65AD", value: "6" },
        { color: "#5A65AD", value: "6" },
      ],
    ],
  },
  "L-tetromino": {
    cords: { row: 0, col: 5 },
    pieces: [
      [
        { color: "", value: "0" },
        { color: "", value: "0" },
        { color: "#EF7920", value: "7" },
      ],
      [
        { color: "#EF7920", value: "7" },
        { color: "#EF7920", value: "7" },
        { color: "#EF7920", value: "7" },
      ],
    ],
  },
};

class Shape {
  index: number;
  constructor() {
    this.index = 0;
  }

  getShape = () => {
    const keys = Object.keys(shapes);
    const shape = shapes[keys[(keys.length * Math.random()) << 0]];

    shape.pieces.forEach((element: any) => {
      element.forEach((item: any) => {
        item.status = "active";
      });
    });

    return { ...JSON.parse(JSON.stringify(shape)) };
  };
}

export default Shape;

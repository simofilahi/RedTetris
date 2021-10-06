// interface Pieces = Array<
// {name: string, shape: Array<Array<number>>, startPos: {row: number, col: number}}
// >

const shapes: any = {
  "I-tetromino": [
    [
      { fill: 1, color: "#2FC7EF" },
      { fill: 1, color: "#2FC7EF" },
      { fill: 1, color: "#2FC7EF" },
      { fill: 1, color: "#2FC7EF" },
    ],
  ],
  //   { fill: true, color: "#2FC7EF"},
  //   { fill: true, color: "#2FC7EF"},
  //   { fill: true, color: "#2FC7EF"},
  //   { fill: true, color: "#2FC7EF"},
  // ],
  // "O-tetromino": { value: 1, color: "#F7D306" },
  // "T-tetromino": { value: 1, color: "#AD4E9C" },
  // "S-tetromino": { value: 1, color: "#43B642" },
  // "Z-tetromino": { value: 1, color: "#EF1F2A" },
  // "J-tetromino": { value: 1, color: "#5965AD" },
  // "L-tetromino": { value: 1, color: "#EF7921" },
};

class Shape {
  index: number;
  constructor() {
    this.index = 0;
  }

  getShape = () => {
    return shapes["I-tetromino"];
  };
}

export default Shape;

const Pieces = {
  "I-tetromino": [
    { filled: 1, color: "#2FC7EF", x: 3, y: 0 },
    { filled: 1, color: "#2FC7EF", x: 4, y: 0 },
    { filled: 1, color: "#2FC7EF", x: 5, y: 0 },
    { filled: 1, color: "#2FC7EF", x: 6, y: 0 },
  ],
  // "O-tetromino": { value: 1, color: "#F7D306" },
  // "T-tetromino": { value: 1, color: "#AD4E9C" },
  // "S-tetromino": { value: 1, color: "#43B642" },
  // "Z-tetromino": { value: 1, color: "#EF1F2A" },
  // "J-tetromino": { value: 1, color: "#5965AD" },
  // "L-tetromino": { value: 1, color: "#EF7921" },
};

class Piece {
  constructor() {
    this.index = 0;
  }

  getPiece = () => {
    return Piece[this.index];
  };
}

module.exports = Piece;

export interface Square {
  status: string;
  color: string;
  value: string;
}

export interface Cords {
  row: number;
  col: number;
}

export interface ShapeInterface {
  cords: Cords;
  pieces: Array<Array<Square>>;
}

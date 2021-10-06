import Shape from "./Shape";

export interface Square {
  fill: number,
  color: string,
};

class Game extends Shape {
  square: Square = { fill: 0, color: "" };
  map: Array<Array<Square>>;

  constructor() {
    super()
    this.map = this.mapGenerator();
    this.addShapeToMap();
    this.draw();
  }

  * colGeneratore() {
    for (let i: number = 0; i < 10; i++)
      yield this.square;
  }

  * rowGenerator() {
    for (let i: number = 0; i < 10; i++)
      yield [...this.colGeneratore()];
  }

  mapGenerator(): Array<Array<Square>> {
    return [
      ...this.rowGenerator(),
    ];
  };

  addShapeToMap(): void {
    const shape: any = this.getShape();
    for (let mapRow: number = 0; mapRow < this.map.length; mapRow++) {
      for (let shapeRow: number = 0; shapeRow < shape.length; shapeRow++) {
        if (mapRow === shapeRow) {
          for (let mapCol: number = 0; mapCol < this.map[mapRow].length; mapCol++) {
            for (let shapeCol: number = 0; shapeCol < shape[shapeRow].length; shapeCol++) {
              if (shapeCol === mapCol) {
                this.map[shapeRow][shapeCol] = shape[shapeRow][shapeCol];
                break;
              }
            }
          }
          break;
        }
      }
    }
  }

  moveToLeft() { };

  moveToRight() {

  };

  moveDown() { };

  rotate() { };

  draw() {
    this.map.forEach((row, index) => {
      row.forEach((item) => process.stdout.write(item.fill.toString()));
      process.stdout.write("\n");
    });
  };
}

export default Game;
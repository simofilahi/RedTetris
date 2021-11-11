import Game from "../../server/utils/Game";
import { ShapeInterface, Square } from "../../server/utils/interfaces";

let game: Game;
let gameMap: Array<Array<Square>> = [[]];
const colors = [
  "#32C7EF",
  "#F7D20C",
  "#AD4D9B",
  "#43B642",
  "#EF1F2A",
  "#5A65AD",
  "#EF7920",
  "",
];
const values = ["0", "1", "2", "3", "4", "5", "6", "7", ".", "#"];
const statuses = ["active", "landed", ""];

describe("Game class tests", () => {
  beforeAll(() => {
    game = new Game("poolId");
    gameMap = game.mapGenerator();
  });

  it("should generate a column", () => {
    const row = [...game.colGenerator()];

    expect(row).toBeDefined();
    expect(row).toBeInstanceOf(Array);
    expect(row).toHaveLength(10);
  });

  it("Should generate a column with correct objects", () => {
    const row = [...game.colGenerator()];

    row.forEach((square) => {
      expect(square).toMatchObject<Square>({
        status: "",
        color: "",
        value: ".",
      });
    });
  });

  it("should generate a row", () => {
    const row: Array<Square> = [...game.rowGenerator()];

    expect(row).toBeDefined();
    expect(row).toBeInstanceOf(Array);
    expect(row).toHaveLength(20);
  });

  it("Should generate a column with correct objects", () => {
    const map_: Array<Array<Square>> = [...game.rowGenerator()];

    map_.forEach((row: Array<Square>) => {
      expect(row).toBeInstanceOf(Array);
      row.forEach((col: Square) => {
        expect(col).toMatchObject<Square>({
          status: "",
          color: "",
          value: ".",
        });
      });
    });
  });

  it("Should generate a map with correct data", () => {
    const map_: Array<Array<Square>> = game.mapGenerator();

    map_.forEach((row: Array<Square>) => {
      expect(row).toBeInstanceOf(Array);
      row.forEach((col: Square) => {
        expect(col).toMatchObject<Square>({
          status: "",
          color: "",
          value: ".",
        });
      });
    });
  });

  it("Should get the map object from game instance", () => {
    const map_ = game.getMap();

    expect(map_).toBeDefined();
    expect(map_).toBeInstanceOf(Array);
    expect(map_).toHaveLength(20);

    map_.forEach((row: Array<Square>) => {
      expect(row).toBeInstanceOf(Array);
      row.forEach((col: Square) => {
        expect(col).toMatchObject<Square>({
          status: statuses.includes(col.status) ? col.status : "",
          color: colors.includes(col.color) ? col.color : "",
          value: values.includes(col.value) ? col.value : "",
        });
      });
    });
  });

  it("Should add one row at the bottom of an already existing map", () => {
    game.addRows(1);

    const map_ = game.getMap();
    expect(map_).toBeDefined();
    map_[map_.length - 1].forEach((element: Square) => {
      expect(element.value).toEqual("#");
      expect(element.status).toEqual("landed");
    });
  });

  it("Should add only one row at the bottom of an already existing map", () => {
    const map_ = game.getMap();
    expect(map_).toBeDefined();
    map_[map_.length - 2].forEach((element: Square) => {
      expect(element.value !== "#").toBeTruthy();
    });
  });
});

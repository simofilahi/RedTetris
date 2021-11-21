const Game = require("../utils/Game");
import { Square, GameInt } from "../utils/interfaces";
const { ShapesFactory } = require("../utils/shapesFactory");
const mongoose = require("mongoose");

let game: GameInt;
let POOL_ID: string = "";

export const colors = [
  "#32C7EF",
  "#F7D20C",
  "#AD4D9B",
  "#43B642",
  "#EF1F2A",
  "#5A65AD",
  "#EF7920",
  "",
];

export const values = ["0", "1", "2", "3", "4", "5", "6", "7", ".", "#"];
export const statuses = ["active", "landed", ""];

describe("Game class tests", () => {
  beforeEach(() => {
    POOL_ID = new mongoose.Types.ObjectId().toString();
    game = new Game(POOL_ID);
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

  it("Should add a shape to the map", () => {
    const oldMap = game.getMap();
    game.instantDrop();
    const updatedMap = game.getMap();
    expect(updatedMap).not.toBe(oldMap);
  });

  it("Should get the next shape from Shapes pool", () => {
    const shapesPool = new ShapesFactory().getShapesPool(POOL_ID);

    const shape = game.getNextShape();
    expect(shape).toBeDefined();
    expect(shape).toStrictEqual(shapesPool![1]);
  });

  it("Should clear the map from non-landed shapes", () => {
    const oldMap = game.getMap();
    game.clear();
    const updatedMap = game.getMap();
    expect(updatedMap).not.toBe(oldMap);
  });

  it("Should test if a shape was set to landed", () => {
    const map_ = game.getMap();
    game.instantDrop();
    game.clear();
    const updatedMap = game.getMap();
    expect(
      (() => {
        const row = updatedMap[updatedMap.length - 1];
        for (let i = 0; i < row.length; i++) {
          if (row[i].status === "landed") return true;
        }
        return false;
      })()
    ).toEqual(true);
    expect(map_).not.toBe(updatedMap);
  });

  it("Should test if no landed shapes exist in game start", () => {
    const map_ = game.getMap();
    expect(
      (() => {
        const row = map_[map_.length - 1];
        for (let i = 0; i < row.length; i++) {
          if (row[i].status === "landed") return true;
        }
        return false;
      })()
    ).toEqual(false);
  });

  it("Should move a shape down", () => {
    const map_ = game.getMap();
    game.moveDown();
    const updatedMap = game.getMap();
    expect(updatedMap).not.toBe(map_);
  });

  it("Should move a shape to the left", () => {
    const map_ = game.getMap();
    game.moveToLeft();
    const updatedMap = game.getMap();
    expect(updatedMap).not.toBe(map_);
  });

  it("Should move a shape to the right", () => {
    const map_ = game.getMap();
    game.moveToRight();
    const updatedMap = game.getMap();
    expect(updatedMap).not.toBe(map_);
  });

  it("Should rotate a shape", () => {
    const map_ = game.getMap();
    game.rotate();
    const updatedMap = game.getMap();
    expect(updatedMap).not.toBe(map_);
  });

  it("Should return false if shape is null", () => {
    game.shape = null;
    expect((() => game.rotate())()).toBeNull();
  });

  it("Should update the land spectrum", () => {
    const spectrum1 = game.getlandSpectrum();
    game.instantDrop();
    const spectrum2 = game.getlandSpectrum();
    expect(spectrum1).not.toBe(spectrum2);
  });

  it("Should not update spectrum if shape did not land", () => {
    const spectrum1 = game.getlandSpectrum();
    game.moveDown();
    const spectrum2 = game.getlandSpectrum();
    expect(spectrum1).toEqual(spectrum2);
  });

  it("Should return true if game is over", () => {
    for (let i = 0; i < 20; i++) {
      game.instantDrop();
    }
    expect(game.gameOver).toEqual(true);
  });

  it("Should return false if game is not over", () => {
    game.instantDrop();
    expect(game.gameOver).toEqual(false);
  });

  it("Should return the land spectrum", () => {
    const landSpectrum = game.getlandSpectrum();

    expect(landSpectrum).toBeDefined();
    expect(landSpectrum).toBeInstanceOf(Array);
    expect(landSpectrum).toHaveLength(20);

    landSpectrum.forEach((row: Array<Square>) => {
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

  it("Should get player score", () => {
    const score = game.getScore();

    expect(score).toBeDefined();
    expect(typeof score).toEqual("number");
    expect(score).toEqual(0);
  });

  it("Should get dropped rows count", () => {
    const droppedRows = game.getDroppedRowsCount();

    expect(droppedRows).toBeDefined();
    expect(typeof droppedRows).toEqual("number");
    expect(droppedRows).toEqual(0);
  });

  it("Should drop winning rows", () => {
    let map1 = game.getMap();
    game.clear();
    map1 = game.getMap();

    const lastRow = map1[map1.length - 1];
    lastRow.forEach((element: Square) => {
      element.status = "landed";
      element.value = "1";
    });
    map1[map1.length - 1] = lastRow;

    const game2 = new Game("pool2");
    game2.clear();
    const map2 = game2.getMap();
    expect(map1).not.toEqual(map2);
    game.map = map1;
    game.dropRows();
    map1 = game.getMap();
    expect(map1).toEqual(map2);
  });
});

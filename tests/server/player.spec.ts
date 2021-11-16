import Player from "../../server/src/utils/Player";

const mongoose = require("mongoose");

describe("Tests player class", () => {
  const POOL_ID = new mongoose.Types.ObjectId().toString();
  let player: Player = new Player(POOL_ID);

  it("All rquired properties should be defined", () => {
    expect(player.shapesPoolId).toBeDefined();
    expect(player.shapeIndex).toBeDefined();
    expect(player.colCount).toBeDefined();
    expect(player.rowCount).toBeDefined();
    expect(player.map).toBeDefined();
    expect(player.shape).toBeDefined();
    expect(player.nextShape).toBeDefined();
    expect(player.gravityInterval).toBeDefined();
    expect(player.gameOver).toBeDefined();
    expect(player.score).toBeDefined();
    expect(player.removedLinesCount).toBeDefined();
    expect(player.droppedRowsCount).toBeDefined();
  });
});

const { Player } = require("../utils/Player");
const mongo = require("mongoose");

describe("Tests player class", () => {
  const POOL_ID = new mongo.Types.ObjectId().toString();
  let player = new Player(POOL_ID);

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

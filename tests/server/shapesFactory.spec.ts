import { Mongoose } from "mongoose";
// import connect from "../../server/config/connection";
import ShapesFactory from "../../server/utils/shapesFactory";

describe("Shapes Factory tests", () => {
  let shapesFactory: ShapesFactory;
  let poolId: string;

  beforeAll(async () => {
    poolId = new Mongoose().SchemaTypes.ObjectId.toString();
    shapesFactory = new ShapesFactory(poolId);
  });

  it("Checks if the shapes pool is created", () => {
    const pool = shapesFactory.getShapesPool(poolId);

    expect(pool).toBeDefined();
    expect(pool).not.toBeNull();
    expect(pool).toBeInstanceOf(Array);
    expect(pool).toHaveLength(100);
  });

  it("Checks if multiple pools are created", () => {
    const pool1 = shapesFactory.getShapesPool(poolId);
    const pool2 = shapesFactory.getShapesPool(poolId);

    expect(pool1).toBeDefined();
    expect(pool1).not.toBeNull();
    expect(pool1).toBeInstanceOf(Array);
    expect(pool1).toHaveLength(100);

    expect(pool2).toBeDefined();
    expect(pool2).not.toBeNull();
    expect(pool2).toBeInstanceOf(Array);
    expect(pool2).toHaveLength(100);
  });

  it("Checks if more shapes can be added to the pool", () => {
    shapesFactory.addMoreShapeToPool(poolId);
    const pool = shapesFactory.getShapesPool(poolId);

    expect(pool).toBeDefined();
    expect(pool).not.toBeNull();
    expect(pool).toBeInstanceOf(Array);
    expect(pool).toHaveLength(200);
  });
});

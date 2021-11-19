import { shapeFactoryInt } from "../utils/interfaces";
const { shapesPools, ShapesFactory } = require("../utils/shapesFactory");
const mongoose = require("mongoose");

describe("Shapes Factory tests", () => {
  let shapesFactory: shapeFactoryInt;
  let poolId: string;
  let inexistantPoolId: string;

  beforeAll(async () => {
    poolId = new mongoose.Types.ObjectId().toString();
    inexistantPoolId = new mongoose.Types.ObjectId().toString();

    shapesFactory = new ShapesFactory(poolId);
  });

  it("Checks if the shapes pool is created", () => {
    const pool = shapesFactory.getShapesPool(poolId);

    expect(pool).toBeDefined();
    expect(pool).not.toBeNull();
    expect(pool).toBeInstanceOf(Array);
    expect(pool).toHaveLength(100);
  });

  it("Checks if inexistant pools are not returned", () => {
    const pool = shapesFactory.getShapesPool(inexistantPoolId);

    expect(pool).toBeNull();
  });

  it("checks if the shapes pool do not get duplicated", () => {
    const pool = shapesFactory.generateShapesPool(poolId);

    expect(pool).toBeNull();
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

  it("Checks if more shapes cannot be added to an inexistant pool", () => {
    const ret = shapesFactory.addMoreShapeToPool(inexistantPoolId);

    expect(ret).toBeNull();
  });

  it("Checks if we can get a shape from the pool", () => {
    const shape = shapesFactory.getShape(poolId, 0);

    expect(shape).toBeDefined();
    expect(shape).not.toBeNull();
  });

  it("Checks if we can get a shape from the pool", () => {
    const shape = shapesFactory.getShape(poolId, 101);

    expect(shape).toBeDefined();
    expect(shape).not.toBeNull();
  });

  it("Checks if we cannot get a shape from an inexistant pool", () => {
    const shape = shapesFactory.getShape(inexistantPoolId, 0);

    expect(shape).toBeNull();
  });

  it("Checks if shape pool can be dropped", () => {
    shapesFactory.dropShapePool(poolId);

    expect(shapesPools).toBeDefined();
    expect(shapesPools[poolId]).toBeUndefined();
  });

  it("Checks if inexistant shape pool can't be dropped", () => {
    shapesFactory.dropShapePool(inexistantPoolId);

    expect(shapesPools).toBeDefined();
    expect(shapesPools[inexistantPoolId]).toBeUndefined();
  });
});

const Game = require("./Game");

exports.Player = class Player extends Game {
  constructor(shapesPoolId: string) {
    super(shapesPoolId);
  }
};

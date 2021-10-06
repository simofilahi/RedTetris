const keypress = require("keypress");
const color = require("color");
const Player = require("./utils/Player.JS");

const player = new Player();

keypress(process.stdin);

process.stdin.on("keypress", function (ch, key) {
  player.keyPressEvent(key.name);
  if (key && key.ctrl && key.name == "c") {
    process.stdin.pause();
  }
});

process.stdin.setRawMode(true);
process.stdin.resume();

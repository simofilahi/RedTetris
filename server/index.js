"use strict";
exports.__esModule = true;
var keypress = require("keypress");
var color = require("color");
// const Player = require("./utils/Player");
var Player_1 = require("./utils/Player");
var player = new Player_1["default"]();
keypress(process.stdin);
process.stdin.on("keypress", function (ch, key) {
    player.keyPressEvent(key.name);
    if (key && key.ctrl && key.name == "c") {
        process.stdin.pause();
    }
});
process.stdin.setRawMode(true);
process.stdin.resume();

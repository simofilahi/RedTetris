var keypress = require("keypress");
var color = require("color");
var Player = require("./utils/Player.JS");
var player = new Player();
keypress(process.stdin);
process.stdin.on("keypress", function (ch, key) {
    player.keyPressEvent(key.name);
    if (key && key.ctrl && key.name == "c") {
        process.stdin.pause();
    }
});
process.stdin.setRawMode(true);
process.stdin.resume();

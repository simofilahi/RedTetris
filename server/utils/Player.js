"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Game_1 = require("./Game");
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        return _super.call(this) || this;
    }
    Player.prototype.keyPressEvent = function (key) {
        if (key === "left")
            this.moveToLeft();
        else if (key === "right")
            this.moveToRight();
        else if (key === "down")
            this.moveDown();
        else if (key === "space")
            this.rotate();
        else if (key === "a")
            this.addShapeToMap();
    };
    return Player;
}(Game_1["default"]));
module.exports = Player;

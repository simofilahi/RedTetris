"use strict";
// interface Pieces = Array<
// {name: string, shape: Array<Array<number>>, startPos: {row: number, col: number}}
// >
exports.__esModule = true;
var shapes = {
    "I-tetromino": [
        [
            { fill: 1, color: "#2FC7EF" },
            { fill: 1, color: "#2FC7EF" },
            { fill: 1, color: "#2FC7EF" },
            { fill: 1, color: "#2FC7EF" },
        ],
    ]
};
var Shape = /** @class */ (function () {
    function Shape() {
        this.getShape = function () {
            return shapes["I-tetromino"];
        };
        this.index = 0;
    }
    return Shape;
}());
exports["default"] = Shape;

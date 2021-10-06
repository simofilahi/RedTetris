"use strict";
// interface Pieces = Array<
// {name: string, shape: Array<Array<number>>, startPos: {row: number, col: number}}
// >
exports.__esModule = true;
var shapes = {
    "I-tetromino": [
        [
            { fill: 1, color: "#2FC7EF", row: 0, col: 3 },
            { fill: 1, color: "#2FC7EF", row: 0, col: 4 },
            { fill: 1, color: "#2FC7EF", row: 0, col: 5 },
            { fill: 1, color: "#2FC7EF", row: 0, col: 6 },
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

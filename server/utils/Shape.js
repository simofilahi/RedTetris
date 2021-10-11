"use strict";
// interface Pieces = Array<
// {name: string, shape: Array<Array<number>>, startPos: {row: number, col: number}}
// >
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var shapes = {
    "I-tetromino": {
        cords: { row: 0, col: 5 },
        pieces: [
            [{ fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }],
            [{ fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }],
        ]
    },
    "O-tetromino": {
        cords: { row: 0, col: 5 },
        pieces: [
            [{ fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }],
            [{ fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }],
        ]
    },
    "T-tetromino": {
        cords: { row: 0, col: 5 },
        pieces: [
            [{ fill: 0, color: "", value: "0" }, { fill: 1, color: "", value: "1" }, { fill: 0, color: "", value: "0" }],
            [{ fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }],
        ]
    },
    "S-tetromino": {
        cords: { row: 0, col: 5 },
        pieces: [
            [{ fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }, { fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }],
            [{ fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }, { fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }],
        ]
    },
    "Z-tetromino": {
        cords: { row: 0, col: 5 },
        pieces: [
            [{ fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }, { fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" },],
            [{ fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }, { fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" },],
        ]
    },
    "J-tetromino": {
        cords: { row: 0, col: 5 },
        pieces: [
            [{ fill: 1, color: "", value: "1" }, { fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }],
            [{ fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }, { fill: 0, color: "", value: "1" }],
        ]
    },
    "L-tetromino": {
        cords: { row: 0, col: 5 },
        pieces: [
            [{ fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "0" }, { fill: 0, color: "", value: "1" }],
            [{ fill: 1, color: "", value: "1" }, { fill: 1, color: "", value: "1" }, { fill: 0, color: "", value: "1" }],
        ]
    }
};
var Shape = /** @class */ (function () {
    function Shape() {
        this.getShape = function () {
            var keys = Object.keys(shapes);
            return __assign({}, shapes[keys[keys.length * Math.random() << 0]]);
        };
        this.index = 0;
    }
    return Shape;
}());
exports["default"] = Shape;

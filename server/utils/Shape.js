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
    // "I-tetromino": {
    //   cords: { row: 0, col: 5 },
    //   pieces: [
    //     [
    //       { color: "", value: "1" },
    //       { color: "", value: "1" },
    //       { color: "", value: "1" },
    //       { color: "", value: "1" },
    //     ],
    //   ],
    // },
    // "O-tetromino": {
    //   cords: { row: 0, col: 5 },
    //   pieces: [
    //     [
    //       { color: "", value: "2" },
    //       { color: "", value: "2" },
    //     ],
    //     [
    //       { color: "", value: "2" },
    //       { color: "", value: "2" },
    //     ],
    //   ],
    // },
    "T-tetromino": {
        cords: { row: 0, col: 5 },
        pieces: [
            [
                { color: "", value: "0" },
                { color: "", value: "3" },
                { color: "", value: "0" },
            ],
            [
                { color: "", value: "3" },
                { color: "", value: "3" },
                { color: "", value: "3" },
            ],
        ]
    },
    // "S-tetromino": {
    //   cords: { row: 0, col: 5 },
    //   pieces: [
    //     [
    //       { color: "", value: "0" },
    //       { color: "", value: "0" },
    //       { state: 1, color: "", value: "4" },
    //       { state: 1, color: "", value: "4" },
    //     ],
    //     [
    //       { color: "", value: "4" },
    //       { color: "", value: "4" },
    //       { color: "", value: "0" },
    //       { color: "", value: "0" },
    //     ],
    //   ],
    // },
    // "Z-tetromino": {
    //   cords: { row: 0, col: 5 },
    //   pieces: [
    //     [
    //       { color: "", value: "5" },
    //       { color: "", value: "5" },
    //       { color: "", value: "0" },
    //       { color: "", value: "0" },
    //     ],
    //     [
    //       { color: "", value: "0" },
    //       { color: "", value: "0" },
    //       { color: "", value: "5" },
    //       { color: "", value: "5" },
    //     ],
    //   ],
    // },
    // "J-tetromino": {
    //   cords: { row: 0, col: 5 },
    //   pieces: [
    //     [
    //       { color: "", value: "6" },
    //       { color: "", value: "0" },
    //       { color: "", value: "0" },
    //     ],
    //     [
    //       { color: "", value: "6" },
    //       { color: "", value: "6" },
    //       { color: "", value: "6" },
    //     ],
    //   ],
    // },
    "L-tetromino": {
        cords: { row: 0, col: 5 },
        pieces: [
            [
                { color: "", value: "0" },
                { color: "", value: "0" },
                { color: "", value: "7" },
            ],
            [
                { color: "", value: "7" },
                { color: "", value: "7" },
                { color: "", value: "7" },
            ],
        ]
    }
};
var Shape = /** @class */ (function () {
    function Shape() {
        this.getShape = function () {
            var keys = Object.keys(shapes);
            var shape = shapes[keys[(keys.length * Math.random()) << 0]];
            shape.pieces.forEach(function (element) {
                element.forEach(function (item) {
                    item.status = "active";
                });
            });
            return __assign({}, JSON.parse(JSON.stringify(shape)));
        };
        this.index = 0;
    }
    return Shape;
}());
exports["default"] = Shape;

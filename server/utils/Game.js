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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var Shape_1 = require("./Shape");
;
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this) || this;
        _this.square = { fill: 0, color: "" };
        _this.map = _this.mapGenerator();
        _this.addShapeToMap();
        return _this;
    }
    Game.prototype.colGeneratore = function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 10)) return [3 /*break*/, 4];
                    return [4 /*yield*/, this.square];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    };
    Game.prototype.rowGenerator = function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < 10)) return [3 /*break*/, 4];
                    return [4 /*yield*/, __spreadArray([], __read(this.colGeneratore()), false)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    };
    Game.prototype.mapGenerator = function () {
        return __spreadArray([], __read(this.rowGenerator()), false);
    };
    ;
    Game.prototype.updateMap = function () {
        this.clear();
        for (var shapeRow = 0; shapeRow < this.shape.length; shapeRow++) {
            for (var shapeCol = 0; shapeCol < this.shape[shapeRow].length; shapeCol++) {
                this.map[this.shape[shapeRow][shapeCol].row][this.shape[shapeRow][shapeCol].col] = __assign({}, this.shape[shapeRow][shapeCol]);
            }
        }
        this.draw();
    };
    Game.prototype.verticalChecker = function () {
        for (var shapeRow = 0; shapeRow < this.shape.length; shapeRow++) {
            for (var shapeCol = 0; shapeCol < this.shape[shapeRow].length; shapeCol++) {
                if (this.shape[shapeRow][shapeCol].row + 1 > 9)
                    return true;
            }
        }
        return false;
    };
    Game.prototype.horizantalChecker = function () {
        for (var shapeRow = 0; shapeRow < this.shape.length; shapeRow++) {
            for (var shapeCol = 0; shapeCol < this.shape[shapeRow].length; shapeCol++) {
                if (this.shape[shapeRow][shapeCol].col + 1 > 9 || this.shape[shapeRow][shapeCol].col + 1 < 0)
                    return true;
            }
        }
        return false;
    };
    Game.prototype.addShapeToMap = function () {
        this.shape = this.getShape();
        this.updateMap();
    };
    Game.prototype.clear = function () {
        for (var mapRow = 0; mapRow < this.map.length; mapRow++) {
            for (var mapCol = 0; mapCol < this.map[mapRow].length; mapCol++) {
                this.map[mapRow][mapCol].fill = 0;
                this.map[mapRow][mapCol].color = "";
            }
        }
    };
    Game.prototype.moveToLeft = function () {
        if (!this.horizantalChecker()) {
            for (var shapeRow = 0; shapeRow < this.shape.length; shapeRow++) {
                for (var shapeCol = 0; shapeCol < this.shape[shapeRow].length; shapeCol++) {
                    this.shape[shapeRow][shapeCol].col--;
                }
            }
            this.updateMap();
        }
    };
    ;
    Game.prototype.moveToRight = function () {
        if (!this.horizantalChecker()) {
            for (var shapeRow = 0; shapeRow < this.shape.length; shapeRow++) {
                for (var shapeCol = 0; shapeCol < this.shape[shapeRow].length; shapeCol++) {
                    this.shape[shapeRow][shapeCol].col++;
                }
            }
            this.updateMap();
        }
    };
    ;
    Game.prototype.moveDown = function () {
        if (!this.verticalChecker()) {
            for (var shapeRow = 0; shapeRow < this.shape.length; shapeRow++) {
                for (var shapeCol = 0; shapeCol < this.shape[shapeRow].length; shapeCol++) {
                    this.shape[shapeRow][shapeCol].row++;
                }
            }
            this.updateMap();
        }
    };
    ;
    Game.prototype.rotate = function () { };
    ;
    Game.prototype.draw = function () {
        console.clear();
        this.map.forEach(function (row) {
            row.forEach(function (item) { return process.stdout.write(item.fill.toString()); });
            process.stdout.write("\n");
        });
    };
    ;
    return Game;
}(Shape_1["default"]));
exports["default"] = Game;

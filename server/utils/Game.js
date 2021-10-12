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
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this) || this;
        _this.square = { status: "", color: "", value: "." };
        _this.map = _this.mapGenerator();
        _this.addShapeToMap();
        _this.colCount = 10;
        _this.rowCount = 10;
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
    // ADD SHAPE TO MAP
    Game.prototype.updateMap = function () {
        this.clear();
        for (var shapeRow = 0; shapeRow < this.shape.pieces.length; shapeRow++) {
            for (var shapeCol = 0; shapeCol < this.shape.pieces[shapeRow].length; shapeCol++) {
                var row = shapeRow + this.shape.cords.row;
                var col = shapeCol + this.shape.cords.col;
                try {
                    if (this.map[row][col].value != "0" ||
                        this.map[row][col].value != ".")
                        this.map[row][col] = __assign({}, JSON.parse(JSON.stringify(this.shape.pieces[shapeRow][shapeCol])));
                }
                catch (_a) {
                    return;
                }
            }
        }
        this.draw();
    };
    // GOT RANDOM SHAPE AND ADD IT INTO MAP
    Game.prototype.addShapeToMap = function () {
        this.shape = __assign({}, JSON.parse(JSON.stringify(this.getShape())));
        this.updateMap();
    };
    // CLEAR THE MAP EXPECEPT FOR LANDED SHAPES
    Game.prototype.clear = function () {
        for (var mapRow = 0; mapRow < this.map.length; mapRow++) {
            for (var mapCol = 0; mapCol < this.map[mapRow].length; mapCol++) {
                if (this.map[mapRow][mapCol]["status"] === "active") {
                    this.map[mapRow][mapCol].status = "";
                    this.map[mapRow][mapCol].color = "";
                    this.map[mapRow][mapCol].value = ".";
                }
            }
        }
    };
    // SET LANDED VARIABLE TO TRUE OF A SHAPE
    Game.prototype.setShapeLanded = function () {
        for (var mapRow = 0; mapRow < this.map.length; mapRow++) {
            for (var mapCol = 0; mapCol < this.map[mapRow].length; mapCol++) {
                if (this.map[mapRow][mapCol].value !== ".") {
                    console.log("LANDED FUNCTIONS");
                    this.map[mapRow][mapCol]["status"] = "landed";
                }
            }
        }
    };
    // DRAW MAP
    Game.prototype.draw = function () {
        console.log("--------------------------------");
        console.log("");
        this.map.forEach(function (row) {
            row.forEach(function (item) {
                process.stdout.write(item.value);
            });
            process.stdout.write("\n");
        });
        console.log("");
        console.log("--------------------------------");
    };
    // MOVE SHAPE DOWN
    Game.prototype.moveDown = function () {
        /* IF THERE NO COLLISOIN OR NOT THE END OF MAP
           KEEP INCREMENT ROW AND MOVE SHAPE DOWN
           ELSE SET THE ACTIVE SHAPE AS LANDED AND ADD NEW
           SHAPE TO THE MAP
        */
        if (!this.neighborShapesCollision("down")) {
            this.shape.cords.row++;
            this.updateMap();
        }
        else {
            this.setShapeLanded();
            this.addShapeToMap();
        }
    };
    // MOVE SHAPE TO THE LEFT
    Game.prototype.moveToLeft = function () {
        if (!this.neighborShapesCollision("left")) {
            this.shape.cords.col--;
            this.updateMap();
        }
        else {
            this.draw();
        }
    };
    // MOVE SHAPE TO THE RIGHT
    Game.prototype.moveToRight = function () {
        if (!this.neighborShapesCollision("right")) {
            this.shape.cords.col++;
            this.updateMap();
        }
        else {
            this.draw();
        }
    };
    // VERIFY TOP SIDE COLLISSION OF A SHAPE
    Game.prototype.topCollission = function (neighborPostion, currPosition, rowIndex) {
        // VERIFY THE TOP POINT IS EMPTY OR THE END OF MAP ROWS
        if ((neighborPostion &&
            neighborPostion["status"] === "landed" &&
            neighborPostion["value"] != "0" &&
            currPosition["value"] != "0") ||
            rowIndex <= 0)
            return true;
        return false;
    };
    // VERIFY RIGHT SIDE COLLISSION OF A SHAPE
    Game.prototype.rightCollission = function (neighborPostion, currPosition, colIndex) {
        // VERIFY RIGHT POINT IS EMPTY OR THE END OF MAP COLUMNS;
        console.log({ colIndex: colIndex });
        console.log({ colCount: this.colCount });
        if ((neighborPostion &&
            (neighborPostion === null || neighborPostion === void 0 ? void 0 : neighborPostion.status) === "landed" &&
            neighborPostion.value != "0" &&
            currPosition.value != "0") ||
            colIndex >= this.colCount)
            return true;
        return false;
    };
    // VERIFY LEFT SIDE COLLISSION OF A SHAPE
    Game.prototype.leftCollission = function (neighborPostion, currPosition, colIndex) {
        // VERIFY THE LEFT POINT IS EMPTY OR THE END OF MAP COLUMNS
        if (((neighborPostion === null || neighborPostion === void 0 ? void 0 : neighborPostion.status) === "landed" &&
            neighborPostion.value != "0" &&
            currPosition.value != "0") ||
            colIndex < 0)
            return true;
        return false;
    };
    // VERIFY BOTTOM SIDE COLLISSION OF A SHAPE
    Game.prototype.bottomCollission = function (neighborPostion, currPosition, rowIndex) {
        // VERIFY THE BOTTOM POINT IS EMPTY OR THE END OF MAP ROWS
        console.log("bottom Collission function");
        console.log({ rowIndex: rowIndex });
        console.log({ rowCount: this.rowCount });
        if (((neighborPostion === null || neighborPostion === void 0 ? void 0 : neighborPostion.status) === "landed" &&
            neighborPostion.value != "0" &&
            currPosition.value != "0") ||
            rowIndex >= this.rowCount)
            return true;
        return false;
    };
    Game.prototype.rotationCollisionCheck = function (mapRow, mapCol) {
        console.log("Rotation =====> ");
        if (this.rightCollission(this.map[mapRow][mapCol + 1], this.map[mapRow][mapCol], mapCol + 1)) {
            console.log("right Collission");
            return true;
        }
        else if (this.leftCollission(this.map[mapRow][mapCol - 1], this.map[mapRow][mapCol], mapCol - 1)) {
            console.log("left Collission");
            return true;
        }
        else if (this.bottomCollission(this.map[mapRow === this.rowCount - 1 ? mapRow : mapRow + 1][mapCol], this.map[mapRow][mapCol], mapRow + 1)) {
            console.log("down collission");
            return true;
        }
        else if (this.topCollission(this.map[mapRow === 0 ? mapRow : mapRow - 1][mapCol], this.map[mapRow][mapCol], mapRow - 1)) {
            console.log("down collission");
            return true;
        }
        else if (this.bottomCollission(this.map[mapRow === this.rowCount - 1 ? mapRow : mapRow + 1][mapCol], this.map[mapRow][mapCol], mapRow + 1)) {
            console.log("down collission");
            return true;
        }
        return false;
    };
    Game.prototype.neighborShapesCollision = function (sign) {
        // ITERRATE TROUGH THE MAP AND LOOK FOR ACTIVE SHAPE THEN START CHECKING FOR NEIGHBOR COLLESION
        for (var mapRow = 0; mapRow < this.map.length; mapRow++) {
            for (var mapCol = 0; mapCol < this.map[mapRow].length; mapCol++) {
                // console.log(sign, this.map[mapRow][mapCol]);
                // DO NEIGHBOR COLLISON VERIFICATION JUST FOR CURRENT SHAPE IN OUR CASE MEAN ACTIVE SHAPE
                if (this.map[mapRow][mapCol]["status"] === "active" && sign) {
                    console.log("**************");
                    console.log({ mapRow: mapRow });
                    console.log("**************");
                    // SIGN JUST USED IN CASE LEFT OR RIGHT ARROW PRESSED
                    if (sign === "right" &&
                        this.rightCollission(this.map[mapRow][mapCol + 1], this.map[mapRow][mapCol], mapCol + 1)) {
                        console.log("right Collission");
                        return true;
                    }
                    else if (sign === "left" &&
                        this.leftCollission(this.map[mapRow][mapCol - 1], this.map[mapRow][mapCol], mapCol - 1)) {
                        console.log("left Collission");
                        return true;
                    }
                    else if (this.bottomCollission(this.map[mapRow === this.rowCount - 1 ? mapRow : mapRow + 1][mapCol], this.map[mapRow][mapCol], mapRow + 1)) {
                        console.log("down Collission");
                        return true;
                    }
                }
                else if (this.map[mapRow][mapCol]["status"] === "active") {
                    if (this.rotationCollisionCheck(mapRow, mapCol))
                        return true;
                }
            }
        }
        return false;
    };
    // DO ROTATION 90 DEGREE TO ACTIVE SHAPE
    Game.prototype.rotate = function () {
        var matrix = [];
        for (var shapeRow = 0; shapeRow < this.shape.pieces.length; shapeRow++) {
            for (var shapeCol = 0; shapeCol < this.shape.pieces[shapeRow].length; shapeCol++) {
                if (!matrix[shapeCol])
                    matrix[shapeCol] = [];
                matrix[shapeCol].unshift(this.shape.pieces[shapeRow][shapeCol]);
            }
        }
        this.shape.pieces = matrix;
        if (this.neighborShapesCollision(undefined)) {
            this.updateMap();
            this.rotate();
        }
        this.updateMap();
    };
    return Game;
}(Shape_1["default"]));
exports["default"] = Game;

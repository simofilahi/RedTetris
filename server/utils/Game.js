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
    // DROP FULL LINES
    Game.prototype.dropLines = function () {
        var _a;
        // INITIALZE NEW MAP
        var newMap = [];
        // COUNTER TO KNOW IF A ROW FULL
        var count = 0;
        // LOOP TROUGH THE WHOLE MAP
        for (var mapRow = 0; mapRow < this.map.length; mapRow++) {
            for (var mapCol = 0; mapCol < this.map[mapRow].length; mapCol++) {
                // VERIFY FOR VALUES THAT HAS NO NUMBER THEY MEAN LIKE EMPTY
                if (this.map[mapRow][mapCol].value !== "0" &&
                    this.map[mapRow][mapCol].value !== "." &&
                    ((_a = this.map[mapRow][mapCol]) === null || _a === void 0 ? void 0 : _a.status) === "landed") {
                    // INCREMENT COUNTER  TO KNOW IF ROW IS FULL
                    count++;
                }
            }
            // VERIFY IF ROW NOT FULL PUSH IT TO NEW MAP
            if (count < 9)
                newMap.push(this.map[mapRow]);
            // RESET COUNT
            count = 0;
        }
        // CALCULATE THE NUMBER OF ROWS NEEDED
        var len = this.rowCount - newMap.length;
        // ADD NEEDED ROWS TO NEW MAP
        for (; len > 0; len--)
            newMap.unshift(__spreadArray([], __read(this.colGeneratore()), false));
        // COPY NEW MAP INTO PRIMARY MAP
        this.map = __spreadArray([], __read(JSON.parse(JSON.stringify(newMap))), false);
    };
    // ADD SHAPE TO MAP
    Game.prototype.updateMap = function () {
        var _a, _b;
        // this.dropLines();
        this.clear();
        // ITERRATE TROUGH SHAPE ARRAY
        for (var shapeRow = 0; shapeRow < this.shape.pieces.length; shapeRow++) {
            for (var shapeCol = 0; shapeCol < this.shape.pieces[shapeRow].length; shapeCol++) {
                /* CALCULATE THE ROW AND COL OF
                   POSITION IN THE MAP THAT THE SAQURE OF SHAPE WILL BE FIT IN */
                var row = shapeRow + this.shape.cords.row;
                var col = shapeCol + this.shape.cords.col;
                // ADD PIECE AT A POSTION IN THE MAP
                if (((_a = this.map[row][col]) === null || _a === void 0 ? void 0 : _a.value) == "." ||
                    ((_b = this.map[row][col]) === null || _b === void 0 ? void 0 : _b.value) == "0")
                    this.map[row][col] = __assign({}, JSON.parse(JSON.stringify(this.shape.pieces[shapeRow][shapeCol])));
            }
        }
        this.draw();
    };
    // GOT RANDOM SHAPE AND ADD IT INTO MAP
    Game.prototype.addShapeToMap = function () {
        this.shape = __assign({}, this.getShape());
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
                    this.map[mapRow][mapCol]["status"] = "landed";
                }
            }
        }
        console.log("LANDED FUNCTIONS");
    };
    // DRAW MAP
    Game.prototype.draw = function () {
        console.log("--------------------------------");
        console.log({ "cords.col ": this.shape.cords.col });
        console.log("--------------------------------");
        console.log("");
        console.log("--------------------------------");
        console.log("");
        this.map.forEach(function (row) {
            row.forEach(function (item) {
                if (item.value === "0")
                    process.stdout.write(".");
                else
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
        this.shape.cords.row++;
        if (!this.collisionDetecter()) {
            this.updateMap();
        }
        else {
            this.shape.cords.row--;
            this.setShapeLanded();
            this.addShapeToMap();
        }
    };
    // MOVE SHAPE TO THE LEFT
    Game.prototype.moveToLeft = function () {
        this.shape.cords.col--;
        if (!this.collisionDetecter()) {
            this.updateMap();
        }
        else {
            this.shape.cords.col++;
            this.draw();
        }
    };
    // MOVE SHAPE TO THE RIGHT
    Game.prototype.moveToRight = function () {
        this.shape.cords.col++;
        if (!this.collisionDetecter()) {
            this.updateMap();
        }
        else {
            this.shape.cords.col--;
            this.draw();
        }
    };
    Game.prototype.collisionDetecter = function () {
        var _a, _b;
        var shapeCpy = __assign({}, JSON.parse(JSON.stringify(this.shape)));
        // console.log("I'm here");
        for (var shapeRow = 0; shapeRow < shapeCpy.pieces.length; shapeRow++) {
            for (var shapeCol = 0; shapeCol < shapeCpy.pieces[shapeRow].length; shapeCol++) {
                /* CALCULATE THE ROW AND COL OF
                   POSITION IN THE MAP THAT THE SAQURE OF THE CURRENT SHAPE WILL BE FIT IN */
                var row = shapeRow + shapeCpy.cords.row;
                var col = shapeCol + shapeCpy.cords.col;
                try {
                    // DATA OF CURRENT POINT IN MAP
                    var currtPointData = this.map[row] ? this.map[row][col] : undefined;
                    // DATA OF NEW POINT THAT WILL BE ADD IN MAP
                    var shapePointData = shapeCpy.pieces[shapeRow][shapeCol];
                    // console.log("insided => ", row);
                    /*
                    - CHECK FOR X AXIS COLLISION
                    - CEHCK FOR Y AXIS COLLISION
                    - CHECK FOR NEIBHOUR COLLISION
                  */
                    console.log({
                        row: row,
                        col: col
                    });
                    if (col >= this.colCount || col < 0) {
                        console.log("X AXIS COLLISION", col);
                        return true;
                    }
                    else if (row >= this.rowCount || row < 0) {
                        console.log("Y AXIS COLLISION", row);
                        return true;
                    }
                    else if ((currtPointData === null || currtPointData === void 0 ? void 0 : currtPointData.status) == "landed" &&
                        (currtPointData === null || currtPointData === void 0 ? void 0 : currtPointData.value) != "0" &&
                        (currtPointData === null || currtPointData === void 0 ? void 0 : currtPointData.value) != "." &&
                        (shapePointData === null || shapePointData === void 0 ? void 0 : shapePointData.value) != "0") {
                        console.log("collision happen for that reasion");
                        console.log("status :", (_a = this.map[row][col]) === null || _a === void 0 ? void 0 : _a.status);
                        console.log("value :", (_b = this.map[row][col]) === null || _b === void 0 ? void 0 : _b.value);
                        return true;
                    }
                }
                catch (_c) {
                    return false;
                }
            }
        }
        console.log("OUT");
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
        this.shape.pieces = __spreadArray([], __read(JSON.parse(JSON.stringify(matrix))), false);
        if (this.collisionDetecter()) {
            this.rotate();
        }
        this.updateMap();
    };
    return Game;
}(Shape_1["default"]));
// // VERIFY TOP SIDE COLLISSION OF A SHAPE
// topCollission(neighborPostion: any, currPosition: any, rowIndex): boolean {
//   // VERIFY THE TOP POINT IS EMPTY OR THE END OF MAP ROWS
//   if (
//     (neighborPostion &&
//       neighborPostion["status"] === "landed" &&
//       neighborPostion["value"] != "0" &&
//       currPosition["value"] != "0") ||
//     rowIndex <= 0
//   )
//     return true;
//   return false;
// }
// // VERIFY RIGHT SIDE COLLISSION OF A SHAPE
// rightCollission(
//   neighborPostion: any,
//   currPosition: any,
//   colIndex: number
// ): boolean {
//   /*
//   - VERIFY NEIHBOR POINT ITS STATUS LANDED OR NOT
//   - VERIFY NEIHBOR POINT IS IT EMPTY OR THE END OF MAP COLUMNS
//   - VERIFY THE VALUE OF CURRENT POINT IF IS IT DIFFRENT THAN ZERO
//   */
//   console.log("right collision");
//   console.log({ colIndex });
//   console.log({ colCount: this.colCount });
//   console.log({ "neibghour-pos": neighborPostion?.status });
//   console.log({ "neibghour-value": neighborPostion?.value });
//   console.log({ "curr-pos": currPosition.value });
//   if (
//     (neighborPostion?.status === "landed" &&
//       neighborPostion?.value != "0" &&
//       currPosition.value != "0") ||
//     colIndex >= this.colCount
//   ) {
//     return true;
//   }
//   return false;
// }
// // VERIFY LEFT SIDE COLLISSION OF A SHAPE
// leftCollission(
//   neighborPostion: any,
//   currPosition: any,
//   colIndex: number
// ): boolean {
//   // VERIFY THE LEFT POINT IS EMPTY OR THE END OF MAP COLUMNS
//   if (
//     (neighborPostion?.status === "landed" &&
//       neighborPostion?.value != "0" &&
//       currPosition.value != "0") ||
//     colIndex < 0
//   )
//     return true;
//   return false;
// }
// // VERIFY BOTTOM SIDE COLLISSION OF A SHAPE
// bottomCollission(
//   neighborPostion: any,
//   currPosition: any,
//   rowIndex: number
// ): boolean {
//   // VERIFY THE BOTTOM POINT IS EMPTY OR THE END OF MAP ROWS
//   // console.log("bottom Collission function");
//   // console.log({ rowIndex });
//   // console.log({ rowCount: this.rowCount });
//   if (
//     (neighborPostion?.status === "landed" &&
//       neighborPostion.value != "0" &&
//       currPosition.value != "0") ||
//     rowIndex >= this.rowCount
//   )
//     return true;
//   return false;
// }
// // ROTATION MOVEMENT COLLISION CHECKER
// rotationCollisionChecker(mapRow: number, mapCol: number) {
//   console.log("Rotation =====> ");
//   if (
//     this.rightCollission(
//       this.map[mapRow][mapCol + 1],
//       this.map[mapRow][mapCol],
//       mapCol + 1
//     )
//   ) {
//     console.log("right Collission");
//     return true;
//   } if (
//     this.leftCollission(
//       this.map[mapRow][mapCol - 1],
//       this.map[mapRow][mapCol],
//       mapCol - 1
//     )
//   ) {
//     console.log("left Collission");
//     return true;
//   } else if (
//     this.bottomCollission(
//       this.map[mapRow === this.rowCount - 1 ? mapRow : mapRow + 1][mapCol],
//       this.map[mapRow][mapCol],
//       mapRow + 1
//     )
//   ) {
//     console.log("down collission");
//     return true;
//   } else if (
//     this.topCollission(
//       this.map[mapRow === 0 ? mapRow : mapRow - 1][mapCol],
//       this.map[mapRow][mapCol],
//       mapRow - 1
//     )
//   ) {
//     console.log("down collission");
//     return true;
//   } else if (
//     this.bottomCollission(
//       this.map[mapRow === this.rowCount - 1 ? mapRow : mapRow + 1][mapCol],
//       this.map[mapRow][mapCol],
//       mapRow + 1
//     )
//   ) {
//     console.log("down collission");
//     return true;
//   }
//   return false;
// }
// // NORMAL MOVMENT COLLISION CHECKER
// normalMovCollisionChecker(mapRow: number, mapCol: number, sign: string) {
//   if (
//     sign === "right" &&
//     this.rightCollission(
//       this.map[mapRow][mapCol + 1],
//       this.map[mapRow][mapCol],
//       mapCol + 1
//     )
//   ) {
//     console.log("right Collission ______");
//     return true;
//   } else if (
//     sign === "left" &&
//     this.leftCollission(
//       this.map[mapRow][mapCol - 1],
//       this.map[mapRow][mapCol],
//       mapCol - 1
//     )
//   ) {
//     console.log("left Collission");
//     return true;
//   } else if (
//     sign === "down" &&
//     this.bottomCollission(
//       this.map[mapRow === this.rowCount - 1 ? mapRow : mapRow + 1][mapCol],
//       this.map[mapRow][mapCol],
//       mapRow + 1
//     )
//   ) {
//     console.log("down Collission");
//     return true;
//   }
//   return false;
// }
// neighborShapesCollision(sign: string | undefined): boolean {
//   // ITERRATE TROUGH THE MAP AND LOOK FOR ACTIVE SHAPE THEN START CHECKING FOR NEIGHBOR COLLESION
//   for (let mapRow: number = 0; mapRow < this.map.length; mapRow++) {
//     for (let mapCol: number = 0; mapCol < this.map[mapRow].length; mapCol++) {
//       // DO NEIGHBOR COLLISON VERIFICATION JUST FOR CURRENT SHAPE IN OUR CASE MEAN ACTIVE SHAPE
//       if (this.map[mapRow][mapCol]["status"] === "active" && sign) {
//         // SIGN JUST USED IN CASE LEFT OR RIGHT OR DOWN ARROW PRESSED
//         // CHECK COLLISION FOR NORMAL MOVMENTS
//         if (this.normalMovCollisionChecker(mapRow, mapCol, sign)) return true;
//       }
//       // } else if (this.map[mapRow][mapCol]["status"] === "active") {
//       //   // CHECK COLLISION AN CASE SHAPE ROTATED
//       //   if (this.rotationCollisionChecker(mapRow, mapCol)) return true;
//       // }
//     }
//   }
//   return false;
// }
exports["default"] = Game;

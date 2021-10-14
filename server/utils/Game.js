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
        _this.colCount = 10;
        _this.rowCount = 10;
        _this.map = _this.mapGenerator();
        _this.addShapeToMap();
        _this.gravityInterval = 1000;
        _this.gameOver = false;
        _this.falling();
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
                    if (!(i < this.colCount)) return [3 /*break*/, 4];
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
                    if (!(i < this.rowCount)) return [3 /*break*/, 4];
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
    Game.prototype.dropRows = function () {
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
            if (count < this.rowCount)
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
        // DROP ROWS THAT ARE FULL
        this.dropRows();
        // CLEAR THE MAP
        this.clear();
        // ITERATE TROUGH ROWS OF CURRENT SHAPE
        for (var shapeRow = 0; shapeRow < this.shape.pieces.length; shapeRow++) {
            // ITERATE TROUGH ROWS OF CURRENT SHAPE
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
        // DRAW THE MAP
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
        /*
          IF THE CURRENT SHAPE LANDED SET
          ITS STATUS TO LANDED SO THE CLEAR
          FUNC CAN'T REMOVE IT FROM THE MAP
        */
        for (var mapRow = 0; mapRow < this.map.length; mapRow++) {
            for (var mapCol = 0; mapCol < this.map[mapRow].length; mapCol++) {
                if (this.map[mapRow][mapCol].value !== ".") {
                    this.map[mapRow][mapCol]["status"] = "landed";
                }
            }
        }
    };
    // DRAW MAP
    Game.prototype.draw = function () {
        console.log("--------------------------------");
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
        /* IF THERE ARE NO COLLISOINS
           KEEP INCREMENT ROW AND MOVE SHAPE DOWN
           ELSE SET THE CURRENT SHAPE AS LANDED AND ADD NEW
           SHAPE TO THE MAP
        */
        if (!this.gameOver) {
            this.shape.cords.row++;
            if (!this.collisionDetecter()) {
                this.updateMap();
            }
            else {
                this.shape.cords.row--;
                this.setShapeLanded();
                this.addShapeToMap();
            }
            if (this.gameOver)
                console.log("Game Over!");
        }
        else {
            console.log("Game Over!");
        }
    };
    // MOVE SHAPE TO THE LEFT
    Game.prototype.moveToLeft = function () {
        /* IF THERE ARE NO COLLISOINS
           KEEP DEINCREMENT COL AND MOVE SHAPE TO LEFT
        */
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
        /* IF THERE ARE NO COLLISOINS
           KEEP INCREMENT COL AND MOVE SHAPE TO RIGHT
        */
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
        // DEEP COPY OF CURRENT SHAPE
        var shapeCpy = __assign({}, JSON.parse(JSON.stringify(this.shape)));
        // ITERATE TROUGH ROWS OF CURRENT SHAPE
        for (var shapeRow = 0; shapeRow < shapeCpy.pieces.length; shapeRow++) {
            // ITERATE TROUGH COLS OF CURRENT SHAPE
            for (var shapeCol = 0; shapeCol < shapeCpy.pieces[shapeRow].length; shapeCol++) {
                /* CALCULATE THE ROW AND COL OF
                   POSITION IN THE MAP THAT THE  POINT OF THE CURRENT SHAPE WILL BE FIT IN */
                var row = shapeRow + shapeCpy.cords.row;
                var col = shapeCol + shapeCpy.cords.col;
                // DATA OF CURRENT POINT IN MAP
                var currtPointData = this.map[row] ? this.map[row][col] : undefined;
                // DATA OF NEW POINT THAT WILL BE ADDED IN MAP
                var shapePointData = shapeCpy.pieces[shapeRow][shapeCol];
                /*
                    - CHECK FOR X AXIS COLLISION
                    - CEHCK FOR Y AXIS COLLISION
                    - CHECK FOR NEIBHOUR COLLISION
                    - HANDLE COLLISION IF MAP IS FULL VERTICALLY
                */
                console.log({
                    row: row,
                    col: col,
                    currtPointData: currtPointData
                });
                if (col >= this.colCount || col < 0) {
                    return true;
                }
                else if (row >= this.rowCount) {
                    return true;
                }
                else if (row === 1 && (currtPointData === null || currtPointData === void 0 ? void 0 : currtPointData.status) == "landed") {
                    console.log("map full");
                    this.gameOver = true;
                    return true;
                }
                else if ((currtPointData === null || currtPointData === void 0 ? void 0 : currtPointData.status) == "landed" &&
                    (currtPointData === null || currtPointData === void 0 ? void 0 : currtPointData.value) != "0" &&
                    (currtPointData === null || currtPointData === void 0 ? void 0 : currtPointData.value) != "." &&
                    (shapePointData === null || shapePointData === void 0 ? void 0 : shapePointData.value) != "0") {
                    console.log("collision happen");
                    return true;
                }
            }
        }
        // IN CASE THERE NO COLLISION
        return false;
    };
    // ROTATION 90 DEGREE TO CURRENT SHAPE
    Game.prototype.rotate = function () {
        // THIS ARRAY WILL HOLD ARRAYS THAT REPRESONT ROWS OF A CURRENT SHAPE
        var matrix = [];
        // ITERATE TROUGH ROWS OF CURRENT SHAPE
        for (var shapeRow = 0; shapeRow < this.shape.pieces.length; shapeRow++) {
            // ITERATE TROUGH COLS OF CURRENT SHAPE
            for (var shapeCol = 0; shapeCol < this.shape.pieces[shapeRow].length; shapeCol++) {
                /*
                  - ADD ARRAY INSIDE MATRIX IF NOT ALREADY THERE
                  - THE NUMBER OF ARRAYS THAT WILL BE IN MATRIX
                    DEPENDS ON THE COUNT OF COLS IN CURRENT SHAPE ARRAY.
                  - EACH ARRAY CREATED WE WILL PUSH INTO IT SHAPE[ROW][COL] DATA OF CURRENT SHAPES
                  - THE ARRAY INSIDE MATRIX WILL BE USED AS STACK DATA STRUCTURE
                  - EACH TIME WE ADD DATA TO THE ARRAYS OF MATRIX WILL BE ADDED AT INDEX 0
                */
                if (!matrix[shapeCol])
                    matrix[shapeCol] = [];
                matrix[shapeCol].unshift(this.shape.pieces[shapeRow][shapeCol]);
            }
        }
        // COPY NEW ROTATED SHAPE INTO OLD SHAPE VARIABLE
        this.shape.pieces = __spreadArray([], __read(JSON.parse(JSON.stringify(matrix))), false);
        /*
          - EACH TIME THERE IS A COLLISION DETECT THE FUNCTION
            WILL CALL IT SELF TO KEEP ROTATING SHAPE UNTIL
            GOT THE FITTED ROTATION
        */
        if (this.collisionDetecter()) {
            this.rotate();
        }
        /* IF NEW ROTATION FITTED DRAW IT INTO THE MAP*/
        this.updateMap();
    };
    Game.prototype.falling = function () {
        var _this = this;
        setInterval(function () {
            _this.moveDown();
        }, this.gravityInterval);
    };
    return Game;
}(Shape_1["default"]));
exports["default"] = Game;

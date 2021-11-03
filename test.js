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
var arr = {};
var Factory = /** @class */ (function () {
    function Factory(id) {
        this.addItems(id);
    }
    Factory.prototype.addItems = function (id) {
        if (!arr[id]) {
            console.log("found");
            arr[id] = [];
            var items = ["a", "b", "c", "d", "e", "f"];
            for (var i = 0; i < 5; i++) {
                var item = items[Math.floor(Math.random() * items.length)];
                arr[id].push(item);
            }
        }
    };
    Factory.prototype.getItems = function (id) {
        return arr[id];
    };
    Factory.prototype.addMoreItems = function (id) {
        if (arr[id]) {
            for (var i = 0; i < 5; i++) {
                arr[id].push("a");
            }
        }
    };
    return Factory;
}());
var Consumer = /** @class */ (function (_super) {
    __extends(Consumer, _super);
    function Consumer(id) {
        var _this = _super.call(this, id) || this;
        _this.poolId = id;
        return _this;
    }
    Consumer.prototype.init = function () {
        return this.getItems(this.poolId);
    };
    Consumer.prototype.add = function () {
        this.addMoreItems(this.poolId);
    };
    return Consumer;
}(Factory));
var p1 = new Consumer("1");
var p2 = new Consumer("1");
var p3 = new Consumer("2");
var p4 = new Consumer("2");
console.log(p1.init());
console.log(p2.init());
console.log(p3.init());
console.log(p4.init());
console.log("-------------------");
p1.add();
console.log(p1.init());
console.log(p2.init());
console.log(p3.init());
console.log(p4.init());

"use strict";
exports.__esModule = true;
exports.Data = exports.DataService = void 0;
var DataService = /** @class */ (function () {
    function DataService() {
        this.store = new Map();
    }
    return DataService;
}());
exports.DataService = DataService;
exports.Data = new DataService().store;

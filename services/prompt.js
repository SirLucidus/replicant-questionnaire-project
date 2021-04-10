"use strict";
exports.__esModule = true;
exports.Prompt = exports.PromptService = void 0;
var readline = require("readline");
var PromptService = /** @class */ (function () {
    function PromptService() {
        this.interface = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }
    PromptService.prototype.close = function () {
        this.interface.close();
    };
    PromptService.prototype.write = function (phrase) {
        console.log(phrase);
    };
    PromptService.prototype.question = function (phrase) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.interface.question(phrase + "\r\n> ", function (answer) { return resolve(answer); });
        });
    };
    return PromptService;
}());
exports.PromptService = PromptService;
exports.Prompt = new PromptService();

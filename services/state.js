"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
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
exports.__esModule = true;
exports.StateService = void 0;
var types_1 = require("../config/types");
var voice_1 = require("./voice");
var prompt_1 = require("./prompt");
var StateService = /** @class */ (function () {
    function StateService(machine, config) {
        this.machine = machine;
        this.states = config;
        this.executeState();
    }
    StateService.prototype.executeState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var answer, phrase, interval_1;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.stateName = this.machine.state();
                        this.state = this.states[this.stateName];
                        return [4 /*yield*/, this.transitionIn()];
                    case 1:
                        _a.sent();
                        phrase = this.state.text();
                        voice_1.Voice.speak(phrase);
                        if (!(this.state.type === types_1.StateTypes.Statement)) return [3 /*break*/, 2];
                        prompt_1.Prompt.write(phrase);
                        interval_1 = setInterval(function () {
                            if (!voice_1.Voice.isSpeaking) {
                                clearInterval(interval_1);
                                _this.transitionOut();
                            }
                        }, 1000);
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(this.state.type === types_1.StateTypes.Question)) return [3 /*break*/, 4];
                        return [4 /*yield*/, prompt_1.Prompt.question(phrase)];
                    case 3:
                        answer = (_a.sent());
                        voice_1.Voice.stop();
                        this.state.answer = answer;
                        this.transitionOut();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    StateService.prototype.transitionIn = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.state.before) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.state.before()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    StateService.prototype.transitionOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.state.after) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.state.after(this.state)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        if (this.state.next) {
                            this.machine.transition(this.state.next);
                        }
                        else if (this.state.choices && this.state.choices.includes(this.state.answer)) {
                            this.machine.transition(this.state.answer);
                        }
                        else {
                            this.machine.action('next');
                        }
                        this.executeState();
                        return [2 /*return*/];
                }
            });
        });
    };
    return StateService;
}());
exports.StateService = StateService;

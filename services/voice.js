"use strict";
exports.__esModule = true;
exports.Voice = exports.VoiceService = void 0;
var say = require('say');
var VoiceService = /** @class */ (function () {
    function VoiceService() {
    }
    VoiceService.prototype.onClose = function (phrase) {
        if (this.isSpeaking && this.activePhrase === phrase) {
            this.isSpeaking = false;
        }
    };
    VoiceService.prototype.stop = function () {
        say.stop();
    };
    VoiceService.prototype.speak = function (phrase) {
        var _this = this;
        this.activePhrase = phrase;
        say.speak(phrase, null, null, function () { return _this.onClose(phrase); });
        this.isSpeaking = true;
    };
    return VoiceService;
}());
exports.VoiceService = VoiceService;
exports.Voice = new VoiceService();

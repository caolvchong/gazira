define(function(require, exports, module) {
    var $ = require('$');
    var Class = require('../../class');
    var SwfAudio = require('./audio-swf');
    var Html5Audio = require('./audio-html5');

    var useFlash = (function () {
        var a = document.createElement('audio');
        return !(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, '')) || navigator.userAgent.indexOf('Chromium') != -1;
    })();

    var Audio = Class.create({
        Extends: useFlash ? SwfAudio : Html5Audio
    });
    Audio.isSupportHTML5Audio = !useFlash;

    module.exports = Audio;

});
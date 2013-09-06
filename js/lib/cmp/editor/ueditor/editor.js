define(function(require, exports, module) {
    var baidu = require('./baidu');

    var UE = baidu.editor = {};
    UE.plugins = {};
    UE.commands = {};
    UE.instants = {};
    UE.I18N = {};
    UE.version = "1.2.6.1";
    UE.dom = {};
    module.exports = UE;
});
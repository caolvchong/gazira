/**
 * User: caolvchong@gmail.com
 * Date: 9/5/13
 * Time: 10:13 AM
 */
define(function(require, exports, module) {
    var baidu = require('../baidu');
    var utils = require('../core/utils');
    var UIBase = require('./uibase');

    (function (){
//        var utils = baidu.editor.utils,
//            UIBase = baidu.editor.ui.UIBase,
          var Breakline = baidu.editor.ui.Breakline = function (options){
                this.initOptions(options);
                this.initSeparator();
            };
        Breakline.prototype = {
            uiName: 'Breakline',
            initSeparator: function (){
                this.initUIBase();
            },
            getHtmlTpl: function (){
                return '<br/>';
            }
        };
        utils.inherits(Breakline, UIBase);


        module.exports = Breakline;
    })();

});
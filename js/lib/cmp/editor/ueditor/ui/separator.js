/**
 * User: caolvchong@gmail.com
 * Date: 9/5/13
 * Time: 10:27 AM
 */
define(function(require, exports, module) {
    var baidu = require('../baidu');
    var utils = require('../core/utils');
    var UIBase = require('./uibase');


    (function (){
//        var utils = baidu.editor.utils,
//            UIBase = baidu.editor.ui.UIBase,
          var Separator = baidu.editor.ui.Separator = function (options){
                this.initOptions(options);
                this.initSeparator();
            };
        Separator.prototype = {
            uiName: 'separator',
            initSeparator: function (){
                this.initUIBase();
            },
            getHtmlTpl: function (){
                return '<div id="##" class="edui-box %%"></div>';
            }
        };
        utils.inherits(Separator, UIBase);


        module.exports = Separator;

    })();

});
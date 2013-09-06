/**
 * User: caolvchong@gmail.com
 * Date: 9/4/13
 * Time: 8:34 PM
 */
define(function(require, exports, module) {
    var baidu = require('../baidu');
    var utils = require('../core/utils');
    var UIBase = require('./uibase');
    var Stateful = require('./stateful');


    ///import core
    ///import uicore
    ///import ui/stateful.js
    (function (){
//        var utils = baidu.editor.utils,
//            UIBase = baidu.editor.ui.UIBase,
//            Stateful = baidu.editor.ui.Stateful,
          var Button = baidu.editor.ui.Button = function (options){
                this.initOptions(options);
                this.initButton();
            };
        Button.prototype = {
            uiName: 'button',
            label: '',
            title: '',
            showIcon: true,
            showText: true,
            initButton: function (){
                this.initUIBase();
                this.Stateful_init();
            },
            getHtmlTpl: function (){
                return '<div id="##" class="edui-box %%">' +
                    '<div id="##_state" stateful>' +
                    '<div class="%%-wrap"><div id="##_body" unselectable="on" ' + (this.title ? 'title="' + this.title + '"' : '') +
                    ' class="%%-body" onmousedown="return false;" onclick="return $$._onClick();">' +
                    (this.showIcon ? '<div class="edui-box edui-icon"></div>' : '') +
                    (this.showText ? '<div class="edui-box edui-label">' + this.label + '</div>' : '') +
                    '</div>' +
                    '</div>' +
                    '</div></div>';
            },
            postRender: function (){
                this.Stateful_postRender();
                this.setDisabled(this.disabled)
            },
            _onClick: function (){
                if (!this.isDisabled()) {
                    this.fireEvent('click');
                }
            }
        };
        utils.inherits(Button, UIBase);
        utils.extend(Button.prototype, Stateful);


        module.exports = Button;
    })();

});
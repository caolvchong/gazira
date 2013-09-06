/**
 * User: caolvchong@gmail.com
 * Date: 9/5/13
 * Time: 10:24 AM
 */
define(function(require, exports, module) {
    var baidu = require('../baidu');
    var utils = require('../core/utils');
    var Menu = require('./menu');
    var SplitButton = require('./splitbutton');


    ///import core
    ///import uicore
    ///import ui/menu.js
    ///import ui/splitbutton.js
    (function (){
//        var utils = baidu.editor.utils,
//            Menu = baidu.editor.ui.Menu,
//            SplitButton = baidu.editor.ui.SplitButton,
          var MenuButton = baidu.editor.ui.MenuButton = function (options){
                this.initOptions(options);
                this.initMenuButton();
            };
        MenuButton.prototype = {
            initMenuButton: function (){
                var me = this;
                this.uiName = "menubutton";
                this.popup = new Menu({
                    items: me.items,
                    className: me.className,
                    editor:me.editor
                });
                this.popup.addListener('show', function (){
                    var list = this;
                    for (var i=0; i<list.items.length; i++) {
                        list.items[i].removeState('checked');
                        if (list.items[i].value == me._value) {
                            list.items[i].addState('checked');
                            this.value = me._value;
                        }
                    }
                });
                this.initSplitButton();
            },
            setValue : function(value){
                this._value = value;
            }

        };
        utils.inherits(MenuButton, SplitButton);


        module.exports = MenuButton;
    })();
});
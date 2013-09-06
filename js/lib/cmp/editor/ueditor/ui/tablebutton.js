/**
 * User: caolvchong@gmail.com
 * Date: 9/5/13
 * Time: 10:28 AM
 */
define(function(require, exports, module) {
    var baidu = require('../baidu');
    var utils = require('../core/utils');
    var Popup = require('./popup');
    var TablePicker = require('./tablepicker');
    var SplitButton = require('./splitbutton');


    ///import core
    ///import uicore
    ///import ui/popup.js
    ///import ui/tablepicker.js
    ///import ui/splitbutton.js
    (function (){
//        var utils = baidu.editor.utils,
//            Popup = baidu.editor.ui.Popup,
//            TablePicker = baidu.editor.ui.TablePicker,
//            SplitButton = baidu.editor.ui.SplitButton,
          var TableButton = baidu.editor.ui.TableButton = function (options){
                this.initOptions(options);
                this.initTableButton();
            };
        TableButton.prototype = {
            initTableButton: function (){
                var me = this;
                this.popup = new Popup({
                    content: new TablePicker({
                        editor:me.editor,
                        onpicktable: function (t, numCols, numRows){
                            me._onPickTable(numCols, numRows);
                        }
                    }),
                    'editor':me.editor
                });
                this.initSplitButton();
            },
            _onPickTable: function (numCols, numRows){
                if (this.fireEvent('picktable', numCols, numRows) !== false) {
                    this.popup.hide();
                }
            }
        };
        utils.inherits(TableButton, SplitButton);


        module.exports = TableButton;
    })();

});
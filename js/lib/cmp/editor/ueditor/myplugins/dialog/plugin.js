/**
 * User: caolvchong@gmail.com
 * Date: 9/5/13
 * Time: 11:36 PM
 */
define(function(require, exports, module) {
    var Dialog = require('../../ui/dialog');
    var UE = require('../../editor');

    UE.commands['dialog'] = {
        execCommand : function(cmdName){
            var dialog = new Dialog({
                width: 500,
                height: 300,
                title: 'hello',
                content: 'worldworldworldworldworldworldworldworldworld',
                editor: this
            });
            dialog.render();
            dialog.open();
        },
        queryCommandState:function(cmdName){ // -1禁用状态，按钮不可点; 0正常状态，可以点击; 1选中状态
        }
    };

    module.exports = UE.commands['dialog'];
});
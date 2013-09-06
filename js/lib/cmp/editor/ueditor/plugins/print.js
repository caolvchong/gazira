/**
 * User: caolvchong@gmail.com
 * Date: 9/5/13
 * Time: 4:08 PM
 */
define(function(require, exports, module) {
    var UE = require('../editor');

    ///import core
    ///commands 打印
    ///commandsName  Print
    ///commandsTitle  打印
    /**
     * @description 打印
     * @name baidu.editor.execCommand
     * @param   {String}   cmdName     print打印编辑器内容
     * @author zhanyi
     */
    UE.commands['print'] = {
        execCommand : function(){
            this.window.print();
        },
        notNeedUndo : 1
    };

    module.exports = UE.commands['print'];
});
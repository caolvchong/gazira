/**
 * User: caolvchong@gmail.com
 * Date: 9/5/13
 * Time: 7:59 PM
 */
define(function(require, exports, module) {
    var UE = require('../../editor');

    var status = 0;
    UE.commands['example'] = {
        execCommand : function(cmdName){
            this.execCommand('insertHtml','hello，这个是个例子');
        },
        queryCommandState:function(cmdName){ // -1禁用状态，按钮不可点; 0正常状态，可以点击; 1选中状态
            status = 1 - status;
            return status;
        }
    };

    module.exports = UE.commands['example'];
});
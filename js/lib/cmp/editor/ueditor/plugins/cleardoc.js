/**
 * User: caolvchong@gmail.com
 * Date: 9/5/13
 * Time: 11:46 AM
 */
define(function(require, exports, module) {
    var UE = require('../editor');
    var browser = require('../core/browser');
    var ie = browser.ie;


    ///import core
    ///commands 清空文档
    ///commandsName  ClearDoc
    ///commandsTitle  清空文档
    /**
     *
     * 清空文档
     * @function
     * @name baidu.editor.execCommand
     * @param   {String}   cmdName     cleardoc清空文档
     */

    UE.commands['cleardoc'] = {
        execCommand : function( cmdName) {
            var me = this,
                enterTag = me.options.enterTag,
                range = me.selection.getRange();
            if(enterTag == "br"){
                me.body.innerHTML = "<br/>";
                range.setStart(me.body,0).setCursor();
            }else{
                me.body.innerHTML = "<p>"+(ie ? "" : "<br/>")+"</p>";
                range.setStart(me.body.firstChild,0).setCursor(false,true);
            }
            setTimeout(function(){
                me.fireEvent("clearDoc");
            },0);

        }
    };


    module.exports = UE.commands['cleardoc'];
});
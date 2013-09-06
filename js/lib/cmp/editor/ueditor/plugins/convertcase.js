/**
 * User: caolvchong@gmail.com
 * Date: 9/5/13
 * Time: 1:35 PM
 */
define(function(require, exports, module) {
    var UE = require('../editor');
    var domUtils = require('../core/domUtils');

    ///import core
    ///commands 大小写转换
    ///commandsName touppercase,tolowercase
    ///commandsTitle  大写,小写
    /**
     * 大小写转换
     * @function
     * @name baidu.editor.execCommands
     * @param    {String}    cmdName     cmdName="convertcase"
     */
    UE.commands['touppercase'] =
        UE.commands['tolowercase'] = {
            execCommand:function (cmd) {
                var me = this;
                var rng = me.selection.getRange();
                if(rng.collapsed){
                    return rng;
                }
                var bk = rng.createBookmark(),
                    bkEnd = bk.end,
                    filterFn = function( node ) {
                        return !domUtils.isBr(node) && !domUtils.isWhitespace( node );
                    },
                    curNode = domUtils.getNextDomNode( bk.start, false, filterFn );
                while ( curNode && (domUtils.getPosition( curNode, bkEnd ) & domUtils.POSITION_PRECEDING) ) {

                    if ( curNode.nodeType == 3 ) {
                        curNode.nodeValue = curNode.nodeValue[cmd == 'touppercase' ? 'toUpperCase' : 'toLowerCase']();
                    }
                    curNode = domUtils.getNextDomNode( curNode, true, filterFn );
                    if(curNode === bkEnd){
                        break;
                    }

                }
                rng.moveToBookmark(bk).select();
            }
        };



    module.exports = UE.commands['touppercase'];
});
/**
 * User: caolvchong@gmail.com
 * Date: 7/3/13
 * Time: 8:46 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Tip = require('../../../../js/lib/cmp/tip/tip');

    $(function() {
        new Tip({
            trigger: '#box11',
            content: '<div style="padding:10px">我是内容 我是内容</div>',
            arrowPosition: 10
        });
        //----------------------------------------
    });
});
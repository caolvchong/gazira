/**
 * User: caolvchong@gmail.com
 * Date: 7/15/13
 * Time: 4:50 PM
 */
define(function(require, exports, module) {
    var $ = require('$');

    $(function() {
        $('#btn').click(function() {
            alert(1);
            window.frameElement.trigger('close');
        });
    });
});
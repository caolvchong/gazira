/**
 * User: caolvchong@gmail.com
 * Date: 6/26/13
 * Time: 4:38 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var ConfirmBox = require('../../lib/cmp/dialog/confirm-box');

    $(function() {
        ConfirmBox.alert({
            title: 'hello',
            width: 500,
            height: 400,
            content: 'world'
        });
    });
});
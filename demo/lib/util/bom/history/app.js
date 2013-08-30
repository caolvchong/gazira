/**
 * User: caolvchong@gmail.com
 * Date: 7/1/13
 * Time: 1:42 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var history = require('../../../../../js/lib/util/bom/history');

    $(function() {
        var box = $('#box');
        history.listen({
            hello: function() {
                box.html('hello, baby!');
            },
            'user/:id': function(id) {
                box.html('hello, user, your id is : ' + id + '!');
            },
            'about': function() {
                box.html('my name is xxx');
            },
            defaultRouter: 'hello'
        });
    });
});
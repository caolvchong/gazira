define(function(require, exports, module) {
    var $ = require('$');
    var Scroll = require('../../../../../js/lib/util/dom/scroll');

    $(function() {
        Scroll.listen(window, {
            top: function(e, top, dir, status) {
                console.log('top');
            },
            bottom: function(e, top, dir, status) {
                console.log('bottom');
            },
            other: function(e, top, dir, status) {
                //console.log(dir, top);
            }
        });
    });
});
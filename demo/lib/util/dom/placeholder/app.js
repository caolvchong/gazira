define(function(require, exports, module) {
    var $ = require('$');
    var Placeholder = require('../../../../../js/lib/util/dom/placeholder');

    $(function() {
        Placeholder.render();

        $('#btn').click(function() {
            $('#area').toggleClass('hide');
        });
    });
});
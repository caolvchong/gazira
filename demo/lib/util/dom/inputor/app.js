define(function(require, exports, module) {
    var $ = require('$');
    var Inputor = require('../../../../../js/lib/util/dom/inputor');

    $(function() {
        $('#ipt1').timer(function(text, input) {
            console.log(text);
        });
    });
});
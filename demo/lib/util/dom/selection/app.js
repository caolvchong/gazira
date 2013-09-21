define(function(require, exports, module) {
    var $ = require('$');
    var Selection = require('../../../../../js/lib/util/dom/selection');

    $(function() {
        var sel = Selection('#editor');
        $('#editor').on('click select keyup', function() {
            $('#speaker-text').text(sel.text());
            $('#speaker-cursor').text(sel.cursor());
            $('#speaker-surround').text(sel.surround());
        });

        $('#button-cursor').click(function() {
            sel.cursor(10, 19);
            // equal sel.cursor([10, 19])
        });
        $('#button-text').click(function() {
            sel.text('hello world');
            // sel.text('hello world', 'left')
            // sel.text('hello world', 'right')
        });
        $('#button-prepend').click(function() {
            sel.prepend('hello prepend', 'right');
        });
        $('#button-append').click(function() {
            sel.prepend('hello append', 'left');
        });
        $('#button-line').click(function() {
            alert(sel.line());
        });
    });
});
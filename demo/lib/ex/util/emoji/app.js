define(function(require, exports, module) {
    var $ = require('$');
    var emoji = require('../../../../../js/lib/ex/util/emoji');

    $(function () {
        var $text = $('.emojstext');
        var html = $text.html().trim().replace(/\n/g, '<br/>');
        html = emoji.softbankToUnified(html);
        html = emoji.googleToUnified(html);
        html = emoji.docomoToUnified(html);
        html = emoji.kddiToUnified(html);
        $text.html(emoji.unifiedToHTML(html));
    });
});
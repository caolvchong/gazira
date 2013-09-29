/**
 * User: caolvchong@gmail.com
 * Date: 7/5/13
 * Time: 3:25 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Position = require('./position');
    var Inputor = require('./inputor');

    var detect = (function() {
        var isSupport = 0;
        return function() {
            if(isSupport === 0) {
                isSupport = 'placeholder' in document.createElement('input');
            }
            return isSupport;
        };
    })();

    var Placeholder = function(node, text) {
        if(!detect()) {
            node = $(node);
            if(!node.data('placeholder')) {
                text = text || node.attr('placeholder');
                var p = $('<span class="placeholder">' + text + '</span>');
                var h = parseInt(node.css('line-height')) + 4;
                node.after(p);
                p.css({
                    color: '#bbb',
                    height: h,
                    lineHeight: h + 'px',
                    paddingLeft: '9px'
                });
                Position.pin({
                    element: p
                }, {
                    element: node
                });

                node.timer(function(text, input) {
                    p[text.length ? 'hide' : 'show']();
                });

                p.bind('focus click', function() {
                    node.focus();
                });

                if(node.val().length) {
                    p.hide();
                }

                node.data('placeholder', true);
            }
        }
    };

    Placeholder.render = function() {
        $('[placeholder]').placehoder();
    };

    $.fn.placehoder = function() {
        this.each(function() {
            Placeholder(this);
        });
    };

    $(function() {
        if(!detect()) {
            $(window).bind('resize.placeholder', function() {
                $('[placeholder]').each(function(i, node) {
                    node = $(node);
                    var p = node.nextAll('.placeholder').eq(0);
                    Position.pin({
                        element: p
                    }, {
                        element: node
                    });
                });
            });
        }
    });

    module.exports = Placeholder;
});
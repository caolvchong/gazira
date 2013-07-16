/**
 * User: caolvchong@gmail.com
 * Date: 7/3/13
 * Time: 8:46 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Dialog = require('./dialog');
    var DialogExt = require('./dialog-ext');
    var Tab = require('./tab');

    $(function() {
        var d1 = new Dialog({
            title: '窗口1',
            content: 'hello world'
        });

        $('#btn11').click(function() {
            d1.show().center();
        });
        $('#btn12').click(function() {
            d1.show().position(100, 100);
        });
        $('#btn13').click(function() {
            d1.hide();
        });
        $('#btn14').click(function() {
            d1.show();
        });


        var d2 = new DialogExt({
            title: '窗口2，鼠标过来试试',
            content: '呵呵'
        });
        $('#btn21').click(function() {
            var text = {
                enable: '禁用旁边的那个按钮->',
                disable: '好吧，启用那可怜的按钮'
            }
            d2.setFooter([{
                text: text.enable,
                action: function(e) {
                    var target = $(e.target);
                    var next = target.next('input');
                    var isDisabled = next.attr('disabled');
                    if(isDisabled) {
                        next.removeAttr('disabled');
                        target.val(text.enable);
                    } else {
                        next.attr('disabled', 'disabled');
                        target.val(text.disable);
                    }
                }
            }, {
                text: '我被人控制',
                action: function(e) {
                    this.hide();
                }
            }]);
            d2.show().center();
        });
        $('#btn22').click(function() {
            d2.setFooter().show().center();
        });
        $('#btn23').click(function() {
            d2.hideFooter().show({
                width: 700,
                height: 350
            }).center();
        });


        $('.widget-tab').each(function(i, v) {
            new Tab({
                element: $(v)
            }).render();
        });
    });
});
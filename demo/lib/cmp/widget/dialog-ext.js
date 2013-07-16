/**
 * User: caolvchong@gmail.com
 * Date: 7/1/13
 * Time: 1:45 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Dialog = require('./dialog');

    var DialogExt = Dialog.extend({
        attrs: {
            width: 500,
            height: 250,
            footer: [{
                text: '位置设置到(200, 200)',
                action: function() {
                    this.position(200, 200);
                }
            }, {
                text: '关闭',
                action: function() {
                    this.hide();
                }
            }]
        },
        events: {
            'mouseenter .widget-dialog-header': function() {
                this.$('.widget-dialog-header').addClass('hover');
            },
            'mouseleave .widget-dialog-header': function() {
                this.$('.widget-dialog-header').removeClass('hover');
            }
        },
        setup: function() {
            DialogExt.superclass.setup.call(this);
            this.setFooter(this.get('footer'));
        },
        setFooter: function(buttons) {
            var footer = this.$('.widget-dialog-footer');
            var that = this;
            buttons = buttons || this.get('footer');
            footer.empty().show();
            for(var i = 0, len = buttons.length; i < len; i++) {
                footer.append('<input class="widget-dialog-button btn" type="button" value="' + buttons[i].text + '"/>');
                (function(i) {
                    footer.find('.widget-dialog-button:last-child').eq(0).click(function(e) {
                        buttons[i].action.call(that, e);
                    });
                })(i);
            }
            return this;
        },
        hideFooter: function() {
            var footer = this.$('.widget-dialog-footer');
            footer.empty().hide();
            return this;
        }
    });

    module.exports = DialogExt;
});
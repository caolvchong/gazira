/**
 * User: caolvchong@gmail.com
 * Date: 7/12/13
 * Time: 5:25 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Dialog = require('./dialog');
    var buttonTpl = require('./tpl/button');

    var btnId = 0;
    var defaultConfig = {
        title: '',
        content: '',
        width: 375,
        height: 275,
        buttons: [{
            text: '关闭',
            className: 'btn',
            action: 'close'
        }]
    };

    var ConfirmBox = Dialog.extend({
        attrs: {
            title: defaultConfig.title,
            content: defaultConfig.content,
            width: defaultConfig.width,
            height: defaultConfig.height,
            hasMask: {
                hideOnClick: false
            },
            buttons: []
        },

        setup: function() {
            ConfirmBox.superclass.setup.call(this);

            var buttons = this.get('buttons');
            var html = [];
            for(var i = 0, len = buttons.length; i < len; i++) {
                var btn = buttons[i];
                var actionName = typeof btn.action === 'string' ? btn.action : 'click_' + (++btnId);
                html.push(buttonTpl.render({
                    className: btn.className,
                    action: actionName,
                    text: btn.text
                }));
                if(actionName !== 'close' && actionName !== 'confirm') {
                    this.delegateEvents('click [data-action="' + actionName + '"]', (function(actionName) {
                        return function(e) {
                            e.preventDefault();
                            this.trigger(actionName);
                        };
                    })(actionName));
                }
            }
            this.$('[data-role=buttons]').eq(0).html(html.join(''));
        },

        events: {
            'click [data-action=close]': function(e) {
                e.preventDefault();
                this.hide();
            },
            'click [data-action=confirm]': function(e) {
                e.preventDefault();
                this.trigger('confirm');
            }
        },

        _onChangeContent: function(val) {
            this.$('[data-role=content]').html(val);
        },

        _onChangeTitle: function(val) {
            this.$('[data-role=title]').html(val);
        }
    });

    ConfirmBox.alert = function(options) {
        options = options || {};
        options = $.extend(true, {}, defaultConfig, options);
        if(options.buttons.length !== 1) {
            options.buttons = [options.buttons[0]];
        }
        return new ConfirmBox(options).show().after('hide', function() {
            this.destroy();
        });
    };

    ConfirmBox.confirm = function(options) {
        options = options || {};
        options = $.extend(true, {
            buttons: [{
                text: '确认',
                className: 'btn',
                action: 'confirm'
            }, {
                text: '取消',
                className: 'btn',
                action: 'close'
            }]
        }, defaultConfig, options);
        options.buttons = options.buttons.slice(0, 2);
        return new ConfirmBox(options).show().after('hide', function() {
            this.destroy();
        });
    };

    ConfirmBox.show = function(options) {
        options = options || {};
        options = $.extend({}, defaultConfig, options);
        return new ConfirmBox(options).show().after('hide', function() {
            this.destroy();
        });
    };

    module.exports = ConfirmBox;
});
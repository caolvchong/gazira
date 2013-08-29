/**
 * User: caolvchong@gmail.com
 * Date: 8/21/13
 * Time: 5:05 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Widget = require('../widget');
    var wheel = require('../../util/dom/wheel');
    var tpl = require('./tpl/time');

    var helper = {
        patchZero: function(n) {
            return n < 10 ? '0' + n : n;
        },
        change: function(input, val) {
            var type = input.attr('data-input');
            val = +val;
            val = isNaN(val) ? (+$.trim(input.val()) || 0) : val;

            if(type === 'hour') {
                val = (val + 24) % 24;
                this._change(val, this.get('minute'), this.get('second'));
            } else {
                val = (val + 60) % 60;
                if(type === 'minute') {
                    this._change(this.get('hour'), val, this.get('second'));
                } else {
                    this._change(this.get('hour'), this.get('minute'), val);
                }
            }
            input.val(helper.patchZero(val));
        }
    };

    var TimePanel = Widget.extend({
        attrs: {
            hour: new Date().getHours(),
            minute: new Date().getMinutes(),
            second: new Date().getSeconds(),
            display: {
                hour: true,
                minute: true,
                second: false
            }
        },
        events: {
            'click [data-action]': function(e) {
                var node = $(e.target);
                var isPrev = /prev/.test(node.attr('data-action'));
                var input = node.parent().find('[data-input]');
                var val = +$.trim(input.val()) || 0;
                val = val + (isPrev ? -1 : 1);
                helper.change.call(this, input, val);
            },
            'blur [data-input]': function(e) {
                var input = $(e.target);
                helper.change.call(this, input);
            }
        },
        show: function() {
            var self = this;
            this.element.html(tpl.render({
                hour: helper.patchZero(this.get('hour')),
                minute: helper.patchZero(this.get('minute')),
                second: helper.patchZero(this.get('second')),
                display: this.get('display')
            })).show();

            this.$('[data-input]').each(function(i, input) {
                input = $(input);
                wheel(input, function(e, type, prevent) {
                    prevent();
                    if(type === 'up') {
                        helper.change.call(self, input, self.get(input.attr('data-input')) + 1);
                    } else if(type === 'down') {
                        helper.change.call(self, input, self.get(input.attr('data-input')) - 1);
                    }
                    input.select();
                });

                input.hover(function() {
                    this.select();
                }, function() {
                    this.blur();
                });
            });
            return this;
        },
        output: function() {
            return helper.patchZero(this.get('hour')) + ':' + helper.patchZero(this.get('minute')) + ':' + helper.patchZero(this.get('second'));
        },
        _change: function(hour, minute, second) {
            var flag = false;
            var h = this.get('hour');
            var m = this.get('minute');
            var s = this.get('second');

            if(h !== hour) {
                this.set('hour', hour);
                flag = true;
            }
            if(m !== minute) {
                this.set('minute', minute);
                flag = true;
            }
            if(s !== second) {
                this.set('second', second);
                flag = true;
            }

            if(flag) {
                this.trigger('change', hour, minute, second, h, m, s);
            }
        }
    });

    module.exports = TimePanel;
});
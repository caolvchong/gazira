/**
 * User: caolvchong@gmail.com
 * Date: 8/21/13
 * Time: 10:39 AM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Widget = require('../widget');

    var Month = Widget.extend({
        attrs: {
            month: new Date().getMonth(),
            list: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            disabled: function(month) { // function, 返回false的则不可点击
                month = month.getMonth ? month.getMonth() : month;
                return month < 0 || month >= 12;
            }
        },
        events: {
            'click [data-role=set-month]': function(e) {
                var node = $(e.target);
                var prev = this.get('month');
                var month = +node.attr('data-val');
                this.set('month', month);
                this.trigger('select', month, prev, node);
            },
            'click .month-disabled': function(e) {
                var node = $(e.target);
                var month = this.get('month');
                var val = +node.attr('data-val');
                this.trigger('selectDisabled', val, month, node);
            }
        },
        prev: function() {
            var prev = this.get('month');
            var month = prev - 1;
            this.set('month', month);
            this.trigger('select', month, prev);
            return this;
        },
        next: function() {
            var prev = this.get('month');
            var month = prev + 1;
            this.set('month', month);
            this.trigger('select', month, prev);
            return this;
        },
        show: function() {
            var month = this.get('month');
            var list = this.get('list');
            var arr = [];
            var flag = 0;
            for(var i = 0; i < 4; i++) {
                var temp = ['<tr class="widget-calendar-month-column">'];
                for(var j = flag, len = flag + 3; j < len; j++, flag++) {
                    temp.push('<td ')
                    if(this.get('disabled').call(this, flag) === true) {
                        temp.push('class="month-disabled"');
                    } else {
                        temp.push('data-role="set-month"');
                        if(flag === month) {
                            temp.push(' class="month-curr"');
                        }
                    }
                    temp.push(' data-val="' + flag + '"');
                    temp.push('>', list[flag], '</td>');
                }
                temp.push('</tr>');
                arr[i] = temp.join('');
            }
            arr.unshift('<table class="widget-calendar-month" data-role="month-column">');
            arr.push('</table>');
            this.element.html(arr.join('')).show();
            return this;
        }
    });

    module.exports = Month;
});
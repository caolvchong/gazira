/**
 * User: caolvchong@gmail.com
 * Date: 8/20/13
 * Time: 5:44 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Widget = require('../widget');
    var helper = {
        getDate: function(year) {
            return new Date(+year, 0, 1);
        }
    };

    var YearPanel = Widget.extend({
        attrs: {
            date: new Date(),
            n: 10, // 每页显示的年数个数
            m: 3, // 每行默认显示的个数
            disabled: function(year) { // function, 返回false的则不可点击
                return false;
            },
            prevPlaceholder: '. . .',
            nextPlaceholder: '. . .'
        },
        events: {
            'click [data-role=set-year]': function(e) {
                var node = $(e.target);
                var prev = this.get('date');
                var now = helper.getDate(node.attr('data-val'));
                this.set('date', now);
                this.trigger('select', now, prev, node);
            },
            'click .year-disabled': function(e) {
                var node = $(e.target);
                var year = this.get('date');
                var val = helper.getDate(node.attr('data-val'));
                this.trigger('selectDisabled', val, year, node);
            },
            'click [data-role=get-prev-page]': function(e) {
                var prev = this.get('date');
                var now = helper.getDate(prev.getFullYear() - this.get('n'));
                this.set('date', now);
                this.show();
                this.trigger('select', now, prev);
            },
            'click [data-role=get-next-page]': function(e) {
                var prev = this.get('date');
                var now = helper.getDate(prev.getFullYear() + this.get('n'));
                this.set('date', now);
                this.show();
                this.trigger('select', now, prev);
            }
        },
        prev: function() {
            var prev = this.get('date');
            var now = helper.getDate(prev.getFullYear() - 1);
            this.set('date', now);
            this.trigger('select', now, prev);
            return this;
        },
        next: function() {
            var prev = this.get('date');
            var now = helper.getDate(prev.getFullYear() + 1);
            this.set('date', now);
            this.trigger('select', now, prev);
            return this;
        },
        show: function() {
            var year = this.get('date').getFullYear();

            var n = this.get('n');
            var m = this.get('m');
            var row = Math.ceil((n + 2) / m);
            var start = year - year % n;
            var list = [];
            for(var i = 0; i < n; i++) {
                list[i] = {
                    role: 'set-year',
                    value: start + i,
                    disabled: this.get('disabled').call(this, helper.getDate(start + i))
                };
            }
            list.unshift({
                role: 'get-prev-page',
                value: this.get('prevPlaceholder')
            });
            list.push({
                role: 'get-next-page',
                value: this.get('nextPlaceholder')
            });

            var arr = [];
            var flag = 0;
            for(i = 0; i < row; i++) {
                var temp = ['<tr class="widget-calendar-year-column">'];
                for(var j = flag, len = Math.min(flag + m, list.length); j < len; j++, flag++) {
                    var item = list[flag];
                    temp.push('<td ')
                    if(item.disabled === true) {
                        temp.push('class="year-disabled"');
                    } else {
                        temp.push('data-role="' + item.role + '"');
                        if(item.value === year) {
                            temp.push(' class="year-curr"');
                        }
                    }
                    temp.push(' data-val="' + item.value + '"');
                    temp.push('>', item.value, '</td>');
                }
                temp.push('</tr>');
                arr[i] = temp.join('');
            }
            arr.unshift('<table class="widget-calendar-year" data-role="year-panel">');
            arr.push('</table>');

            this.element.html(arr.join('')).show();
            return this;
        }
    });

    module.exports = YearPanel;
});
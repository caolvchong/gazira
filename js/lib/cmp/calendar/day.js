/**
 * User: caolvchong@gmail.com
 * Date: 8/21/13
 * Time: 11:13 AM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var date = require('../../util/date');
    var Widget = require('../widget');

    var helper = {
        getMonthDayCount: function(month, d) {
            var ds = 31;
            if(month == 1) {
                ds = date.isLeap(d.getFullYear()) ? 29 : 28;
            } else if(month == 3 || month == 5 || month == 8 || month == 10) {
                ds = 30;
            }
            return ds;
        }
    };

    var Day = Widget.extend({
        attrs: {
            day: new Date(),
            min: date.stringToDate('1901-01-01', 'yyyy-MM-dd'), // 最小日期限制
            max: date.stringToDate('2099-01-01', 'yyyy-MM-dd'), // 最大日期限制
            week: ['一', '二', '三', '四', '五', '六', '日'],
            weekStart: 7, // 一周的起始，默认星期天
            showWeek: false, // 是否显示星期
            format: 'yyyy-MM-dd', // 默认返回格式
            disabled: function(day) { // function, 返回false的则不可点击
                return date.compare(day, this.get('min')) === 1 || date.compare(day, this.get('max')) === -1;
            }
        },
        events: {
            'click [data-role=set-day]': function(e) {
                var node = $(e.target);
                var prev = date.format(this.get('day'), this.get('format'));
                var day = node.attr('data-val');
                this.set('day', date.stringToDate(day, this.get('format')));
                this.trigger('select', day, prev, node);
            },
            'click .day-disabled': function(e) {
                var node = $(e.target);
                var day = date.format(this.get('day'), this.get('format'));
                var val = node.attr('data-val');
                this.trigger('selectDisabled', val, day, node);
            }
        },
        prev: function() {
            var prev = this.get('day');
            var day = date.distance(this.get('day'), -1);
            this.set('day', day);
            this.trigger('select', day, prev);
            return this;
        },
        next: function() {
            var prev = this.get('day');
            var day = date.distance(this.get('day'), 1);
            this.set('day', day);
            this.trigger('select', day, prev);
            return this;
        },
        show: function() {
            var day = this.get('day');
            var week = this.get('week');
            var month = day.getMonth();
            var curr = day.getDate();
            var html = [];
            var weekdayArray = [];
            var weekArr = [];
            var i;
            for(i = 0; i < 7; i++) {
                var t = this.get('weekStart') + i - 1;
                t = t >= 7 ? t - 7 : t;
                weekArr[i] = t;
                weekdayArray[i] = this.get('week')[t];
            }
            html.push('<tr class="widget-calendar-day-column">');
            if(this.get('showWeek')) {
                html.push('<th></th>');
            }
            for(i = 0; i < 7; i++) {
                html.push('<th class="widget-calendar-day widget-calendar-day-' + weekArr[i] + '">' + weekdayArray[i] + '</th>')
            }
            html.push('</tr>');

            var firstDay = new Date(day.getFullYear(), month, 1);
            var firstDayWeek = firstDay.getDay();
            var index = $.inArray(firstDayWeek, weekArr);
            var startDay = date.distance(firstDay, -index + 1);
            var lastDay = date.distance(firstDay, helper.getMonthDayCount(month, day) - 1);
            var lastDayWeek = lastDay.getDay();
            index = $.inArray(lastDayWeek, weekArr);
            var endDay = date.distance(lastDay, 7 - index);

            var arr = [];
            var weekCount = ((+endDay - startDay) / (3600 * 24 * 1000) + 1) / 7;
            for(i = 0; i < weekCount; i++) {
                var temp = ['<tr class="widget-calendar-date-column">'];
                for(var j = 0; j < 7; j++) {
                    var d = date.distance(startDay, i * 7 + j); // 日期对象
                    var m = d.getMonth(); // 月份
                    var s = date.format(d, this.get('format')); // 日期字符串
                    var n = d.getDate(); // 日期

                    temp.push('<td data-val="' + s + '" ');
                    if(this.get('disabled').call(this, d) === true) {
                        temp.push('class="day-disabled ')
                        temp.push(m === month ? 'curr-month' : m < month ? 'prev-month' : 'next-month');
                    } else {
                        temp.push('data-role="set-day"');
                        temp.push(' class="')
                        if(m === month && n === curr) {
                            temp.push('curr-day ');
                        }
                        temp.push(m === month ? 'curr-month' : m < month ? 'prev-month' : 'next-month');
                    }
                    temp.push('">' + n + '</td>');
                }
                temp.push('</tr>');
                arr[i] = temp.join('');
            }
            arr.unshift(html.join(''));
            arr.unshift('<table class="widget-calendar-date" data-role="date-column">');
            arr.push('</table>');
            this.element.html(arr.join('')).show();
            return this;
        }
    });

    module.exports = Day;
});
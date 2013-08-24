/**
 * User: caolvchong@gmail.com
 * Date: 8/21/13
 * Time: 11:13 AM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var DateUtil = require('../../util/date');
    var Widget = require('../widget');

    var helper = {
        getMonthDayCount: function(month, d) {
            var ds = 31;
            if(month == 1) {
                ds = DateUtil.isLeap(d.getFullYear()) ? 29 : 28;
            } else if(month == 3 || month == 5 || month == 8 || month == 10) {
                ds = 30;
            }
            return ds;
        }
    };

    var defaultFormat = 'yyyy-MM-dd';
    var DatePanel = Widget.extend({
        attrs: {
            date: new Date(),
            week: ['一', '二', '三', '四', '五', '六', '日'],
            weekStart: 1, // 一周的起始，默认星期天
            showWeek: false, // 是否显示星期
            format: defaultFormat, // 默认返回格式
            disabled: function(date) { // function, 返回false的则不可点击
                return false;
            }
        },
        events: {
            'click [data-role=set-date]': function(e) {
                var node = $(e.target);
                var prev = DateUtil.format(this.get('date'), this.get('format'));
                var date = node.attr('data-val');
                this.set('date', DateUtil.stringToDate(date, this.get('format')));
                this.trigger('select', date, prev, node);
            },
            'click .date-disabled': function(e) {
                var node = $(e.target);
                var date = DateUtil.format(this.get('date'), this.get('format'));
                var val = node.attr('data-val');
                this.trigger('selectDisabled', val, date, node);
            }
        },
        prev: function() {
            var prev = this.get('date');
            var date = DateUtil.distance(this.get('date'), -1);
            this.set('date', date);
            this.trigger('select', date, prev);
            return this;
        },
        next: function() {
            var prev = this.get('date');
            var date = DateUtil.distance(this.get('date'), 1);
            this.set('date', date);
            this.trigger('select', date, prev);
            return this;
        },
        show: function() {
            var date = this.get('date');
            var week = this.get('week');
            var month = date.getMonth();
            var curr = date.getDate();
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
            html.push('<tr class="widget-calendar-date-column">');
            if(this.get('showWeek')) {
                html.push('<th></th>');
            }
            for(i = 0; i < 7; i++) {
                html.push('<th class="widget-calendar-date widget-calendar-date-' + weekArr[i] + '">' + weekdayArray[i] + '</th>')
            }
            html.push('</tr>');

            var firstDay = new Date(date.getFullYear(), month, 1);
            var firstDayWeek = firstDay.getDay();
            var index = $.inArray(firstDayWeek, weekArr);
            index = index === 0 ? 7 : index;
            var startDay = DateUtil.distance(firstDay, -index + 1);
            var lastDay = DateUtil.distance(firstDay, helper.getMonthDayCount(month, date) - 1);
            var lastDayWeek = lastDay.getDay();
            index = $.inArray(lastDayWeek, weekArr);
            var endDay = DateUtil.distance(lastDay, 7 - index);

            var arr = [];
            var weekCount = ((+endDay - startDay) / (3600 * 24 * 1000) + 1) / 7;
            for(i = 0; i < weekCount; i++) {
                var temp = ['<tr class="widget-calendar-date-panel">'];
                for(var j = 0; j < 7; j++) {
                    var d = DateUtil.distance(startDay, i * 7 + j); // 日期对象
                    var m = d.getMonth(); // 月份
                    var s = DateUtil.format(d, this.get('format')); // 日期字符串
                    var n = d.getDate(); // 日期

                    temp.push('<td data-val="' + s + '" ');
                    if(this.get('disabled').call(this, d) === true) {
                        temp.push('class="date-disabled ')
                        temp.push(m === month ? 'curr-month' : m < month ? 'prev-month' : 'next-month');
                    } else {
                        temp.push('data-role="set-date"');
                        temp.push(' class="')
                        if(m === month && n === curr) {
                            temp.push('curr-date ');
                        }
                        temp.push(m === month ? 'curr-month' : m < month ? 'prev-month' : 'next-month');
                    }
                    temp.push('">' + n + '</td>');
                }
                temp.push('</tr>');
                arr[i] = temp.join('');
            }
            arr.unshift(html.join(''));
            arr.unshift('<table class="widget-calendar-date" data-role="date-panel">');
            arr.push('</table>');
            this.element.html(arr.join('')).show();
            return this;
        }
    });

    module.exports = DatePanel;
});
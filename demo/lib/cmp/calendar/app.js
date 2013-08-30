/**
 * User: caolvchong@gmail.com
 * Date: 7/3/13
 * Time: 8:46 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Calendar = require('../../../../js/lib/cmp/calendar/calendar');
    var DoubleCalendar = require('../../../../js/lib/cmp/calendar/double-calendar');

    $(function() {
        // 简单实例
        new Calendar({
            trigger: '#cal1'
        });

        // 日期禁用
        new Calendar({
            trigger: '#cal2',
            disabled: {
                date: function(date) {
                    return date.getDay() === 0;
                },
                year: function(date) {
                    var year = date.getFullYear();
                    return year < 2011 || year > 2019;
                }
            }
        });

        // 无输入框触发
        new Calendar({
            trigger: '#cal3',
            output: '#output3'
        });

        // 直接显示
        var c = new Calendar({
            parentNode: '#show4',
            repositionOnResize: false
        });
        c.show();
        c.element.css('position', 'static');

        // 初始化日期
        new Calendar({
            trigger: '#cal5',
            date: '2012-12-25'
        });

        // 日期格式化输出
        new Calendar({
            trigger: '#cal6',
            format: 'yyyy年MM月dd那个日'
        });

        // 时间选择
        new Calendar({
            trigger: '#cal7',
            time: true
        });

        // 一些事件
        new Calendar({
            trigger: '#cal8'
        }).on('selectDate', function(date) {
                $('#output8').text('日期选择了...' + date);
            });

        // 双日历
        var c9_1 = new Calendar({
            trigger: '#cal9_1',
            disabled: {
                date: function(date) {
                    return +date > +c9_2.get('date');
                }
            }
        });
        var c9_2 = new Calendar({
            trigger: '#cal9_2',
            disabled: {
                date: function(date) {
                    return +date < +c9_1.get('date');
                }
            }
        });

        // 国际化
        new Calendar({
            trigger: '#cal10',
            i18n: {
                week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            }
        });

        // 年选择
        new Calendar({
            trigger: '#cal11',
            view: 'year'
        });

        // 月选择
        new Calendar({
            trigger: '#cal12',
            view: 'month'
        });

        // 月选择双日历
        var c13_1 = new Calendar({
            trigger: '#cal13_1',
            view: 'month',
            disabled: {
                month: function(date) {
                    return +date >= +c13_2.get('date');
                }
            }
        });
        var c13_2 = new Calendar({
            trigger: '#cal13_2',
            view: 'month',
            disabled: {
                month: function(date) {
                    return +date <= +c13_1.get('date');
                }
            }
        });

        // 另一种双日历：日期选择
        new DoubleCalendar({
            trigger: '#cal14'
        }).on('submit', function(date1, date2) {
            $(this.get('trigger')).val(date1 + '===' + date2);
        });

        // 另一种双日历：月份选择
        new DoubleCalendar({
            view: 'month',
            trigger: '#cal15'
        }).on('submit', function(date1, date2) {
                $(this.get('trigger')).val(date1 + '===' + date2);
            });

        // 另一种双日历：年份选择
        new DoubleCalendar({
            view: 'year',
            trigger: '#cal16'
        }).on('submit', function(date1, date2) {
                $(this.get('trigger')).val(date1 + '===' + date2);
            });
    });
});
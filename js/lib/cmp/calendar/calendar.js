/**
 * User: caolvchong@gmail.com
 * Date: 8/22/13
 * Time: 9:44 AM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var DateUtil = require('../../util/date');
    var Overlay = require('../overlay');
    var DatePanel = require('./date-panel');
    var MonthPanel = require('./month-panel');
    var YearPanel = require('./year-panel');
    var TimePanel = require('./time-panel');
    var tpl = {
        calendar: require('./tpl/calendar'),
        bar: require('./tpl/bar')
    };

    var defaultFormat = 'yyyy-MM-dd';
    var defalutBar = {
        display: {
            clear: true,
            ok: true
        },
        text: {
            clear: '清除',
            ok: '确定'
        }
    };

    var helper = {
        /**
         * 获取一个日期
         * @param params
         * @returns {*}
         */
        setDate: function(params) {
            var fn = function(a, b, undef) {
                return a === undef ? b : a;
            };
            var d = this.get('date');
            var result;
            if(params.date) {
                var str = params.date;
                var format = defaultFormat;
                if(this.times) {
                    str += ' ' + this.times.output();
                    format += ' ' + 'HH:mm:ss';
                }
                result = DateUtil.stringToDate(str, format);
            } else {
                if(this.times) {
                    result = new Date(fn(params.year, d.getFullYear()), fn(params.month, d.getMonth()), d.getDate(), fn(params.hour, this.times.get('hour')), fn(params.minute, this.times.get('minute')), fn(params.second, this.times.get('second')));
                } else {
                    result = new Date(fn(params.year, d.getFullYear()), fn(params.month, d.getMonth()), d.getDate());
                }
            }
            this.set('date', result);
            return result;
        },
        output: function() {
            var output = $(this.get('output'));
            var value = output.val() || output.text();
            if(value) {
                return DateUtil.stringToDate(value, this.get('format'));
            }
        }
    };

    var Calendar = Overlay.extend({
        attrs: {
            date: {
                value: '',
                getter: function(val) {
                    return val || helper.output.call(this) || new Date();
                },
                setter: function(val) {
                    if(!val) {
                        val = new Date();
                    } else if(typeof val === 'string') {
                        val = DateUtil.stringToDate(val, this.get('format')) || val;
                    }
                    return val;
                }
            },
            trigger: null,
            triggerType: 'click',
            output: {
                value: '',
                getter: function(val) {
                    val = val ? val : this.get('trigger');
                    return $(val);
                }
            },
            mode: 'dates',
            hideOnSelect: true,
            time: false, // 是否显示时间，true显示时分，细粒度控制则传入一个对象{hour: true, minute: true, second: false},
            format: defaultFormat, // 输出格式
            template: tpl.calendar.render(),
            align: {
                getter: function(val) {
                    var trigger = $(this.get('trigger'));
                    var parentNode = $(this.get('parentNode'));
                    var baseElement;
                    var baseXY = [0, 0];
                    if(trigger && trigger[0]) {
                        baseElement = trigger;
                        baseXY = [0, trigger.height() + 10];
                    } else if(parentNode && parentNode[0]) {
                        baseElement = parentNode;
                    }
                    return {
                        selfXY: [0, 0],
                        baseElement: baseElement,
                        baseXY: baseXY
                    };
                }
            },
            // 底部按钮栏，默认不显示。当time设置后会自动开启。bar开启后，hideOnSelect会自动转为false
            bar: {
                display: false, // {clear: true, ok: true} 表示：清除,确定按钮的显示与否
                text: defalutBar.text
            },
            disabled: { // date, month, year
                date: function(date) {
                    return false;
                },
                month: function(date) {
                    return false;
                },
                year: function(date) {
                    return false;
                }
            },
            i18n: {},
            view: 'date' // year: 年选择器；month: 年月选择器；date: 正常的日期选择器
        },
        events: {
            'click [data-role=current-month]': function(e) {
                this.renderContainer(this.get('mode') === 'months' ? this.get('view') + 's' : 'months');
            },
            'click [data-role=current-year]': function(e) {
                this.renderContainer(this.get('mode') === 'years' ? this.get('view') + 's' : 'years');
            },
            'click [data-role=prev-year]': function(e) {
                this.years.prev();
                this.renderContainer(this.get('mode'));
            },
            'click [data-role=next-year]': function(e) {
                this.years.next();
                this.renderContainer(this.get('mode'));
            },
            'click [data-role=prev-month]': function(e) {
                this.months.prev();
                this.renderContainer(this.get('mode'));
            },
            'click [data-role=next-month]': function(e) {
                this.months.next();
                this.renderContainer(this.get('mode'));
            },
            'click [data-role="btn-clear"]': function(e) {
                this.output('');
                this.hide();
            },
            'click [data-role="btn-ok"]': function(e) {
                this.output();
                this.hide();
            }
        },
        setup: function() {
            Calendar.superclass.setup.call(this);
            var self = this;
            var container = this.element.find('[data-role=container]');
            var d = this.get('date');
            var bar = this.get('bar');
            var view = this.get('view');
            var mode = view + 's';

            (function(time) { // 存在时间显示的情况下设置默认格式
                if(time) {
                    if(this.get('format') === defaultFormat) {
                        if(time === true) {
                            this.set('time', {
                                hour: true,
                                minute: true
                            });
                            this.set('format', defaultFormat + ' ' + 'HH:mm');
                        } else {
                            var arr = [];
                            time.hour = time.hour !== false;
                            time.minute = time.minute !== false;
                            time.second = time.second === true;
                            time.hour && arr.push('HH');
                            time.minute && arr.push('mm');
                            time.second && arr.push('ss');
                            this.set('format', defaultFormat + ' ' + arr.join(':'));
                        }
                    }
                    bar.display = true;
                }
            }).call(this, this.get('time'));

            (function(bar) { // 底部按钮栏控制，开启底部按钮，则选择日期后隐藏日历功能关闭
                if(bar === true) {
                    this.set('bar', defalutBar);
                    bar = this.get('bar');
                }
                if(bar.display === true) {
                    bar.display = defalutBar.display;
                }
                if(bar.display) {
                    this.set('hideOnSelect', false);
                    container.after(tpl.bar.render({
                        bar: bar
                    }));
                }
            }).call(this, bar);

            (function(view) { // 根据模式自动调整输出格式
                if(this.get('format') === defaultFormat) {
                    if(view === 'month') {
                        this.set('format', 'yyyy-MM');
                    } else if(view === 'year') {
                        this.set('format', 'yyyy');
                    }
                }
                if(typeof this.get('date') === 'string') { // 由于date的setter先于setup，而那时format还未自动处理，这里需要额外处理
                    this.set('date', DateUtil.stringToDate(this.get('date'), this.get('format')));
                }
            }).call(this, view);

            this._setPosition();
            this.enable();

            var disabled = this.get('disabled');

            this.set('mode', mode);

            this.dates = new DatePanel({
                date: d,
                week: this.get('i18n').week,
                weekStart: this.get('weekStart'),
                disabled: function(date) {
                    return disabled.date.call(self, date) || disabled.month.call(self, date) || disabled.year.call(self, date);
                },
                parentNode: container
            }).render();
            this.months = new MonthPanel({
                date: d,
                months: this.get('i18n').months,
                disabled: function(date) {
                    return disabled.month.call(self, date) || disabled.year.call(self, date);
                },
                parentNode: container
            }).render();
            this.years = new YearPanel({
                date: d,
                prevPlaceholder: this.get('i18n').prevPlaceholder,
                nextPlaceholder: this.get('i18n').nextPlaceholder,
                disabled: function(date) {
                    return disabled.year.call(self, date);
                },
                parentNode: container
            }).render();

            if(this.get('time')) {
                this.times = new TimePanel({
                    parentNode: container,
                    display: this.get('time')
                }).render();
                this.times.on('change', function(hour, minute, second) {
                    helper.setDate.call(self, {
                        hour: hour,
                        minute: minute,
                        second: second
                    });
                });
            }

            this.dates.on('select', function(now, prev, node) {
                var d = helper.setDate.call(self, {
                    date: now
                });
                self.renderPannel();
                if(node) {
                    self.renderContainer(mode);
                    self.get('hideOnSelect') && mode === 'dates' ? self.output() : self.trigger('selectDate', d);
                }
                return false;
            });
            this.months.on('select', function(now, prev, node) {
                var d = helper.setDate.call(self, {
                    year: now.getFullYear(),
                    month: now.getMonth()
                });
                self.renderPannel();
                if(node && node.attr('data-role') === 'set-month') {
                    self.renderContainer(mode);
                    self.get('hideOnSelect') && mode === 'months' ? self.output() : self.trigger('selectMonth', d);
                }
            });
            this.years.on('select', function(now, prev, node) {
                var d = helper.setDate.call(self, {
                    year: now.getFullYear()
                });
                self.renderPannel();
                if(node && node.attr('data-role') === 'set-year') {
                    self.renderContainer(mode);
                    self.get('hideOnSelect') && mode === 'years' ? self.output() : self.trigger('selectYear', d);
                }
            });
        },
        show: function() {
            if(!this.rendered) {
                this.render();
            }
            var value = helper.output.call(this) || this.get('date');
            this.set('date', value);
            this.renderPannel();
            this.renderContainer(this.get('mode'));

            Calendar.superclass.show.call(this);
            this.trigger('show');
            return this;
        },
        renderPannel: function() {
            var monthPannel = this.element.find('[data-role=current-month]');
            var yearPannel = this.element.find('[data-role=current-year]');

            var date = this.get('date');
            var month = date.getMonth();
            var year = date.getFullYear();

            monthPannel.text(this.months.get('months')[month]);
            yearPannel.text(year);
        },
        renderContainer: function(mode) {
            var bar = this.$('[data-role=bar]');
            var d = this.get('date');
            this.set('mode', mode);

            this.dates.element.hide();
            this.months.element.hide();
            this.years.element.hide();
            this.times && this.times.element.hide();
            bar.hide();

            this.dates.set('date', d);
            this.months.set('date', d);
            this.years.set('date', d);

            if(mode === 'dates') {
                this.dates.show();
                this.times && this.times.show();
                bar.show();
            } else if(mode === 'months') {
                this.months.show();
            } else if(mode === 'years') {
                this.years.show();
            }
            return this;
        },
        refresh: function() {
            this.renderPannel();
            this.renderContainer(this.get('mode'));
            return this;
        },

        enable: function() {
            var trigger = $(this.get('trigger'));
            if(trigger && trigger[0]) {
                var self = this;
                var event = this.get('triggerType') + '.calendar';
                trigger.on(event, function(e) {
                    self.show();
                    e.preventDefault();
                });
                this._blurHide(this.get('trigger'));
            }
        },

        disable: function() {
            var trigger = $(this.get('trigger'));
            if(trigger && trigger[0]) {
                var event = this.get('triggerType') + '.calendar';
                trigger.off(event);
            }
        },

        output: function(val, undef) {
            var output = this.get('output');
            var view = this.get('view');
            if(!output.length) {
                return;
            }
            var tagName = output[0].tagName.toLowerCase();
            val = (val === null || val === undef) ? this.get('date') : val;

            var result = val.getDate ? DateUtil.format(val, this.get('format')) : val;
            output[(tagName === 'input' || tagName === 'textarea') ? 'val' : 'text'](result);
            if(this.get('hideOnSelect')) {
                this.hide();
            }
            this.trigger('select' + view.replace(/[a-z]/, function(s) {
                return s.toUpperCase();
            }), typeof val === 'string' ? DateUtil.stringToDate(val) || '' : val);
        }
    });

    module.exports = Calendar;
});
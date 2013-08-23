/**
 * User: caolvchong@gmail.com
 * Date: 8/22/13
 * Time: 9:44 AM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var date = require('../../util/date');
    var Overlay = require('../overlay');
    var Day = require('./day');
    var Month = require('./month');
    var Year = require('./year');
    var Time = require('./time');
    var Bar = require('./bar');
    var tpl = require('./tpl/calendar');

    var defaultFormat = 'yyyy-MM-dd';

    var helper = {
        setDate: function(d, params) {
            var fn = function(a, b, undef) {
                return a === undef ? b : a;
            };
            if(params.date) {
                return date.stringToDate(params.date);
            }
            return new Date(fn(params.year, d.getFullYear()), fn(params.month, d.getMonth()), d.getDate());
        }
    };

    var Calendar = Overlay.extend({
        attrs: {
            date: new Date(),
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
            time: true, // 是否显示时间，true显示时分，细粒度控制则传入一个对象{hour: true, minute: true, second: false},
            format: defaultFormat, // 输出格式
            template: tpl.render(),
            align: {
                getter: function(val) {
                    var trigger = $(this.get('trigger'));
                    if(trigger && trigger[0]) {
                        return {
                            selfXY: [0, 0],
                            baseElement: trigger,
                            baseXY: [0, trigger.height() + 10]
                        };
                    }
                    return {
                        selfXY: [0, 0],
                        baseXY: [0, 0]
                    };
                }
            },
            // 底部按钮栏，默认不显示。当time设置后会自动开启。bar开启后，hideOnSelect会自动转为false
            // bar具体配置 {clear: true, today: false, ok: true} 表示：清除，今天，确定按钮的显示与否
            bar: false
        },
        events: {
            'click [data-role=current-month]': function(e) {
                this.renderContainer(this.get('mode') === 'months' ? 'dates' : 'months');
            },
            'click [data-role=current-year]': function(e) {
                this.renderContainer(this.get('mode') === 'years' ? 'dates' : 'years');
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
            }
        },
        setup: function() {
            Calendar.superclass.setup.call(this);
            var self = this;
            var container = this.element.find('[data-role=container]');
            var d = this.get('date');

            (function(time) { // 存在时间显示的情况下设置默认格式
                if(time) {
                    if(this.get('format') === defaultFormat) {
                        if(time === true) {
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
                }
            }).call(this, this.get('time'));

            this._setPosition();
            this.enable();

            this.dates = new Day({
                day: d,
                parentNode: container
            }).render();
            this.months = new Month({
                month: d.getMonth(),
                parentNode: container
            }).render();
            this.years = new Year({
                year: d.getFullYear(),
                parentNode: container
            }).render();

            if(this.get('time')) {
                this.times = new Time({
                    parentNode: container,
                    display: this.get('time')
                }).render();
                this.bars = new Bar({
                    calendar: this,
                    parentNode: container,
                    display: this.get('bar') || {},
                    text: this.get('barText')
                }).render();
            }

            this.dates.on('select', function(val, prev, node) {
                var d = helper.setDate(self.get('date'), {
                    date: val
                });
                self.set('date', d);
                self.renderPannel();
                if(node) {
                    self.renderContainer('dates');
                    self.output();
                    self.trigger('selectDate', d);
                }
                return false;
            });
            this.months.on('select', function(val, prev, node) {
                var d = helper.setDate(self.get('date'), {
                    month: val
                });
                self.set('date', d);
                self.renderPannel();
                if(node && node.attr('data-role') === 'set-month') {
                    self.renderContainer('dates');
                    self.trigger('selectMonth', d);
                }
            });
            this.years.on('select', function(val, prev, node) {
                var d = helper.setDate(self.get('date'), {
                    year: val
                });
                self.set('date', d);
                self.renderPannel();
                if(node && node.attr('data-role') === 'set-year') {
                    self.renderContainer('dates');
                    self.trigger('selectYear', d);
                }
            });
            this.renderPannel();
            this.renderContainer('dates');
        },
        show: function() {
            if(!this.rendered) {
                this.render();
            }
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

            monthPannel.text(this.months.get('list')[month]);
            yearPannel.text(year);
        },
        renderContainer: function(mode) {
            var d = this.get('date');
            this.set('mode', mode);

            this.dates.element.hide();
            this.months.element.hide();
            this.years.element.hide();
            this.times.element.hide();
            this.dates.set('day', d);
            this.months.set('month', d.getMonth());
            this.years.set('year', d.getFullYear());

            if(mode === 'dates') {
                this.dates.show();
                this.times.show();
                this.bars.show();
            } else if(mode === 'months') {
                this.months.show();
            } else if(mode === 'years') {
                this.years.show();
            }
            return this;
        },

        enable: function() {
            var trigger = $(this.get('trigger'));
            if(trigger && trigger[0]) {
                var self = this;
                var event = this.get('triggerType') + '.calendar';
                trigger.on(event, function() {
                    self.show();
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
            if(!output.length) {
                return;
            }
            var tagName = output[0].tagName.toLowerCase();
            val = (val === null || val === undef) ? this.get('date') : val;
            output[(tagName === 'input' || tagName === 'textarea') ? 'val' : 'text'](val.getDate ? date.format(val, this.get('format')) : val);
            if(this.get('hideOnSelect')) {
                this.hide();
            }
        }
    });

    module.exports = Calendar;
});
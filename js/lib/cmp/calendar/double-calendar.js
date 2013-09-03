/**
 * User: caolvchong@gmail.com
 * Date: 8/29/13
 * Time: 8:53 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var DateUtil = require('../../util/date');
    var Overlay = require('../overlay');
    var Calendar = require('./calendar');
    var tpl = require('./tpl/double-calendar');

    var DoubleCalendar = Overlay.extend({
        attrs: {
            trigger: null,
            view: 'date',
            template: tpl.render(),
            hideOnSelect: true,
            c1: {
                date: new Date()
            },
            c2: {
                date: new Date()
            },
            align: {
                getter: function(val) {
                    var trigger = $(this.get('trigger'));
                    var parentNode = $(this.get('parentNode'));
                    var baseElement;
                    var baseXY = [0, 0];
                    if(trigger && trigger[0]) {
                        baseElement = trigger;
                        baseXY = [0, trigger.height() + 10];
                    } else if(parentNode[0] !== document.body) {
                        baseElement = parentNode;
                    }
                    return {
                        selfXY: [0, 0],
                        baseElement: baseElement,
                        baseXY: baseXY
                    };
                }
            }
        },
        events: {
            'click [data-role=submit]': function() {
                this.trigger('submit', DateUtil.format(this.c1.get('date'), this.c1.get('format')), DateUtil.format(this.c2.get('date'), this.c2.get('format')));
                this.get('hideOnSelect') && this.hide();
            }
        },
        setup: function() {
            var self = this;
            var obj = {
                hideOnSelect: false,
                view: this.get('view'),
                repositionOnResize: false
            };
            var disable = {
                c1: function(date1) {
                    var date2 = self.c2.get('date');
                    var mode = this.get('mode');
                    var year = date2.getFullYear();
                    var month = mode !== 'years' ? date2.getMonth() : 0;
                    var date = mode === 'dates' ? date2.getDate() : 1;
                    date2 = new Date(year, month, date);
                    return +date1 > +date2;
                },
                c2: function(date2) {
                    var date1 = self.c1.get('date');
                    var mode = this.get('mode');
                    var year = date1.getFullYear();
                    var month = mode !== 'years' ? date1.getMonth() : 0;
                    var date = mode === 'dates' ? date1.getDate() : 1;
                    date1 = new Date(year, month, date);
                    return +date2 < +date1;
                }
            };
            var trigger = $(this.get('trigger'));

            DoubleCalendar.superclass.setup.call(this);

            $.each([1, 2], function(i, v) {
                var which = 'c' + v;
                self[which] = new Calendar($.extend({
                    parentNode: self.$('[data-role="calendar-' + v + '"]'),
                    date: self.get(which).date,
                    disabled: {
                        date: disable[which],
                        month: disable[which],
                        year: disable[which]
                    }
                }, obj));
            });

            if(trigger && trigger[0]) {
                trigger.on('click', function(e) {
                    self.show();
                    e.preventDefault();
                });
                this._blurHide(this.get('trigger'));
            }

            $.each(['Date', 'Month', 'Year'], function(i, v) {
                self.c1.on('select' + v, function() {
                    self.c2.refresh();
                });
                self.c2.on('select' + v, function() {
                    self.c1.refresh();
                });
            });
        },
        show: function() {
            if(!this.rendered) {
                this.render();
            }

            this.c1.show();
            this.c1.element.css('position', 'static');

            this.c2.show();
            this.c2.element.css('position', 'static');
            DoubleCalendar.superclass.show.call(this);
            return this;
        }
    });

    module.exports = DoubleCalendar;
});
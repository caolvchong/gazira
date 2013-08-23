/**
 * User: caolvchong@gmail.com
 * Date: 8/23/13
 * Time: 7:45 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Widget = require('../widget');
    var tpl = require('./tpl/bar');

    var Bar = Widget.extend({
        attrs: {
            calendar: null,
            display: {
                clear: true,
                today: false,
                ok: true
            },
            text: {
                clear: '清除',
                today: '今天',
                ok: '确定'
            }
        },
        events: {
            'click [data-role]': function(e) {
                var role = $(e.target).attr('data-role').replace('btn-', '');
                var calendar = this.get('calendar');
                if(calendar) {
                    calendar.output(role === 'clear' ? '' : role === 'today' ? new Date() : null);
                }
            }
        },
        show: function() {
            this.element.html(tpl.render({
                display: this.get('display'),
                text: this.get('text')
            }));
            return this;
        }
    });

    module.exports = Bar;
});
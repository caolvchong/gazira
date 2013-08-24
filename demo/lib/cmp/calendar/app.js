/**
 * User: caolvchong@gmail.com
 * Date: 7/3/13
 * Time: 8:46 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Calendar = require('../../../../js/lib/cmp/calendar/calendar');

    $(function() {
        new Calendar({
            trigger: '#cal1'
        });


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


        new Calendar({
            trigger: '#cal3',
            output: '#output1'
        });


        var c = new Calendar({
            parentNode: '#show1'
        }).set('align', {
            baseElement: '#show1',
            selfXY: ['center', 'top'],
            baseXY: ['center', 'bottom']
        });
        c.show();
        c.element.css('position', 'static');
    });
});
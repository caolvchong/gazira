/**
 * User: caolvchong@gmail.com
 * Date: 7/3/13
 * Time: 8:46 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Year = require('../../../../js/lib/cmp/calendar/year');
    var Month = require('../../../../js/lib/cmp/calendar/month');
    var Day = require('../../../../js/lib/cmp/calendar/day');
    var Time = require('../../../../js/lib/cmp/calendar/time');

    var Calendar = require('../../../../js/lib/cmp/calendar/calendar');

    $(function() {
        /*
         var y = new Year({
         disabled: function(year) {
         return year % 7 === 0;
         }
         }).render().show();

         y.on('select', function(val, pre) {
         console.log('之前年：' + pre + '，现在：' + val);
         });
         y.on('selectDisabled', function(val, year) {
         console.log('点击不可选年：' + val + '，当前年：' + year);
         });

         // ------------------------------------------------------

         var m = new Month({
         disabled: function(month) {
         return month % 7 === 0;
         }
         }).render().show();

         m.on('select', function(val, pre) {
         console.log('之前月：' + pre + '，现在：' + val);
         });

         // ------------------------------------------------------

         var d = new Day({
         disabled: function(date) {
         return date.getDate() % 7 === 0;
         }
         }).render().show();

         d.on('select', function(val, pre) {
         console.log('之前日期：' + pre + '，现在：' + val);
         });

         // ------------------------------------------------------

         var t = new Time().render().show();
         t.on('change', function(hour, minute, second, h, m, s) {
         console.log(arguments);
         });
         */
        // ------------------------------------------------------

        var c = new Calendar({
            trigger: '#cal1',
            time: {
                second: true
            }
        });

    });
});
define(function(require, exports, module) {
    var $ = require('$');
    var Timer = require('../../../../js/lib/util/timer');

    $(function() {
        var r1 = 0;
        var t1 = Timer.debounce(function(name) {
            console.log(name);
            if(r1 < 3) {
                t1(name);
            }
            return r1++;
        }, 3000);

        $('#btn1').click(function() {
            var res = t1('Tom');
            console.log(res);
        });

        var r2 = 0;
        var t2 = Timer.throttle(function(name) {
            console.log(name);
            return r2++;
        }, 3000);

        $('#btn2').click(function() {
            var res = t2('Jerry');
            console.log(res);
        });
    });
});
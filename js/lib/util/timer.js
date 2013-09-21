/**
 * User: caolvchong@gmail.com
 * Date: 7/5/13
 * Time: 10:23 AM
 */
define(function(require, exports, module) {
    var Timer = {
        /**
         * 单位时间间隔wait 内最多只能执行一次fn
         * 如果单位时间内多次触发，接受第一次，此时第二次，第二次将在第一次执行完wait后执行
         * 若在第二次等待过程中，第三次进来，则第二次会被放弃（参数被替换）
         * 同理，多次进来，第一次执行后等待wait，执行的总是最后一次
         * @param fn
         * @param wait
         * @returns {Function}
         */
        throttle: function(fn, wait) {
            var context, args, timeout, result;
            var previous = 0;
            var later = function() {
                previous = new Date();
                timeout = null;
                result = fn.apply(context, args);
            };
            return function() {
                var now = new Date();
                var remaining = wait - (now - previous);
                context = this;
                args = arguments; // 参数被替换，因此多次时候，等待的总是用最后一次
                if(remaining <= 0) {
                    clearTimeout(timeout);
                    timeout = null;
                    previous = now;
                    result = fn.apply(context, args);
                } else if(!timeout) {
                    timeout = setTimeout(later, remaining);
                }
                return result;
            };
        },
        /**
         * 单位时间wait 内触发多次fn的话，前面的fn将被清除，等待使用最后一次触发的fn
         * 如果immediate设置为true，则第一次会立即触发
         * @param fn
         * @param wait
         * @param immediate
         * @returns {Function}
         */
        debounce: function(fn, wait, immediate) {
            var timeout, result;
            return function() {
                var context = this, args = arguments;
                var later = function() {
                    timeout = null;
                    if(!immediate) {
                        result = fn.apply(context, args);
                    }
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if(callNow) {
                    result = fn.apply(context, args);
                }
                return result;
            };
        }
    };
    module.exports = Timer;
});
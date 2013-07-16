/**
 * 提供函数切面功能，代码基本参考自arale的base v1.1.1实现
 * 该类不能直接使用，该类逻辑中使用event功能，提供给base模块调用
 * github: https://github.com/aralejs/base
 * docs: http://aralejs.org/base/
 * User: caolvchong@gmail.com
 * Date: 6/1/13
 * Time: 2:12 PM
 */
define(function(require, exports, module) {
    /**
     * 继承aspect，将给对象提供before和after方法
     */
    var aop = {
        /**
         * 给指定方法methodName绑定before
         */
        before: function(methodName, callback, context) {
            return weave.call(this, 'before', methodName, callback, context);
        },
        /**
         * 给指定方法methodName绑定after
         */
        after: function(methodName, callback, context) {
            return weave.call(this, 'after', methodName, callback, context);
        }
    };
    module.exports = aop;

    var eventSplitter = /\s+/;

    /**
     * @param when {String} before/after
     * @param methodName {String} 方法名，多个方法用空格分割
     * @param callback {Function} 回调函数
     * @param context {Object} 回调函数的作用域
     */
    function weave(when, methodName, callback, context) {
        var names = methodName.split(eventSplitter);
        var name;
        var method;
        while(name = names.shift()) {
            method = getMethod(this, name);
            if(!method.__isAspected) { // 未AOP的进行包裹
                wrap.call(this, name);
            }
            this.on(when + ':' + name, callback, context);
        }
        return this;
    }

    /**
     * 从对象host上查找
     * @param host
     * @param methodName
     */
    function getMethod(host, methodName) {
        var method = host[methodName];
        if(!method) {
            throw new Error('Invalid method name: ' + methodName);
        }
        return method;
    }

    /**
     * 将原来的函数包裹成切面
     * @param methodName
     */
    function wrap(methodName) {
        var old = this[methodName];
        this[methodName] = function() {
            var args = Array.prototype.slice.call(arguments);
            var beforeArgs = ['before:' + methodName].concat(args);
            if(this.trigger.apply(this, beforeArgs) === false) {
                return;
            }
            var ret = old.apply(this, arguments);
            var afterArgs = ['after:' + methodName, ret].concat(args);
            this.trigger.apply(this, afterArgs);
            return ret;
        };
        this[methodName].__isAspected = true;
    }

});

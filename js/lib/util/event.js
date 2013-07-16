/**
 * 提供基本的事件添加on、移除off和触发trigger功能，代码基本参考自arale的event v1.1.0实现
 * github: https://github.com/aralejs/events
 * docs: http://aralejs.org/events/
 * User: caolvchong@gmail.com
 * Date: 6/28/13
 * Time: 2:01 PM
 */
define(function(require, exports, module) {
    var eventSplitter = /\s+/; // 多个事件是用空格来分割

    /**
     * __events {Object} 存放注册过的事件，每个属性名是事件名，属性值是一个数组arr， arr[n]存放回调函数，arr[n+1]存放作用域
     * @constructor
     */
    function Events() {
    }

    module.exports = Events;

    /**
     * 事件注册
     * @param events {String} 事件名，多个事件用空格分割
     * @param callback {Function} 事件对应的回调
     * @param context 事件作用域
     */
    Events.prototype.on = function(events, callback, context) {
        var cache;
        var event;
        var list;
        if(!callback) {
            return this;
        }
        cache = this.__events || (this.__events = {});
        events = events.split(eventSplitter);

        while(event = events.shift()) { // 事件缓存
            list = cache[event] || (cache[event] = []);
            list.push(callback, context);
        }
        return this;
    };
    /**
     * 事件解绑
     * @param events {String} 事件名，多个事件用空格分割
     * @param callback {Function} 事件对应的回调
     * @param context 事件作用域
     */
    Events.prototype.off = function(events, callback, context) {
        var cache;
        var event;
        var list;
        var i;
        if(!(cache = this.__events)) { // 无缓存事件
            return this;
        }
        if(!(events || callback || context)) { // 没有指定事件，则删除所有事件
            delete this.__events;
            return this;
        }

        events = events ? events.split(eventSplitter) : keys(cache); // 事件数组
        while(event = events.shift()) {
            list = cache[event];
            if(!list) { // 未找到注册过匹配的事件
                continue;
            }
            if(!(callback || context)) { // 找到事件，但未指定回调函数
                delete cache[event];
                continue;
            }
            for(i = list.length - 2; i >= 0; i -= 2) { // 找到事件，并指定回调
                if(!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
                    list.splice(i, 2);
                }
            }
        }
        return this;
    };

    /**
     * 事件触发
     * @param events {String} 事件名，多个事件用空格分割
     */
    Events.prototype.trigger = function(events) {
        var cache;
        var event;
        var all;
        var list;
        var i;
        var len;
        var rest = [];
        var returned = {status: true};
        if(!(cache = this.__events)) { // 无注册事件
            return this;
        }
        events = events.split(eventSplitter); // 事件名列表

        for(i = 1, len = arguments.length; i < len; i++) {
            rest[i - 1] = arguments[i];
        }
        while(event = events.shift()) { // event 某个事件名
            if(all = cache.all) { // cache中存在all事件，回调复制一份
                all = all.slice();
            }
            if(list = cache[event]) { // 该事件的回调，复制一份
                list = list.slice();
            }
            callEach(list, rest, this, returned); // 执行对应事件回调
            callEach(all, [event].concat(rest), this, returned); // 执行all事件
        }
        return returned.status;
    };

    /**
     * 给对象或者function提供Event功能
     * @param receiver
     */
    Events.mixTo = function(receiver) {
        receiver = receiver.prototype || receiver;
        var proto = Events.prototype;
        for (var p in proto) {
            if (proto.hasOwnProperty(p)) {
                receiver[p] = proto[p];
            }
        }
    };

    var keys = Object.keys; // 获取某个对象自身拥有的所有的属性名，存入一个数组
    if(!keys) {
        keys = function(o) {
            var result = [];
            for(var name in o) {
                if(o.hasOwnProperty(name)) {
                    result.push(name);
                }
            }
            return result;
        }
    }

    /**
     * 遍历对应事件的回调函数，执行
     * @param list {Array} 某个事件的回调函数列表
     * @param args {Array} 提供给事件回调的参数
     * @param context {Object} 事件作用域
     * @param returned
     */
    function callEach(list, args, context, returned) {
        var r;
        if(list) {
            for(var i = 0, len = list.length; i < len; i += 2) {
                r = list[i].apply(list[i + 1] || context, args);
                r === false && returned.status && (returned.status = false);
            }
        }
    }
});
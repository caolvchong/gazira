/**
 * Base 是一个基础类，提供 Class、Events、Attribute 和 Aspect 支持，代码来自arale的base v1.1.1实现
 * github: https://github.com/aralejs/base
 * docs: http://aralejs.org/base/
 * User: caolvchong@gmail.com
 * Date: 6/27/13
 * Time: 2:12 PM
 */
define(function(require, exports, module) {

    var Class = require('./class');
    var Events = require('./event');
    var Aspect = require('./aspect');
    var Attribute = require('./attribute');

    /**
     * Base具有的方法:
     *     extend
     *     implement
     *
     *     on
     *     off
     *     trigger
     *
     *     before
     *     after
     *
     *     get
     *     set
     *     initAttrs
     *     change
     * 一般实例由 Base.extend 来创建
     * 在没有覆盖initialize的情况下，会增加以下属性：
     *     attrs 用来存放用户自定义的属性，并为他们提供get和set进行存取
     *     需要为属性添加change事件，可以使用 _onChangeXxx 来绑定
     *     默认给各个属性添加切面before/after
     * @type {*}
     */
    var Base = Class.create({
        Implements: [Events, Aspect, Attribute],

        initialize: function(config) {
            this.initAttrs(config);
            parseEventsFromInstance(this, this.attrs); // 注册chage事件 _onChangeXxx，转化为 change:xxx
        },

        destroy: function() {
            this.off();

            for(var p in this) {
                if(this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }

            this.destroy = function() {};
        }
    });

    module.exports = Base;

    /**
     * 将_onChangeXxx属性注册为change:xxx事件
     * @param host
     * @param attrs
     */
    function parseEventsFromInstance(host, attrs) {
        for(var attr in attrs) {
            if(attrs.hasOwnProperty(attr)) {
                var m = '_onChange' + ucfirst(attr);
                if(host[m]) {
                    host.on('change:' + attr, host[m]);
                }
            }
        }
    }

    /**
     * 将首字母转大写
     */
    function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
    }
});

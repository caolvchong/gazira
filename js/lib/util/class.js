/**
 * 提供简洁的 OO 实现，代码来自arale的class v1.1.0实现
 * github: https://github.com/aralejs/class
 * docs: http://aralejs.org/class/
 * User: caolvchong@gmail.com
 * Date: 6/27/13
 * Time: 2:12 PM
 */
define(function(require, exports, module) {
    /**
     * 构造器
     * 函数调用且传参为function类型，则是将该function转化为类形式
     * 其他调用则无行为发生
     */
    function Class(o) {
        if(!(this instanceof Class) && isFunction(o)) {
            return classify(o);
        }
    }
    module.exports = Class;

    /**
     * 静态方法，对properties对象增加Extends，表示继承自Class
     * 调用create返回一个模板类
     */
    Class.extend = function(properties) {
        properties || (properties = {});
        properties.Extends = this; // 使用Create.extend，this指向Class
        return Class.create(properties);
    };

    /**
     * 创建一个类
     * @param parent 可选，指定的父类
     * @param properties 混入属性
     *          特殊属性包括：
     *          initialize: {Function} 初始化
     *          Extends: {Function} 父类构造器
     *          Implements: {Function/Array} 从多个构造器/对象混入属性（构造器取原型，对象直接取属性）
     *          Statics: {Object} 混入对象属性
     * @return {Function} 得到一个模板类F，F具有静态方法
     *          extend: 从F继承，得到的子类S的Extends指向F，子类也是一个模板类
     *          implement:
     */
    Class.create = function(parent, properties) {
        if (!isFunction(parent)) {
            properties = parent;
            parent = null;
        }
        properties || (properties = {});
        parent || (parent = properties.Extends || Class);
        properties.Extends = parent;

        function SubClass() {
            parent.apply(this, arguments);
            if (this.constructor === SubClass && this.initialize) { // 如果constructor是自身并且存在initialize方法，则执行初始化方法
                this.initialize.apply(this, arguments);
            }
        }
        if (parent !== Class) { // 从父类继承，如果有指定属性白名单，则只继承指定的属性
            mix(SubClass, parent, parent.StaticsWhiteList);
        }

        implement.call(SubClass, properties); // 给子类原型增加属性（如果是Class.Mutators中的属性，会执行对应属性方法）

        return classify(SubClass);
    };

    /**
     * 空的构造器，以提供干净的原型链
     */
    function Ctor() {
    }

    // 提供原型对象，判断是处于速度上的考虑
    var createProto = Object['__proto__'] ? function(proto) {
        return {
            '__proto__': proto
        };
    } : function(proto) {
        Ctor.prototype = proto;
        return new Ctor();
    };

    /**
     * 提供Class特殊的几个属性Extends/Implements/Statics
     */
    Class.Mutators = {
        /**
         * 继承某个类
         */
        Extends: function(parent) {
            var existed = this.prototype;
            var proto = createProto(parent.prototype); // 得到一份父类的原型对象
            mix(proto, existed); // 将自身对象混入
            proto.constructor = this; // 保证constructor指向正确
            this.prototype = proto; // 设置原型链
            this.superclass = parent.prototype; // 提供访问父类原型的方法
        },
        /**
         * 从多个类混入原型
         */
        Implements: function(items) {
            isArray(items) || (items = [items]);
            var proto = this.prototype;
            var item;
            while(item = items.shift()) {
                mix(proto, item.prototype || item);
            }
        },
        /**
         * 混入对象属性
         */
        Statics: function(staticProperties) {
            mix(this, staticProperties);
        }
    };

    /**
     * 传入对象properties
     * 如果该对象的属性在Class.Mutators中，则执行该方法，参数是对应的属性值
     * 否则，原型链上增加该属性
     */
    function implement(properties) {
        var key;
        var value;

        for(key in properties) {
            value = properties[key];
            if(Class.Mutators.hasOwnProperty(key)) {
                Class.Mutators[key].call(this, value);
            } else {
                this.prototype[key] = value;
            }
        }
    }

    /**
     * 给cls类增加 extend和implement方法
     */
    function classify(cls) {
        cls.extend = Class.extend;
        cls.implement = implement;
        return cls;
    }

    /**
     * 将对象s中有而对象r中没有的属性（自身非继承的属性），拷贝到r对象中
     * 如果有传递第三个参数wl对象，则是限定拷贝的属性必须在wl中存在
     */
    function mix(r, s, wl) {
        for(var p in s) {
            if(s.hasOwnProperty(p)) {
                if(wl && indexOf(wl, p) === -1) {
                    continue;
                }
                if(p !== 'prototype') { // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
                    r[p] = s[p];
                }
            }
        }
    }

    var toString = Object.prototype.toString;
    var isArray = Array.isArray || function(val) {
        return toString.call(val) === '[object Array]';
    };
    var isFunction = function(val) {
        return toString.call(val) === '[object Function]';
    };
    var indexOf = Array.prototype.indexOf ? function(arr, item) {
        return arr.indexOf(item);
    } : function(arr, item) {
        for(var i = 0, len = arr.length; i < len; i++) {
            if(arr[i] === item) {
                return i;
            }
        }
        return -1;
    }
});
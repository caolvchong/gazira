/**
 * 提供属性操作功能，代码来自arale的base v1.1.1实现
 *  该类不能直接使用，该类逻辑中使用class，event，aspect功能，提供给base模块调用
 * github: https://github.com/aralejs/base
 * docs: http://aralejs.org/base/
 * User: caolvchong@gmail.com
 * Date: 6/1/13
 * Time: 2:12 PM
 */
define(function(require, exports, module) {
    var toString = Object.prototype.toString;
    var hasOwn = Object.prototype.hasOwnProperty;

    /**
     * Detect the JScript [[DontEnum]] bug:
     * In IE < 9 an objects own properties, shadowing non-enumerable ones, are
     * made non-enumerable as well.
     * https://github.com/bestiejs/lodash/blob/7520066fc916e205ef84cb97fbfe630d7c154158/lodash.js#L134-L144
     */
    /** Detect if own properties are iterated after inherited properties (IE < 9) */
    var iteratesOwnLast; // 检测对象属性被枚举遍历时候是否自身的属性是在继承属性的后面
    (function() {
        var props = [];

        function Ctor() {
            this.x = 1;
        }

        Ctor.prototype = {
            valueOf: 1,
            y: 1
        };
        for(var prop in new Ctor()) {
            props.push(prop);
        }
        iteratesOwnLast = props[0] !== 'x';
    }());

    var isArray = Array.isArray || function(val) {
        return toString.call(val) === '[object Array]';
    };

    function isString(val) {
        return toString.call(val) === '[object String]';
    }

    function isFunction(val) {
        return toString.call(val) === '[object Function]';
    }

    function isWindow(o) {
        return o !== null && o === o.window;
    }

    /**
     * 是否是纯粹的对象，非宿主对象等
     * @param o
     */
    function isPlainObject(o) {
        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor
        // property. Make sure that DOM nodes and window objects don't
        // pass through, as well
        if(!o || toString.call(o) !== '[object Object]' || o.nodeType || isWindow(o)) {
            return false;
        }

        try { // Not own constructor property must be Object
            if(o.constructor && !hasOwn.call(o, 'constructor') && !hasOwn.call(o.constructor.prototype, 'isPrototypeOf')) {
                return false;
            }
        } catch(e) { // IE8,9 Will throw exceptions on certain host objects #9897
            return false;
        }

        var key;

        // Support: IE<9
        // Handle iteration over inherited properties before own properties.
        // http://bugs.jquery.com/ticket/12199
        if(iteratesOwnLast) {
            for(key in o) {
                return hasOwn.call(o, key);
            }
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.
        for(key in o) {}

        return key === undefined || hasOwn.call(o, key);
    }

    /**
     * 是否是空对象
     * @param o
     * @returns {boolean}
     */
    function isEmptyObject(o) {
        if(!o || toString.call(o) !== '[object Object]' || o.nodeType || isWindow(o) || !o.hasOwnProperty) {
            return false;
        }

        for(var p in o) {
            if(o.hasOwnProperty(p)) {
                return false;
            }
        }
        return true;
    }

    /**
     * 合并对象
     * @param receiver 目标对象
     * @param supplier 源对象
     */
    function merge(receiver, supplier) {
        var key;
        var value;
        for(key in supplier) {
            if(supplier.hasOwnProperty(key)) {
                value = supplier[key];
                // 只 clone 数组和 plain object，其他的保持不变
                if(isArray(value)) {
                    value = value.slice();
                } else if(isPlainObject(value)) { // 属性值都是对象，递归
                    var prev = receiver[key];
                    isPlainObject(prev) || (prev = {});
                    value = merge(prev, value);
                }
                receiver[key] = value;
            }
        }
        return receiver;
    }

    var keys = Object.keys;

    if(!keys) {
        keys = function(o) {
            var result = [];

            for(var name in o) {
                if(o.hasOwnProperty(name)) {
                    result.push(name);
                }
            }
            return result;
        };
    }

    function mergeInheritedAttrs(attrs, instance, specialProps) {
        var inherited = [];
        var proto = instance.constructor.prototype; // 当前对象的原型

        while(proto) {
            if(!proto.hasOwnProperty('attrs')) {
                proto.attrs = {};
            }

            copySpecialProps(specialProps, proto.attrs, proto); // 将 proto 上的特殊 properties 放到 proto.attrs 上，以便合并

            if(!isEmptyObject(proto.attrs)) { // 为空时不添加，inherited拥有了原型链上所有指定的属性集合
                inherited.unshift(proto.attrs);
            }

            proto = proto.constructor.superclass; // 向上回溯一级
        }

        // Merge and clone default values to instance.
        for(var i = 0, len = inherited.length; i < len; i++) {
            merge(attrs, normalize(inherited[i]));
        }
    }

    /**
     * 将用户配置对象合并入属性对象
     * @param attrs 属性对象
     * @param config 用户配置对象
     */
    function mergeUserValue(attrs, config) {
        merge(attrs, normalize(config, true));
    }

    /**
     * 从supplier拷贝指定的属性到receiver上
     * @param specialProps {Array} 指定的属性列表
     * @param receiver {Object} 目标对象
     * @param supplier {Object} 源对象
     * @param isAttr2Prop
     */
    function copySpecialProps(specialProps, receiver, supplier, isAttr2Prop) {
        for(var i = 0, len = specialProps.length; i < len; i++) {
            var key = specialProps[i];

            if(supplier.hasOwnProperty(key)) {
                receiver[key] = isAttr2Prop ? receiver.get(key) : supplier[key];
            }
        }
    }

    var EVENT_PATTERN = /^(on|before|after)([A-Z].*)$/; // 事件正则
    var EVENT_NAME_PATTERN = /^(Change)?([A-Z])(.*)/; // 事件名正则，包括 Change 和 其他大写字母开头 的事件

    /**
     * 解析属性中的事件或切面，进行绑定
     * @param host 对象
     * @param attrs 属性对象
     */
    function parseEventsFromAttrs(host, attrs) {
        for(var key in attrs) {
            if(attrs.hasOwnProperty(key)) {
                var value = attrs[key].value;
                var m;
                if(isFunction(value) && (m = key.match(EVENT_PATTERN))) {
                    host[m[1]](getEventName(m[2]), value); // 执行 host.on/before/after(事件名, value)，这样就绑定了事件或切面
                    delete attrs[key];
                }
            }
        }
    }

    /**
     * 格式化事件名，例如：
     * 将 Show 转化为 show
     * 将 ChangeTitle 转化为 change:title
     * @param name
     * @returns {string}
     */
    function getEventName(name) {
        var m = name.match(EVENT_NAME_PATTERN);
        var ret = m[1] ? 'change:' : '';
        ret += m[2].toLowerCase() + m[3];
        return ret;
    }

    /**
     * 设置属性初始化的值
     * @param host {Object} 当前对象，具有set方法
     * @param attrs {Object} 属性对象
     * @param config {Object} 用户配置对象
     */
    function setSetterAttrs(host, attrs, config) {
        var options = { silent: true };
        host.__initializingAttrs = true;

        for(var key in config) {
            if(config.hasOwnProperty(key)) {
                if(attrs[key].setter) {
                    host.set(key, config[key], options);
                }
            }
        }

        delete host.__initializingAttrs;
    }

    var ATTR_SPECIAL_KEYS = ['value', 'getter', 'setter', 'readOnly'];

    /**
     * 将对象的每个属性格式化为
     * {
     *     value: 'xx',
     *     getter: fn,
     *     setter: fn,
     *     readOnly: boolean
     * }
     * @param attrs {Object} 要被格式化的对象
     * @param isUserValue {Boolean} 是否是用户提供的对象
     */
    function normalize(attrs, isUserValue) {
        var newAttrs = {};
        for(var key in attrs) {
            var attr = attrs[key];
            if(!isUserValue && isPlainObject(attr) && hasOwnProperties(attr, ATTR_SPECIAL_KEYS)) {
                newAttrs[key] = attr;
                continue;
            }
            newAttrs[key] = {
                value: attr
            };
        }
        return newAttrs;
    }

    /**
     * object是否拥有properties的属性名
     * @param object {Object}
     * @param properties {Array} 属性名集合
     * @returns {boolean}
     */
    function hasOwnProperties(object, properties) {
        for(var i = 0, len = properties.length; i < len; i++) {
            if(object.hasOwnProperty(properties[i])) {
                return true;
            }
        }
        return false;
    }

    // 对于 attrs 的 value 来说，以下值都认为是空值： null, undefined, '', [], {}
    function isEmptyAttrValue(o) {
        return o === null || // null, undefined
            (isString(o) || isArray(o)) && o.length === 0 || // '', []
            isEmptyObject(o); // {}
    }

    /**
     * 判断属性值 a 和 b 是否相等，注意仅适用于属性值的判断，非普适的 === 或 == 判断
     * @param a
     * @param b
     * @returns {boolean}
     */
    function isEqual(a, b) {
        if(a === b) {
            return true;
        }

        if(isEmptyAttrValue(a) && isEmptyAttrValue(b)) {
            return true;
        }

        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if(className !== toString.call(b)) {
            return false;
        }

        switch(className) {

        // Strings, numbers, dates, and booleans are compared by value.
        case '[object String]':
            // Primitives and their corresponding object wrappers are
            // equivalent; thus, `"5"` is equivalent to `new String("5")`.
            return a === String(b);

        case '[object Number]':
            // `NaN`s are equivalent, but non-reflexive. An `equal`
            // comparison is performed for other numeric values.
            return a !== +a ? b !== +b : (a === 0 ? 1 / a === 1 / b : a === +b);

        case '[object Date]':
        case '[object Boolean]':
            // Coerce dates and booleans to numeric primitive values.
            // Dates are compared by their millisecond representations.
            // Note that invalid dates with millisecond representations
            // of `NaN` are not equivalent.
            return +a === +b;

        // RegExps are compared by their source patterns and flags.
        case '[object RegExp]':
            return a.source === b.source && a.global === b.global && a.multiline === b.multiline && a.ignoreCase === b.ignoreCase;

        // 简单判断数组包含的 primitive 值是否相等
        case '[object Array]':
            var aString = a.toString();
            var bString = b.toString();

            // 只要包含非 primitive 值，为了稳妥起见，都返回 false
            return aString.indexOf('[object') === -1 && bString.indexOf('[object') === -1 && aString === bString;
        }

        if(typeof a !== 'object' || typeof b !== 'object') {
            return false;
        }

        // 简单判断两个对象是否相等，只判断第一层
        if(isPlainObject(a) && isPlainObject(b)) {

            // 键值不相等，立刻返回 false
            if(!isEqual(keys(a), keys(b))) {
                return false;
            }

            // 键相同，但有值不等，立刻返回 false
            for(var p in a) {
                if(a[p] !== b[p]) {
                    return false;
                }
            }

            return true;
        }

        // 其他情况返回 false, 以避免误判导致 change 事件没发生
        return false;
    }


    /**
     * 属性对象结构：
     * {
     *     value: 'xx', // 属性值
     *     getter: fn, // 获取属性值的方法，优先于value，返回值作为获取到的返回值
     *     setter: fn, // 设置属性值的方法，返回值作为属性值
     *     readOnly: boolean // 是否只读
     * }
     * 下面是内部使用的属性：
     *     __initializingAttrs: {Boolean} 是否正在初始化
     *     __changedAttrs: {Object} key是属性名，value是二元组[当前值, 上一次的值]，用来给手动触发change事件使用，对应属性的change事件调用完则销毁
     */
    var obj = {
        /**
         * 负责 attributes 的初始化
         * attributes 是与实例相关的状态信息，可读可写，发生变化时，会自动触发相关事件
         * @param config
         */
        initAttrs: function(config) {
            var attrs = this.attrs = {}; // initAttrs 是在初始化时调用的，默认情况下实例上肯定没有 attrs，不存在覆盖问题

            // Get all inherited attributes.
            var specialProps = this.propsInAttrs || []; // 指定的属性列表
            mergeInheritedAttrs(attrs, this, specialProps);

            if(config) { // 合并config到attrs
                mergeUserValue(attrs, config);
            }

            setSetterAttrs(this, attrs, config); // 对于有 setter 的属性，要用初始值 set 一下，以保证关联属性也一同初始化

            parseEventsFromAttrs(this, attrs); // 对属性中的on/before/after事件或切面进行绑定

            // 将 this.attrs 上的 special properties 放回 this 上
            copySpecialProps(specialProps, this, attrs, true);
        },
        /**
         * 获取对应属性值，getter优先于value
         * @param key
         */
        get: function(key) {
            var attr = this.attrs[key] || {};
            var val = attr.value;
            return attr.getter ? attr.getter.call(this, val, key) : val;
        },
        /**
         * 设置属性值
         * @param key {String/Object} 属性名或者属性对象
         * @param val {*} 属性值/附加配置，如果第一个参数是属性对象，则可选
         * @param options {Object} 附加配置，可选
         *          silent {Boolean}
         *          override {Boolean}
         */
        set: function(key, val, options) {
            var attrs = {}; // 存放传入的属性对象

            if(isString(key)) { // set("key", val, options)
                attrs[key] = val;
            } else { // set({ "key": val, "key2": val2 }, options)
                attrs = key;
                options = val;
            }

            options || (options = {});
            var silent = options.silent;
            var override = options.override;

            var now = this.attrs;
            var changed = this.__changedAttrs || (this.__changedAttrs = {});

            for(key in attrs) {
                if(!attrs.hasOwnProperty(key)) { // 非自身属性不操作
                    continue;
                }

                var attr = now[key] || (now[key] = {}); // attr用来临时操作，当前的属性对象
                val = attrs[key]; // 要设置的属性值

                if(attr.readOnly) { // 只读
                    throw new Error('This attribute is readOnly: ' + key);
                }

                if(attr.setter) { // 有setter，调用setter(val, key)，将返回值赋值给val
                    val = attr.setter.call(this, val, key);
                }

                var prev = this.get(key); // 获取设置前的 prev 值

                // 获取需要设置的 val 值
                // 如果设置了 override 为 true，表示要强制覆盖，就不去 merge 了
                // 都为对象时，做 merge 操作，以保留 prev 上没有覆盖的值
                if(!override && isPlainObject(prev) && isPlainObject(val)) {
                    val = merge(merge({}, prev), val);
                }

                now[key].value = val; // 设置最终的value

                if(!this.__initializingAttrs && !isEqual(prev, val)) { // 触发change事件，初始化时对 set 的调用，不触发任何事件
                    if(silent) {
                        changed[key] = [val, prev];
                    } else {
                        this.trigger('change:' + key, val, prev, key);
                    }
                }
            }
            return this;
        },
        /**
         * 对于配置了silent的set，可以手动触发change事件
         * 此方法对所有未触发change事件的属性全部触发一次
         */
        change: function() {
            var changed = this.__changedAttrs;
            if(changed) {
                for(var key in changed) {
                    if(changed.hasOwnProperty(key)) {
                        var args = changed[key];
                        this.trigger('change:' + key, args[0], args[1], key);
                    }
                }
                delete this.__changedAttrs;
            }
            return this;
        },
        // 提供给测试使用
        _isPlainObject: isPlainObject
    };
    module.exports = obj;

});

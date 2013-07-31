define(function(require, exports, module) {
    var $ = require('$');

    var cache = []; // 按键累积缓存
    var keydownCache = {}; // keydown按键缓存，避免keydown的持续触发累积
    var holdKeys = {}; // 允许持续响应keydown的按键（三个功能键系统不会持续响应，其他按键正常）
    var timer; // 清理cache的定时器
    /**
     * -----------------------------------------
     * 键盘上的元字符有：
     * -----------------------------------------
     * Esc          :27
     * F1-F12       :112-123
     * Scroll Lock  :145
     * Pause Break  :19
     * `或~         :192
     * 0-9          :48-57
     * )!@#$%^&*(   :48-57(0-9的上标)
     * -或_          :109
     * =或+          :61
     * backspace    :8
     * tab          :9
     * a-z          :65-90
     * Caps Lock    :20
     * Space        :32
     * Enter        :13
     * Insert       :45
     * Home         :36
     * Page Up      :33
     * Delete       :46
     * End          :35
     * Page Down    :34
     * up           :38
     * left         :37
     * down         :40
     * right        :39
     * -----------------------------------------
     * 功能键
     * -----------------------------------------
     * Shift        :16
     * Ctrl         :17
     * Alt          :18
     * -----------------------------------------
     * 以下是小键盘
     * -----------------------------------------
     * Number Lock  :144
     * /            :111
     * *            :106
     * -            :109
     * +            :107
     * 0-9          :96-105(灯亮)
     * -----------------------------------------
     * Number Lock关闭，或者开启且同时按住Shift，对应以下键值码
     * -----------------------------------------
     * 0-Insert     :45
     * 1-End        :35
     * 2-down       :40
     * 3-Page Down  :34
     * 4-left       :37
     * 5-空          :0
     * 6-right      :39
     * 7-Home       :36
     * 8-up         :38
     * 9-Page Up    :33
     * -----------------------------------------
     */
    var KEY = {
        shift:{ // 上标按键
            '192':'~',
            '49':'!',
            '50':'@',
            '51':'#',
            '52':'$',
            '53':'%',
            '54':'^',
            '55':'&',
            '56':'*',
            '57':'(',
            '48':')',
            '109':'_',
            '61':'+',
            '219':'{',
            '221':'}',
            '59':':',
            '222':'"',
            '220':'|',
            '188':'<',
            '190':'>',
            '191':'?'
        },
        normal:{ // 正常按键
            '27':'Esc',
            '192':'`',
            '145':'Scroll Lock',
            '19':'Pause Break',
            '8':'Backspace',
            '9':'Tab',
            '20':'Caps Lock',
            '32':'Space',
            '13':'Enter',
            '45':'Insert',
            '36':'Home',
            '33':'Page Up',
            '46':'Delete',
            '35':'End',
            '34':'Page Down',
            '38':'Up',
            '37':'Left',
            '40':'Down',
            '39':'Right',
            '144':'Number Lock',
            '111':'\/',
            '106':'*',
            '109':'-',
            '107':'+'
        }
    };
    (function() {
        var letters = 'abcdefghijklmnopqrstuvwxyz';
        var i;
        for(var key in KEY.normal) { // 按键名称同一转小写来匹配
            KEY.normal[key] = KEY.normal[key].toLowerCase();
        }
        for(i = 0; i <= 9; i++) {
            KEY.normal[48 + i] = i; // 正常键盘0-9
            KEY.normal[96 + i] = i; // 小键盘0-9
        }

        for(i = 0; i <= 26; i++) { // a-z
            KEY.normal[65 + i] = letters[i];
        }
        for(i = 0; i <= 12; i++) { // F1 - F12
            KEY.normal[112 + i] = 'F' + (i + 1);
        }
    })();
    /**
     * 键：按键字符串，忽略大小写，格式如下：
     *     单个按键： 'a‘
     *     组合键+分割：'Ctrl+a'，'Ctrl+Shift+a'，'Ctrl+Alt+Shift+a'
     *     顺序键,分割：'*,t' 表示按完*然后按t
     * 注意：shift只可能和字母一起出现，不可能和其他字符一起出现，例如：
     *     !,不能写作shift+1（shift+1还可能是End)
     *     shift+a或者shift+A是合法的，表示同时按下shift和a键
     */
    var keyMap = {}; // 存放热键以及对应的处理函数
    var helper = {
        /**
         * 将热键格式化输出，例如
         * Ctrl + ALT+shift+a -> 1+1+1+65
         * ctrL+a -> 1+0+0+65
         * ! -> 0+0+1+49
         * @param str {String} 热键
         * @return {String} 格式化后的热键码
         */
        formatKey:function(str) {
            var arr = str.split(/\s*,\s*/);
            var shortcuts = [];
            for(var j = 0, jLen = arr.length; j < jLen; j++) {
                var keyArr = arr[j].split(/\s*\+\s*/);
                var flag = true;
                var temp = [0, 0, 0]; // 表示Ctrl，Alt，Shift
                for(var i = 0, iLen = keyArr.length; i < iLen; i++) {
                    var s = keyArr[i].toLowerCase();
                    if(s === 'ctrl') {
                        temp[0] = 1;
                    } else if(s === 'alt') {
                        temp[1] = 1;
                    } else if(s === 'shift' && flag) {
                        temp[2] = 1;
                    } else {
                        if(!(/^[a-z]$/gi.test(s))) { // 非字母
                            for(var k in KEY.shift) {
                                if(KEY.shift[k] === s) {
                                    temp[2] = 1;
                                    flag = false;
                                    break;
                                }
                            }
                        }
                        temp.push(s);
                    }
                    shortcuts[j] = temp.join('+');
                }
            }
            return shortcuts.join(',');
        },
        /**
         * 将键值码转化为字符串
         * @param keyCode {Integer} 键值码
         * @param shift {Boolean} 是否按住了shfit键
         * @return {String} 键值码对应的字符
         */
        translate:function(keyCode, shift) {
            var result;
            if(shift) {
                result = KEY.shift[keyCode];
                if(result) {
                    return result;
                }
            }
            result = KEY.normal[keyCode];
            return result || '';
        },
        /**
         * 将热键注册到热键系统中，支持两种参数形式：
         *     1. 注册单个热键
         *        第1个参数是热键，
         *        第2个参数可能是：
         *            a. 回调函数
         *            b. 或者是个对象 {callback: 回调函数, hold: true/false} 一般hold是true时候采用到，表示支持响应按着keydown触发多次事件
         *     2. 注册多个热键
         *        只有一个参数，格式如下：
         *        {
         *            key1: callback,
         *            key2: {callback: callback, hold:true/false}
         *            ...
         *        }
         * @param $0
         * @param $1
         * @return {Undefined}
         */
        reg:function($0, $1) {
            if($.isFunction($1)) {
                keyMap[helper.formatKey($0)] = $1;
            } else if($1 && $.isFunction($1.callback)) {
                keyMap[helper.formatKey($0)] = $1.callback;
                if($1.hold) {
                    holdKeys[$0] = 1;
                }
            }
        }
    };

    var r = {
        ESC:27,
        LEFT:37,
        UP:38,
        RIGHT:39,
        DOWN:40,
        ENTER:13,
        /**
         * 给一个节点绑定ctrl + enter，一般用来提交使用
         * mac 下支持 apple键 + enter
         * @param node {Object} jQuery节点
         * @param callback {Function} 回调函数
         * @return {Object} jQuery节点
         */
        ctrlEnter:function(node, callback) {
            return node.keydown(function(e) {
                if((e.ctrlKey || e.originalEvent.metaKey) && e.keyCode === r.ENTER) {
                    callback.call(node, e);
                    e.stopPropagation();
                }
            });
        },
        /**
         * 热键包括两种：功能键和基本键，功能键即Ctrl，Alt，Shift，剩余的都是基本键
         * 热键写法注意，
         *     热键写法忽略大小写，例如：
         *         ctrl + a 和 Ctrl + A 一样
         *         Ctrl + Shift + a 和 CTRL + SHIFT + A 一样
         *     一个键盘含有两个字符情况下，需要上面的键值码请直接输出，请勿用Shift，例如：
         *         !，请勿用Shift+1（还可能表示End导致歧义）
         *         ?，请勿用Shift+/
         *     shift只可能和字母同时出现
         * 参数格式同 helper.reg
         * @param $0
         * @param $1
         * @return {Undefined}
         */
        hotKey:function() {
            var $0 = arguments[0], $1 = arguments[1];
            if(typeof $0 === 'string') {
                helper.reg($0, $1);
            } else {
                for(var key in $0) {
                    helper.reg(key, $0[key]);
                }
            }
        },
        /**
         * 参数列表中的所有热键将支持按住的keydown响应
         * @params {String} 热键
         * ...
         * @return {Undefined}
         */
        hold:function() {
            for(var i = 0, len = arguments.length; i < len; i++) {
                holdKeys[arguments[i]] = 1;
            }
        },
        /**
         * 参数列表中的所有热键接触按住的keydown响应，按住keydown只响应一次
         * @params {String} 热键
         * ...
         * @return {Undefined}
         */
        unhold:function() {
            for(var i = 0, len = arguments.length; i < len; i++) {
                delete holdKeys[arguments[i]];
            }
        }
    };

    $(document).keydown(function(e) {
        var key;
        var temp = [0, 0, 0];
        var tag = e.target.tagName.toUpperCase();
        if(tag !== 'INPUT' && tag !== 'BUTTON' && tag !== 'TEXTAREA' && tag !== 'SELECT' && tag !== 'OPTION') {
            if(!keydownCache[e.keyCode]) {
                if(e.ctrlKey) {
                    temp[0] = 1;
                }
                if(e.altKey) {
                    temp[1] = 1;
                }
                if(e.shiftKey) {
                    temp[2] = 1;
                }
                temp[3] = helper.translate(e.keyCode, temp[2]);
                if(temp[3]) {
                    if(!holdKeys[temp[3]]) {
                        keydownCache[e.keyCode] = 1;
                    }
                    key = temp.join('+');
                    clearTimeout(timer);
                    cache.push(key);
                    for(var i = 0, len = cache.length; i < len; i++) {
                        var tempCache = cache.slice(i, len);
                        key = tempCache.join(',');
                        if(keyMap[key]) {
                            cache.length = 0;
                            return keyMap[key](e) === true;
                        }
                    }
                }
            }
        }
    });

    $(document).keyup(function(e) {
        delete keydownCache[e.keyCode];
        clearTimeout(timer);
        timer = setTimeout(function() {
            cache.length = 0;
        }, 1024);
    });

    module.exports = r;
});

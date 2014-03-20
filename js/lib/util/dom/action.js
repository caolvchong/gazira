define(function(require, exports, module) {
    var $ = require('$');

    var cache = {
        dom: [],
        eventType: [],
        action: []
    };

    var actionKeyVal = 'data-action';
    var r = {
        setActionKey: function(key) {
            actionKeyVal = key;
            r.setActionKey = null;
        },
        /**
         * 利用冒泡来做监听，这样做有以下优势：
         *     1. 减少事件绑定数量，提高程序效率，尤其在列表性质的节点上，无需每个节点都绑定
         *     2. 动态生成的内容无需绑定事件也能响应
         *     3. 节点外点击隐藏某些节点
         * @param actions {Object} 响应类型与对应处理事件，
         *     键：是事件源上的data-action属性
         *     值：可能是下面两种格式：
         *         function：回调函数，当事件源触发时候执行该函数，函数的this是事件源的jQuery节点，参数是事件对象
         *         object：对象，包含两个属性：
         *             is：回调函数，事件源触发时候执行，this是事件源的jQuery节点，参数是事件对象
         *             not：点击在其他节点上时执行的回调函数，this是事件源的jQuery节点，参数是事件对象,
         *             callback： 同is
         *             scope：改变callback中的this
         * @param node {Object} jQuery对象，绑定的节点，是父容器
         * @param type 事件类型，默认是click，基本也都是处理click事件
         * @return {object} jQuery对象，父节点
         */
        listen: function(actions, node, type) {
            actions = actions || {};
            node = node ? $(node) : $(document);
            type = type || 'click';

            var index = $.inArray(node[0], cache.dom);
            if(index !== -1) {
                if(cache.eventType[index] !== type) {
                    index = -1;
                }
            }

            if(index === -1) {
                cache.dom.push(node[0]);
                cache.eventType.push(type);
                cache.action.push(actions);
                index = cache.action.length - 1;

                node[type](function(e) {
                    var target = $(e.target);
                    var actionKey = target.attr(actionKeyVal);
                    var xnode = target;
                    if(!actionKey) {
                        xnode = target.closest('[' + actionKeyVal + ']');
                        actionKey = xnode.attr(actionKeyVal);
                    }
                    var flag = true;
                    var fetch = cache.action[index];
                    var fetchAction = fetch[actionKey];
                    if(fetchAction) {
                        if($.isFunction(fetchAction.not)) { // 存在not
                            if(fetchAction.node && fetchAction.node[0] !== xnode[0]) { // 可能触发的是同一个action，但节点不同
                                fetchAction.not.call(fetchAction.scope || target, e, fetchAction.node, actionKey);
                            }
                            fetchAction.node = xnode; // 缓存住，提供给not使用
                            fetchAction.using = true;
                        }
                        if($.isFunction(fetchAction)) {
                            flag = fetchAction.call(target, e, xnode, actionKey);
                        } else {
                            if($.isFunction(fetchAction.is) || $.isFunction(fetchAction.action)) {
                                var fn = fetchAction.is || fetchAction.action;
                                flag = fn.call(fetchAction.scope || target, e, xnode, actionKey);
                            }
                        }
                    }
                    for(var i = 0, len = cache.action.length; i < len; i++) {
                        var temp = cache.action[i];
                        for(var key in temp) {
                            if(key !== actionKey && temp[key] && temp[key].not && $.isFunction(temp[key].not) && temp[key].using) {
                                temp[key].using = !!temp[key].not.call(temp[key].scope || target, e, temp[key].node, actionKey);
                            }
                        }
                    }
                    if(flag === -1) { // 禁用冒泡
                        e.stopPropagation();
                    } else if(flag === true) { // 都不禁用
                        return true;
                    } else if(flag === false) { // 都禁用
                        return false;
                    } else { // 默认无返回值时禁用默认行为，但不禁用冒泡
                        e.preventDefault();
                    }
                });
            } else {
                var fetch = cache.action[index];
                for(var key in actions) {
                    fetch[key] = actions[key];
                }
            }
            return node;
        }
    };
    return r;
});

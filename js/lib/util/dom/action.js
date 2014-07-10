define(function(require, exports, module) {
    var $ = require('$');
    var Base = require('../base');

    var cache = {
        dom: [],
        eventType: [],
        events: [],
        notEvents: []
    };


    var actionKeyVal = 'data-action';
    var actionKeySplitter = /\s+/;
    var r = {
        setActionKey: function(key) {
            actionKeyVal = key;
            r.setActionKey = null;
        },
        setActionKeySplitter: function(key) {
            actionKeySplitter = key;
            r.setActionKeySplitter = null;
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
         *             before：在is回调函数之前执行，this是事件源的jQuery节点，参数是事件对象, 返回false则不调用is
         *             is：回调函数，事件源触发时候执行，this是事件源的jQuery节点，参数是事件对象
         *             after：在is回调函数之后执行，this是事件源的jQuery节点，参数是事件对象
         *             not：点击在其他节点上时执行的回调函数，this是事件源的jQuery节点，参数是事件对象,
         *                  return false将不会移除回调函数;其他return值会或没有return则移除not回调
         *             callback： 同is
         * @param node {Object} jQuery对象，绑定的节点，是父容器
         * @param type 事件类型，默认是click，基本也都是处理click事件
         * @return {object} jQuery对象，父节点
         */
        listen: function(actions, node, type) {
            actions = actions || {};
            node = node ? $(node) : $(document);
            type = type || 'click';

            var index = $.inArray(node[0], cache.dom);
            if (index !== -1) {
                if (cache.eventType[index] !== type) {
                    index = -1;
                }
            }

            if (index === -1) {
                cache.dom.push(node[0]);
                cache.eventType.push(type);
                cache.events.push(new Base());
                cache.notEvents.push({});
                index = cache.events.length - 1;

                var events = cache.events[index];
                var notEvents = cache.notEvents[index];
                bindAction(events, notEvents, actions);

                $(node).on(type, function(e) {
                    var target = $(e.target);
                    var xnode = target;
                    var actionKeys = target.attr(actionKeyVal);
                    if(!actionKeys) {
                        xnode = target.closest('[' + actionKeyVal + ']');
                        actionKeys = xnode.attr(actionKeyVal);
                    }

                    // 遍历notEvents如果新对象不是原先触发的对象则触发not事件
                    $.each(notEvents, function(_actionKey, notEvent) {
                        var _xnode = notEvent.xnode;

                        if (xnode[0] !== _xnode[0]) {
                            bindContext(events, target);
                            if (!!events.trigger('not:' + _actionKey, e, _xnode, _actionKey)) {
                                delete notEvents[_actionKey];
                            }
                        }
                    });

                    if (actionKeys) {
                        actionKeys = actionKeys.split(actionKeySplitter);
                        $.each(actionKeys, function(_index, actionKey) {
                            if (actionKey.length) {
                                bindContext(events, target);
                                if (events.trigger('before:' + actionKey, e, xnode, actionKey)) {
                                    events.trigger('is:' + actionKey, e, xnode, actionKey);
                                    events.trigger('after:' + actionKey, e, xnode, actionKey);
                                }
                            }
                        });
                    }
                });
            } else {
                bindAction(cache.events[index], cache.notEvents[index], actions);
            }
            return node;
        }
    };

    function bindContext(events, context) {
        var __events = events.__events;
        $.each(__events, function(actionKey, arr) {
            $.each(arr, function(index, val) {
                if (index % 2 == 1) {
                    arr[index] = context;
                }
            });
        });
    }

    function bindAction(events, notEvents, actions) {
        $.each(actions, function(actionKey, action) {
            var parsedAction = {};
            if ($.isFunction(action)) {
                parsedAction.is = action;
            } else {
                parsedAction = action;
                parsedAction.is = parsedAction.is || parsedAction.callback;
            }

            $.each(parsedAction, function(key, actionCallback) {
                if ($.isFunction(actionCallback)) {
                    events.on(key + ":" + actionKey, actionCallback);
                }
            });

            // 如果存在not事件，绑定默认事件
            if ($.isFunction(parsedAction.not)) {
                events.on("is:" + actionKey, function(e, xnode, actionKey) {
                    notEvents[actionKey] = {
                        xnode: xnode
                    };
                });
            }
        });
    }

    return r;
});

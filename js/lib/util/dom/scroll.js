define(function(require, exports, module) {
    var $ = require('$');
    var browser = require('../bom/browser');

    var helper = {
        detect: function(node) {
            var result;
            var scrollTop, clientHeight;
            if(node == window || node == document) {
                scrollTop = $(document).scrollTop();
                node = document.documentElement;
            } else {
                scrollTop = node.scrollTop;
            }
            clientHeight = Math.ceil(node.clientHeight);
            if(scrollTop == 0) {
                result = 'top';
            } else if(scrollTop + Math.ceil(clientHeight) >= node.scrollHeight) {
                result = 'bottom';
            }
            return result;
        }
    };

    var r = {
        to: function(node, n) {
            // 下面这个判断要写在node[0]前面，当页面存在iframe时候，window[0]会获取到iframe造成问题
            if(node == window || node == document || node == document.body) {
                node = document.documentElement;
            }
            node = node[0] || node;
            if(n == 'top') {
                n = 0;
            } else if(n == 'bottom') {
                n = node.scrollHeight;
            }
            node.scrollTop = n;
        },
        /**
         * 处理鼠标滚轮冒泡
         * @param node
         * @param action
         */
        prevent: function(node, action) {
            node = node[0] || node;
            if(browser.ie) {
                node.attachEvent('onmousewheel', function(e) {
                    var result = helper.detect(node);
                    e = window.event;
                    node.scrollTop += e.wheelDelta > 0 ? -60 : 60;
                    e.returnValue = false;
                    if(result) {
                        if(action) {
                            action.call(node, e, result);
                        }
                    }
                });
            } else if(browser.firefox) {
                node.addEventListener('DOMMouseScroll', function(e) {
                    var result = helper.detect(node);
                    if((result == 'top' && e.detail < 0) || (result == 'bottom' && e.detail > 0)) {
                        e.preventDefault();
                        if(action) {
                            action.call(node, e, result);
                        }
                    }
                }, false);
            } else {
                node.addEventListener('mousewheel', function(e) {
                    var result = helper.detect(node);
                    if((result == 'top' && e.wheelDelta >= 0) || (result == 'bottom' && e.wheelDelta <= 0)) {
                        e.returnValue = false;
                        if(action) {
                            action.call(node, e, result);
                        }
                    }
                }, false);
            }

        },
        listen: function(node, actions, prevent) {
            var status = {};
            var prevTop = $(node).scrollTop();
            var fn = function(e, dir) {
                if(dir) {
                    var result = helper.detect(node);
                    var top = $(node).scrollTop();
                    status.bottom = (node == document ? document.body : node).scrollHeight - parseFloat((node == document) ? document.documentElement.clientHeight : node.clientHeight);
                    if(result) {
                        if(actions.top) {
                            if(result == 'top' && dir == 'up') {
                                actions.top(e, top, dir, status);
                            }
                        }
                        if(actions.bottom) {
                            if(result == 'bottom' && dir == 'down') {
                                actions.bottom(e, top, dir, status);
                            }
                        }
                    }
                    if(actions.other) {
                        actions.other(e, top, dir, status);
                    }
                }
            };
            node = node[0] || node;
            node = (node == document || node == document.body) ? window : node; // IE下需要$(window).scroll可以监听，用document则不行
            $(node).scroll(function(e) {
                var scrollTop = $(node).scrollTop();
                var dir = scrollTop > prevTop ? 'down' : scrollTop < prevTop ? 'up' : '';
                prevTop = scrollTop;
                if(dir) {
                    fn(e.originalEvent, dir);
                }
            });
            if(node != window && prevent !== false) {
                r.prevent(node);
            }
        }
    };
    module.exports = r;
});
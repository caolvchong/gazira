define(function(require, exports, module) {
    var $ = require('$');

    var undef;
    var optionalParam = /\((.*?)\)/g;
    var namedParam = /(\(\?)?:\w+/g; // :通配符
    var splatParam = /\*\w+/g; // *号通配符
    var escapeRegExp = /[\-{}\[\]+?.,\\\^$|#\s]/g; // 转义字符
    var defaultRouter = 'defaultRouter'; // 默认key
    var defaultHash; // 默认触发的hash，可以是一个字符串，或者是一个function

    var prevURL = location.href; // 缓存上一次的URL，防止某些浏览器支持hashchange事件，但是取不到oldURL和newURL的情况

    var helper = {
        /**
         * 将路由转化为正则表达式
         * @param route
         */
        routeToReg: function(route) {
            route = route.replace(escapeRegExp, '\\$&').replace(optionalParam, '(?:$1)?').replace(namedParam,function(match, optional) {
                return optional ? match : '([^\/]+)';
            }).replace(splatParam, '(.*?)');
            return new RegExp('^' + route + '$');
        },
        /**
         * 获取当前的hash
         * @returns {string}
         */
        getHash: function() {
            return location.hash.replace(/^#/, '');
        },
        setHash: function(hash, force) {
            var url = location.href;
            url = url.replace(/#(.+)/, '#' + hash);
            force === true ? location.replace(url) : (location.hash = hash);
        },
        search: function(hash, cache) {
            var match;
            for(var key in cache) {
                var item = cache[key];
                match = hash.match(item.reg);
                if(match) {
                    return {
                        action: item.action,
                        params: $.isArray(match) ? match.slice(1) : []
                    };
                }
            }
        },
        /**
         * 获取路由对应的处理函数
         * @param hash
         * @param cache
         */
        fetch: function(hash, cache) {
            var result = {
                action: null,
                params: []
            };
            hash = $.trim(hash);
            if(hash && hash !== defaultRouter) {
                result = helper.search(hash, cache);
            } else {
                if(defaultHash) {
                    if(typeof defaultHash === 'string') {
                        result = helper.search(hash, cache);
                    } else if(typeof defaultHash === 'function') {
                        result.action = defaultHash;
                    }
                }
            }
            return result;
        },
        /**
         * 找到对应hash的处理函数，并执行
         * @param hash
         * @param cache
         */
        match: function(hash, cache) {
            var fetch = helper.fetch(hash, cache);
            if(fetch) {
                if(fetch.action) {
                    fetch.action.apply(null, fetch.params);
                    if(fetch.action.callback) {
                        fetch.action.callback();
                        delete fetch.action.callback;
                    }
                }
            }
        }
    };

    var iframe;
    var supportHash = ('onhashchange' in window) && (document.documentMode === undef || document.documentMode === 8);
    var lastHash = helper.getHash();
    var cache = {};

    var r = {
        /**
         * 获取当前的hash
         */
        get: helper.getHash,
        /**
         * 将当前的hash清空
         */
        empty: function() {
            location.hash = '';
        },
        /**
         * 触发某个路由，执行回调函数
         * @param hash
         * @param callback 执行完路由后的回调函数
         * @param force 是否写入历史记录
         */
        trigger: function(hash, callback, force) {
            helper.setHash(hash, force);
            if($.isFunction(callback)) {
                var fetch = helper.fetch(hash, cache);
                if(fetch.action) {
                    fetch.action.callback = callback;
                }
            }
        },
        /**
         * 设定路由监听
         * @param obj 键值对，key是路由表，值是路由对应的动作函数。路由表支持：
         *          :通配符，例如： user/:id 可以匹配 user/2   user/33
         *          *通配符，例如： *post 可以匹配 userpost    delpost
         */
        listen: function(obj) {
            (function() {
                for(var key in obj) {
                    if(key !== defaultRouter) {
                        if(!cache[key]) {
                            cache[key] = {
                                reg: helper.routeToReg(key),
                                action: obj[key]
                            };
                        }
                    } else {
                        defaultHash = obj[key];
                    }
                }
            })();

            if(supportHash) {
                window.onhashchange = function(e) {
                    e = e || window.event;
                    var prev = e.oldURL || prevURL;
                    var url = e.newURL || location.href;
                    var hash = helper.getHash();
                    if(prev !== url) {
                        prevURL = url;
                        helper.match(hash ? hash : defaultHash, cache);
                    }
                };
            } else {
                if(!iframe) {
                    $(function() {
                        var el = $('<iframe tabindex="-1" style="display:none" widht="0" height="0"/>').appendTo(document.body);
                        iframe = el[0].contentWindow;
                        el.bind('load', function() {
                            var hash = helper.getHash();
                            el.unbind('load');
                            var doc = iframe.document;
                            doc.open();
                            doc.write('<!DOCTYPE html><html><body>' + hash + '</body></html>');
                            doc.close();
                            setInterval(function() {
                                var hash = helper.getHash();// 主窗口中的hash
                                var historyHash = iframe.document.body.innerText;// 上一次hash
                                if(hash !== lastHash) { // 主窗口hash改变
                                    lastHash = hash;
                                    if(hash !== historyHash) {
                                        doc.open();
                                        doc.write('<!DOCTYPE html><html><body>' + hash + '</body></html>');
                                        doc.close();
                                    }
                                    helper.match(hash, cache);
                                } else if(historyHash !== lastHash) {// 回退/前进
                                    location.hash = historyHash;
                                }
                            }, 50);
                        });
                    });
                }
            }
            var initHash = helper.getHash(); // 进入页面时候的hash
            if(initHash) {
                helper.match(initHash, cache);
            } else {
                helper.match(defaultHash, cache);
            }
        }
    };

    module.exports = r;
});
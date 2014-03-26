/**
 * User: caolvchong@gmail.com
 * Date: 7/9/13
 * Time: 2:52 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Overlay = require('../overlay');
    var mask = require('../mask');
    var Events = require('../../util/event');
    var Sticky = require('../../util/dom/sticky');
    var Scroll = require('../../util/dom/scroll');
    var tpl = require('./tpl/dialog');

    var DEFAULT_HEIGHT = 300;
    var Z_INDEX = 999;

    var Dialog = Overlay.extend({
        attrs: {
            template: tpl.render(),
            title: '对话框',
            content: { // 指定内容元素，可以是 url 地址
                value: null,
                setter: function(val) {
                    if(/^(https?:\/\/|\/|\.\/|\.\.\/)/.test(val)) { // 判断是否是 url 地址
                        this._type = 'iframe';
                    } else {
                        this._type = '';
                    }
                    return val;
                }
            },
            // 是否有背景遮罩层
            // 可设为 false
            hasMask: {
                value: true,
                hideOnClick: false
            },
            width: 500, // 默认宽度
            height: null, // 默认高度
            zIndex: Z_INDEX,
            fixed: true, // 是否fixed
            autoFit: true, // 是否自适应高度
            effect: 'none', // 动画支持，默认没有，需要动画传入一个function
            align: {
                selfXY: ['50%', '50%'],
                baseXY: ['50%', '50%']
            }
        },
        events: {
            'click [data-action=close]': function() {
                this.hide();
                return false;
            }
        },
        parseElement: function() {
            Dialog.superclass.parseElement.call(this);
            this.contentElement = this.$('[data-role="content"]');
            // 必要的样式
            this.contentElement.css({
                background: '#fff',
                height: '100%',
                zoom: 1
            });

        },
        setup: function() {
            Dialog.superclass.setup.call(this);
            this._setupMask();
            this._setupKeyEvents();
            this._setupFocus();
            toTabed(this.element);
            if(this.get('fixed') !== false) {
                Sticky.fix(this.element);
            }
            Scroll.prevent(this.element);
        },
        // 覆盖 overlay，提供动画
        _onRenderVisible: function(val) {
            var effect = this.get('effect');
            if(val) {
                if($.isFunction(effect)) {
                    effect.call(this, this.element);
                } else {
                    this.element.show();
                }
            } else {
                this.element.hide();
            }
        },
        show: function(config) {
            Dialog.superclass.show.call(this);
            if(this._type === 'iframe') { // iframe 要在载入完成才显示
                if(!this.get('height')) {
                    this.element.height(DEFAULT_HEIGHT); // iframe 还未请求完，先设置一个固定高度
                }
                this._showIframe();
            } else {
                if(this.get('height')) {
                    this.$('.main').height(this.get('height') - this.$('.header').outerHeight() - this.$('.footer').outerHeight()); // 内容高度太高处理
                }
            }
            if(config) {
                for(var key in config) {
                    this.set(key, config[key]);
                }
            }
            return this;
        },
        hide: function() {
            if(this._type === 'iframe' && this.iframe) { // 把 iframe 状态复原
                this.iframe.attr({
                    src: 'about:blank'
                });
                this.iframe.remove(); // IE6 下，将 src 置为 javascript:''; 会出现 404 页面（已经修改为about:blank）
                this.iframe = null;
                this._errCount = 0;
            }

            Dialog.superclass.hide.call(this);
            clearInterval(this._interval);
            delete this._interval;
            return this;
        },
        destroy: function() {
            this.element.remove();
            clearInterval(this._interval);
            return Dialog.superclass.destroy.call(this);
        },

        _onRenderHeader: function(val) {
            this.$('.header')[val ? 'show' : 'hide']();
        },
        _onRenderFooter: function(val) {
            this.$('.footer')[val ? 'show' : 'hide']();
        },
        _onRenderTitle: function(val) {
            this.$('[data-role=title]').eq(0).html(val);
        },
        _onRenderClosable: function(val) {
            this.$('[data-role=close]').eq(0)[val === false ? 'hide' : 'show']();
        },
        _onRenderContent: function(val) {
            if(this._type !== 'iframe') {
                var value;
                // 有些情况会报错
                try {
                    value = $(val);
                } catch(e) {
                    value = [];
                }
                if(value[0]) {
                    this.contentElement.empty().append(value);
                } else {
                    this.contentElement.empty().html(val);
                }
            }
        },
        _setupMask: function() { // 绑定遮罩层事件
            var that = this;
            var action = function() {
                that.hide();
            };
            this.before('show', function() {
                this.set('zIndex', Z_INDEX);
                Z_INDEX += 2;
                var zIndex = parseInt(this.get('zIndex'), 10);
                var hasMask = this.get('hasMask');
                if(hasMask) {
                    mask.set('zIndex', zIndex - 1).show();

                    if(hasMask.hideOnClick) { // 点击遮罩关闭对话框
                        mask.element.one('click', action);
                    }
                }
            });
            this.after('hide', function() {
                var hasMask = this.get('hasMask');
                if(hasMask) {
                    mask.hide();
                    if(hasMask.hideOnClick) {
                        mask.element.off('click', action);
                    }
                }
            });
        },
        _setupFocus: function() {
            this.after('show', function() {
                this.element.focus();
            });
        },

        _setupKeyEvents: function() {// 绑定键盘事件，ESC关闭窗口
            this.delegateEvents($(document), 'keyup', function(e) {
                if(e.keyCode === 27) {
                    this.get('visible') && this.hide();
                }
            });
        },

        _showIframe: function() {
            var that = this;
            // 若未创建则新建一个
            if(!this.iframe) {
                this._createIframe();
            }
            // 开始请求 iframe
            this.iframe.attr({
                src: this._fixUrl(),
                name: 'dialog-iframe' + new Date().getTime()
            });
            // 因为在 IE 下 onload 无法触发
            // http://my.oschina.net/liangrockman/blog/24015
            // 所以使用 jquery 的 one 函数来代替 onload
            // one 比 on 好，因为它只执行一次，并在执行后自动销毁
            this.iframe.one('load', function() {
                if(!that.get('visible')) {// 如果 dialog 已经隐藏了，就不需要触发 onload
                    return;
                }
                if(that.get('autoFit')) {// 绑定自动处理高度的事件
                    clearInterval(that._interval);
                    that._interval = setInterval(function() {
                        that._syncHeight();
                    }, 300);
                }
                that._syncHeight();
                that.trigger('complete:show');
            });
        },

        _fixUrl: function() {
            var s = this.get('content').match(/([^?#]*)(\?[^#]*)?(#.*)?/);
            s.shift();
            s[1] = ((s[1] && s[1] !== '?') ? (s[1] + '&') : '?') + 't=' + new Date().getTime();
            return s.join('');
        },

        _createIframe: function() {
            var that = this;

            this.contentElement.empty();
            this.iframe = $('<iframe>', {
                src: 'about:blank',
                scrolling: 'no',
                frameborder: 'no',
                allowTransparency: 'true',
                css: {
                    border: 'none',
                    width: '100%',
                    display: 'block',
                    height: '100%',
                    overflow: 'hidden'
                }
            }).appendTo(this.contentElement);
            this._errCount = 0;

            // 给 iframe 绑一个 close 事件
            // iframe 内部可通过 window.frameElement.trigger('close') 关闭
            Events.mixTo(this.iframe[0]);
            this.iframe[0].on('close', function() {
                that.hide();
            });
        },

        _syncHeight: function() {
            var h;
            if(!this.get('height')) {// 如果未传 height，才会自动获取
                try {
                    h = getIframeHeight(this.iframe) + 'px';
                } catch(err) {
                    // 页面跳转也会抛错，最多失败6次
                    this._errCount = (this._errCount || 0) + 1;
                    if(this._errCount >= 6) {
                        // 获取失败则给默认高度 300px
                        // 跨域会抛错进入这个流程
                        h = DEFAULT_HEIGHT;
                        clearInterval(this._interval);
                        delete this._interval;
                    }
                }
                this.element.css('height', h);
                this._setPosition();
                // force to reflow in ie6
                // http://44ux.com/blog/2011/08/24/ie67-reflow-bug/
                this.element[0].className = this.element[0].className;
            } else {
                clearInterval(this._interval);
                delete this._interval;
            }
        }
    });

    module.exports = Dialog;

    // 让目标节点可以被 Tab
    function toTabed(element) {
        if(element.attr('tabindex') == null) {
            element.attr('tabindex', '-1');
        }
        element.css('outline', 'none').attr('hidefocus', 'true');
    }

    // 获取 iframe 内部的高度
    function getIframeHeight(iframe) {
        var D = iframe[0].contentWindow.document;
        var h;
        if(D.body.scrollHeight && D.documentElement.scrollHeight) {
            h = Math.min(D.body.scrollHeight, D.documentElement.scrollHeight);
        } else if(D.documentElement.scrollHeight) {
            h = D.documentElement.scrollHeight;
        } else if(D.body.scrollHeight) {
            h = D.body.scrollHeight;
        }
        return h;
    }
});
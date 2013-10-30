/**
 * User: caolvchong@gmail.com
 * Date: 9/9/13
 * Time: 8:07 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Base = require('../base');

    var doc = $(document);
    var win = $(window);
    var draggingPre = false; // 标识预拖放
    var diffX = 0, diffY = 0; // diffX, diffY记录鼠标点击离源节点的距离
    var obj = null; // 存储当前拖放的dnd
    var dragging = null; // 当前拖放的代理元素
    var dropping = null; // 当前的目标元素
    var dataTransfer = {}; // 存储拖放信息, 在dragstart可设置,在drop中可读取

    var isIOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
    var onDragging = false; // 判断是否正在拖拽，ios中经常不触发touchend
    var detectOnDragTimer; // 定时器
    var draggingTimer;
    var undef;

    var zIndex = 10000;

    var Dnd = Base.extend({
        attrs: {
            element: { // 当前被拖拽的元素
                getter: function(val) {
                    if(typeof val === 'string') {
                        return $(val);
                    }
                    return val ? val : null;
                }
            },
            proxy: { // 拖动时候的代理元素
                getter: function(val) {
                    if(typeof val === 'string') {
                        return $(val);
                    }
                    return val ? val : null;
                }
            },
            handler: '',
            container: { // 限制的容器
                getter: function(val) {
                    if(typeof val === 'string') {
                        return $(val);
                    }
                    return val ? val : null;
                }
            },
            drop: { // 接受的容器
                getter: function(val) {
                    if(typeof val === 'string') {
                        return $(val);
                    }
                    return val ? val : null;
                }
            },
            disabled: false, // 是否禁用拖拽
            except: null, // 排除的句柄
            visible: false, // 拖拽时候是否显示拖拽的元素
            animate: true, // 是否显示revert或者到指定位置的动画
            keepTop: true // 是否保持拖拽的节点始终位于最前
        },
        events: {},
        initialize: function(config) {
            Dnd.superclass.initialize.apply(this, arguments);
            this.render();
        },
        render: function(element) {
            var that = this;
            var nodes = element ? $(element) : this.get('element');
            var handlers = this.get('handler') ? nodes.find(this.get('handler')) : nodes;
            var except = this.get('except');
            if(except) { // 拖拽句柄排除
                nodes.find(except).css('cursor', 'default').mousedown(function(e) {
                    return false;
                });
            }
            nodes.find('input,textarea,button').css('cursor', 'default').mousedown(function(e) {
                return false;
            });
            handlers.each(function(index, handler) { // 支持多个拖拽
                var element = nodes.eq(index);
                var t = that.get('proxy');
                var proxy;
                if($.isFunction(t)) {
                    proxy = t.call(that, element, handler);
                }
                handler = $(handler);
                handler.data('dnd', $.extend({}, that, {
                    index: index,
                    element: element, // 当前拖动的元素
                    handler: handler, // 当前拖动的句柄
                    proxy: proxy
                })).css('cursor', 'move').attr('data-draggable', true);
                element.data('style', element.attr('style') || {});
            });
            return this;
        },
        enable: function(handler) {
            var nodes = this.get('element');
            var handlers = handler ? (typeof handler === 'string' ? nodes.find(handler) : handler) : nodes;
            handlers.each(function(i, handler) {
                $(handler).css('cursor', 'move').attr('data-draggable', true);
            });
            return this;
        },
        disable: function(handler) {
            var nodes = this.get('element');
            var handlers = handler ? (typeof handler === 'string' ? nodes.find(handler) : handler) : nodes;
            handlers.each(function(i, handler) {
                $(handler).css('cursor', 'default').attr('data-draggable', '');
            });
            return this;
        },
        destroy: function(handler) {
            var nodes = this.get('element');
            var handlers = handler ? (typeof handler === 'string' ? nodes.find(handler) : handler) : nodes;
            handlers.each(function(i, handler) {
                $(handler).removeData('dnd').css('cursor', 'default').removeAttr('data-draggable');
            });
            return this;
        },
        _onChangeDisabled: function(val, prev) {
            var handlers = this.get('handler');
            handlers.each(function(index, handler) {
                $(handler).css('cursor', val ? 'default' : 'move').attr('data-draggable', val ? '' : true);
            });
        }
    });
    /*
     * 开启页面Dnd功能,绑定鼠标按下、移动、释放以及ecs按下事件
     */
    Dnd.open = function() {
        $(document).on('mousedown mousemove mouseup touchstart touchmove touchend', handleEvent);
    };

    /*
     * 关闭页面Dnd功能,解绑鼠标按下、移动、释放以及ecs按下事件
     */
    Dnd.close = function() {
        $(document).off('mousedown mousemove mouseup touchstart touchmove touchend', handleEvent);
    };

    var handleEvent = function(e) {
        var dnd, proxy, element;
        var target;
        var pageX = e.pageX || (e.originalEvent.targetTouches && e.originalEvent.targetTouches[0].pageX);
        var pageY = e.pageY || (e.originalEvent.targetTouches && e.originalEvent.targetTouches[0].pageY);
        switch(e.type) {
            case 'mousedown':
            case 'touchstart':
                if(!e.which || e.which === 1) {
                    target = $(e.target);
                    dnd = target.data('dnd');
                    if(!dnd) {
                        target = target.closest('[data-draggable]');
                        dnd = target.data('dnd');
                    }
                    if(dnd && dnd.get('disabled') === false && target.attr('data-draggable')) { // 判断是否为可拖放元素
                        obj = dnd;
                        element = obj.element;
                        obj.set('proxy', obj.proxy ? obj.proxy : element.clone());
                        proxy = obj.get('proxy');

                        if(obj.trigger('beforedrag', obj) !== false) {
                            diffX = pageX - element.offset().left;
                            diffY = pageY - element.offset().top;
                            draggingPre = true;
                            proxy.css({
                                position: 'absolute',
                                margin: 0,
                                left: element.offset().left,
                                top: element.offset().top,
                                visibility: 'hidden'
                            }).data('proxy', true);
                            proxy.appendTo(element.parent());
                            if(obj.get('scroll') !== true) { // 拖动时候不影响滚动条，设置true则可以在拖动到边缘的同时让滚动条滚动
                                e.preventDefault();
                            }
                        }
                    }
                }
                break;
            case 'mousemove':
            case 'touchmove':
                if(draggingPre === true) {
                    executeDragStart(); // 开始拖放
                }
                if(dragging !== null) {
                    executeDrag({pageX: pageX, pageY: pageY}); // 根据边界和方向一起判断是否drag并执行
                    executeDragEnterLeaveOver(); // 是否要dragenter, dragleave和dragover并执行
                }
                break;

            case 'mouseup':
            case 'touchend':
                executeDragEnd();
                break;
        }
    };

    /*
     * 开始拖放
     * 显示proxy, 按照设置显示或隐藏源节点element
     */
    function executeDragStart() {
        var element = obj.element;
        var proxy = obj.get('proxy');
        var visible = obj.get('visible');
        var zIndex = getMaxZIndex();

        if(isIOS) {
            detectOnDragTimer = setInterval(function() {
                if(onDragging === false) {
                    onDragging = undef;
                    clearInterval(detectOnDragTimer);
                    detectOnDragTimer = undef;
                    executeDragEnd();
                }
            }, 100);
        }

        if(visible === false) { // 按照设置显示或隐藏element
            element.css('visibility', 'hidden');
        }
        proxy.css({
            zIndex: zIndex,
            visibility: 'visible',
            cursor: 'move'
        }).focus();

        dataTransfer = {};
        draggingPre = false;
        dragging = proxy;

        if(proxy[0].setCapture) {
            proxy[0].setCapture();
            proxy.bind('losecapture', executeDragEnd);
        }
        obj.trigger('dragstart', dataTransfer, dragging, dropping, obj);
    }

    /*
     * 根据边界和方向一起判断是否drag并执行
     */
    function executeDrag(e) {
        var container = obj.get('container');
        var element = obj.element;
        var proxy = obj.get('proxy');
        var axis = obj.get('axis');
        var minL, minT, maxL, maxT;
        var left, top;
        var grid = obj.get('grid');

        if(isIOS) {
            onDragging = true;
            clearTimeout(draggingTimer);
            draggingTimer = setTimeout(function() {
                onDragging = false;
            }, 100);
        }

        if(container) {
            var cw = container.outerWidth();
            var ch = container.outerHeight();
            var co = container.offset();
            minL = co.left;
            maxL = minL + cw - proxy.outerWidth();
            minT = co.top;
            maxT = minT + ch - proxy.outerHeight();
        } else {
            minL = doc.scrollLeft();
            maxL = minL + win.width() - proxy.outerWidth();
            minT = doc.scrollTop();
            maxT = minT + win.height() - proxy.outerHeight();
        }
        if(axis === 'x') {
            minT = maxT = element.offset().top;
        } else if(axis === 'y') {
            minL = maxL = element.offset().left;
        }

        left = e.pageX - diffX;
        top = e.pageY - diffY;

        if(grid) {
            var offset = proxy.offset();
            left = offset.left + floorNumber(left - offset.left, grid);
            top = offset.top + floorNumber(top - offset.top, grid);
        }
        dragging.css({
            left: Math.min(Math.max(left, minL), maxL),
            top: Math.min(Math.max(top, minT), maxT)
        });

        obj.trigger('drag', dragging, dropping, obj);
    }

    /*
     * 根据dragging和dropping位置来判断是否dragenter, dragleave和dragover并执行
     */
    function executeDragEnterLeaveOver() {
        var element = obj.element;
        var drop = obj.get('drop');
        var xleft = dragging.offset().left + diffX;
        var xtop = dragging.offset().top + diffY;
        if(drop !== null) {
            if(dropping === null) {
                if(drop) {
                    $.each(drop, function(index, elem) {
                        // 注意检测drop不是element或者proxy本身
                        if(isContain(elem, xleft, xtop) === true) {
                            dragging.css('cursor', 'copy');
                            dragging.focus();
                            dropping = $(elem);
                            obj.trigger('dragenter', dragging, dropping, obj);
                            return false; // 跳出each
                        }
                    });
                }
            } else {
                if(isContain(dropping, xleft, xtop) === false) {
                    dragging.css('cursor', 'move');
                    dragging.focus();

                    obj.trigger('dragleave', dragging, dropping, obj);
                    dropping = null;
                } else {
                    obj.trigger('dragover', dragging, dropping, obj);
                }
            }
        }
    }

    /*
     * 根据dropping判断是否drop并执行
     * 当dragging不在dropping内且不需要revert时, 将dragging置于dropping中央
     */
    function executeDrop() {
        var element = obj.element;
        var proxy = obj.get('proxy');
        var revert = obj.get('revert');

        if(dropping !== null) {
            if(isContain(dropping, proxy) === false && revert === false) { // 放置时不完全在drop中并且不需要返回的放置中央
                proxy.css('left', dropping.offset().left + (dropping.outerWidth() - proxy.outerWidth()) / 2);
                proxy.css('top', dropping.offset().top + (dropping.outerHeight() - proxy.outerHeight()) / 2);
            }
            obj.trigger('drop', dataTransfer, element, dropping, obj); // 此处传递的dragging为源节点element
        }
    }

    function executeDragEnd() {
        if(dragging !== null) {
            dragging.css('cursor', 'default');
            dragging.focus();
            dragging = null;

            executeDrop(); // 根据dropping判断是否drop并执行
            executeRevert(); // 根据revert判断是否要返回并执行
            obj.trigger('dragend', obj.element, dropping, obj); // 此处传递的dragging为源节点element
            obj = null;
            dropping = null;
        } else if(draggingPre === true) {
            // 点击而非拖放时
            obj.get('proxy').remove();
            obj.set('proxy', null);
            draggingPre = false;
            obj = null;
        }
    }

    /*
     * 判断元素B是否位于元素A内部 or 点(B, C)是否位于A内
     * error为了补全IE9,IE10对offset浮点值的差异,
     * 目前只是在判断container是否合法时使用error=1.0
     */
    function isContain(A, B, C) {
        var error = C;

        if(typeof B !== 'number') {
            if(typeof error !== 'number') {
                error = 0;
            }
            return $(A).offset().left - error <= $(B).offset().left && $(A).offset().left + $(A).outerWidth() >= $(B).offset().left + $(B).outerWidth() - error && $(A).offset().top - error <= $(B).offset().top && $(A).offset().top + $(A).outerHeight() >= $(B).offset().top + $(B).outerHeight() - error;
        } else {
            return $(A).offset().left <= B && $(A).offset().left + $(A).outerWidth() >= B && $(A).offset().top <= C && $(A).offset().top + $(A).outerHeight() >= C;
        }
    }

    /*
     * 根据revert判断是否要返回并执行
     * 若drop不为null且dropping为null, 则自动回到原处
     * flag为true表示必须返回的
     */
    function executeRevert() {
        var element = obj.element;
        var proxy = obj.get('proxy');
        var drop = obj.get('drop');
        var revert = obj.get('revert');
        var revertDuration = obj.get('revertDuration');
        var visible = obj.get('visible');
        var xleft = proxy.offset().left - element.offset().left;
        var xtop = proxy.offset().top - element.offset().top;

        if(revert === true || (dropping === null && drop !== null)) {
            //代理元素返回源节点初始位置
            element.attr('style', element.data('style'));
            if(visible === false) {
                element.css('visibility', 'hidden');
            }
            if(obj.get('animate') !== false) {
                proxy.animate({
                    left: element.offset().left,
                    top: element.offset().top
                }, revertDuration, function() {
                    element.css('visibility', '');
                    proxy.remove();
                });
            } else {
                proxy.remove();
            }
        } else {
            // 源节点移动到代理元素处
            if(element.css('position') === 'relative') {
                xleft = (isNaN(parseInt(element.css('left'))) ? 0 : parseInt(element.css('left'))) + xleft;
                xtop = (isNaN(parseInt(element.css('top'))) ? 0 : parseInt(element.css('top'))) + xtop;
            } else if(element.css('position') === 'absolute') {
                xleft = proxy.offset().left;
                xtop = proxy.offset().top;
            } else {
                element.css('position', obj.get('position') || 'relative');
            }

            if(visible === false) {
                element.css({
                    left: xleft,
                    top: xtop,
                    visibility: ''
                });
                proxy.remove();
            } else {
                if(obj.get('animate') !== false) {
                    element.animate({left: xleft, top: xtop}, revertDuration, function() {
                        proxy.remove();
                    });
                } else {
                    proxy.remove();
                }
            }
            if(obj.get('keepTop') === true) {
                element.css('zIndex', getMaxZIndex());
            }
        }
        obj.set('proxy', null);
    }

    function floorNumber(num, step) {
        return parseInt(num / step) * step;
    }

    var getMaxZIndex = (function(zIndex) {
        return function() {
            return zIndex++;
        };
    })(zIndex);

    Dnd.open();
    module.exports = Dnd;

});
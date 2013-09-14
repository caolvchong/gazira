/**
 * User: caolvchong@gmail.com
 * Date: 9/11/13
 * Time: 10:03 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Base = require('../base');
    var Dnd = require('./dnd');

    var Sortable = Base.extend({
        attrs: {
            element: { // 当前被排序的容器
                getter: function(val) {
                    if(typeof val === 'string') {
                        return $(val);
                    }
                    return val ? val : null;
                }
            },
            item: '',
            handler: null,
            connect: null,
            connectItem: '',
            placeholder: null,
            connectSelf: true,
            revert: false
        },
        initialize: function(config) {
            var that = this;
            Sortable.superclass.initialize.apply(this, arguments);

            var placeholder;
            var connect = this.get('connect') || [];
            var connectItem = this.get('connectItem');
            var box = [];
            var lastContainer; // 最后存放的容器

            (function() {
                if(!$.isArray(connect)) {
                    connect = [connect];
                }
                for(var i = 0, len = connect.length; i < len; i++) {
                    var c = connect[i];
                    c.element = $(c.element);
                    c.item = c.item || connectItem || this.get('item');
                    box.push(c.element);
                }
                if(this.get('connectSelf') !== false) {
                    connect.push({
                        element: this.get('element'),
                        item: this.get('item')
                    });
                    box.push(this.get('element'));
                }
            }).call(this);

            var dragElement = typeof this.get('item') === 'string' ? this.get('element').find(this.get('item')) : this.get('item');
            this.dnd = new Dnd({
                element: dragElement,
                handler: this.get('handler'),
                drop: box,
                position: dragElement.eq(0).css('position') || 'static'
            }).on('beforedrag',function(dnd) {
                    return that.trigger('beforedrag', dnd);
                }).on('dragstart',function(dataTransfer, dragging, dropping, dnd) {
                    lastContainer = null;
                    placeholder = that.get('placeholder') || this.element.clone().empty().css({
                        visibility: 'visible',
                        border: '1px dashed #ddd',
                        background: '#fff'
                    });
                    this.element.hide().after(placeholder);
                    that.trigger('dragstart', dataTransfer, dragging, dropping, dnd);
                }).on('drag',function(dragging, dropping, dnd) {
                    var proxy = this.get('proxy');
                    var element = this.element;

                    if(dropping) { // 划过可接纳的容器
                        lastContainer = dropping;
                        $(connect).each(function(m, b) {
                            if(dropping[0] === b.element[0]) {
                                var items = b.element.find(b.item).filter(':visible');
                                items.filter(function(i) {
                                    return items.eq(i)[0] !== proxy[0];
                                });
                                var inserted = false;
                                var len = items.length;
                                if(len === 0) { // 容器内无元素
                                    b.element.append(placeholder);
                                } else { // 容器内有元素
                                    for(var i = 0; i < len; i++) {
                                        var item = items.eq(i);
                                        if(placeholder[0] !== item[0]) {
                                            var position = hover(item, proxy);
                                            if(position) { // 划过某个元素
                                                item[position](element);
                                                element.after(placeholder);
                                                inserted = true;
                                                break;
                                            }
                                        }
                                    }
                                    if(!inserted) {
                                        b.element['prepend'](element);
                                        element.after(placeholder);
                                    }
                                }
                                return false;
                            }
                        });
                    }

                    that.trigger('drag', dragging, dropping, dnd);
                }).on('dragenter',function(dragging, dropping, dnd) {
                    that.trigger('dragenter', dragging, dropping, dnd);
                }).on('dragover',function(dragging, dropping, dnd) {
                    that.trigger('dragover', dragging, dropping, dnd);
                }).on('dragleave',function(dragging, dropping, dnd) {
                    that.trigger('dragleave', dragging, dropping, dnd);
                }).on('dragend',function(element, dropping, dnd) {
                    var node = this.element.css('position', this.element.data('style').position || '').show();
                    placeholder.replaceWith(node);
                    if(lastContainer && lastContainer[0] !== that.get('element')[0]) { // 存在dropping表明是拖放到可以存放的容器，若不是原来容器，则需要重新注册拖拽
                        that.dnd.destroy(that.get('handler') ? node.find(that.get('handler')) : node); // 将原来拖拽销毁
                        if(lastContainer.data('dnd')) { // 新容器存在拖放，则注册
                            lastContainer.data('dnd').render(node);
                        }
                        lastContainer = null;
                    }
                    that.trigger('dragend', element, dropping, dnd);
                }).on('drop', function(dataTransfer, element, dropping, dnd) {
                    that.trigger('drop', dataTransfer, element, dropping, dnd);
                });
            this.get('element').data('dnd', this.dnd); // 在容器缓存拖拽，以便给添加进来的对象注册
        }
    });

    function hover(node, target) {
        var o = node.offset();
        var w = node.outerWidth();
        var h = node.outerHeight();
        var pTop = o.top;
        var pLeft = o.left;
        var pHTop = pTop + h / 2;
        var pHLeft = pLeft + w / 2;
        var pBottom = pTop + h;
        var pRight = pLeft + w;

        var t = target.offset();
        var top = t.top;
        var left = t.left;
        var bottom = top + target.outerHeight();
        var right = left + target.outerWidth();

        var result = false;
        var flag = (left > pLeft && left < pHLeft) || (right < pRight && right > pHLeft);
        if(flag) {
            if(top > pTop && top < pHTop) {
                result = 'before';
            } else if(bottom < pBottom && bottom > pHTop) {
                result = 'after';
            }
        }
        return result;
    }

    module.exports = Sortable;
});
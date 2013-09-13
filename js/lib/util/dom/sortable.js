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
            placeholder: null
        },
        initialize: function(config) {
            var that = this;
            Sortable.superclass.initialize.apply(this, arguments);

            var placeholder = this.get('placeholder');
            var connect = this.get('connect') || [];
            var connectItem = this.get('connectItem');
            var box = [];
            var _drop;
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
                    _drop = false;
                    placeholder = placeholder || this.element.clone().empty().css({
                        visibility: 'visible',
                        border: '1px dashed #ddd',
                        background: '#fff'
                    });
                    this.element.hide().after(placeholder);
                    that.trigger('dragstart', dataTransfer, dragging, dropping, dnd);
                }).on('drag',function(dragging, dropping, dnd) {
                    var proxy = this.get('proxy');
                    $(connect).each(function(m, b) {
                        if(hover(b.element, proxy)) {
                            var items = b.element.find(b.item);
                            var len = items.length;
                            if(len === 0) {
                                b.element.append(placeholder);
                            } else {
                                for(var i = 0; i < len; i++) {
                                    var item = items.eq(i);
                                    if(item.is(':visible')) {
                                        var position = hover(item, proxy);
                                        if(position) {
                                            item[position](placeholder);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    });
                    that.trigger('drag', dragging, dropping, dnd);
                }).on('dragenter', function(dragging, dropping, dnd) {
                    that.trigger('dragenter', dragging, dropping, dnd);
                }).on('dragover', function(dragging, dropping, dnd) {
                    that.trigger('dragover', dragging, dropping, dnd);
                }).on('dragleave', function(dragging, dropping, dnd) {
                    that.trigger('dragleave', dragging, dropping, dnd);
                }).on('dragend', function(element, dropping, dnd) {
                    if(!_drop) {
                        placeholder.replaceWith(this.element.css('position', this.element.data('style').position || '').show());
                    }
                    that.trigger('dragend', element, dropping, dnd);
                }).on('drop', function(dataTransfer, element, dropping, dnd) {
                    _drop = true;
                    placeholder.replaceWith(this.element.css('position', this.element.data('style').position || '').show());
                    that.trigger('drop', dataTransfer, element, dropping, dnd);
                });
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
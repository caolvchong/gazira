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

            var placeholder;
            var connect = this.get('connect') || [];
            var connectItem = this.get('connectItem');
            var box = [];
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
                    placeholder = that.get('placeholder') || this.element.clone().empty().css({
                        visibility: 'visible',
                        border: '1px dashed #ddd',
                        background: '#fff'
                    });
                    this.element.hide().after(placeholder);
                    that.trigger('dragstart', dataTransfer, dragging, dropping, dnd);
                }).on('drag',function(dragging, dropping, dnd) {
                    var proxy = this.get('proxy');
                    $(connect).each(function(m, b) {
                        var dropPosition = hover(b.element, proxy); // 是否划过容器
                        if(dropPosition) {
                            var items = b.element.find(b.item).filter(':visible');
                            items.filter(function(i) {
                                return items.eq(i)[0] !== proxy[0];
                            });
                            var len = items.length;
                            if(len === 0) {
                                b.element.append(placeholder);
                            } else {
                                for(var i = 0; i < len; i++) {
                                    var item = items.eq(i);
                                    if(placeholder[0] !== item[0]) {
                                        var position = hover(item, proxy);
                                        if(position) {
                                            placeholder.remove();
                                            placeholder = that.get('placeholder') || item.clone().empty().css({
                                                visibility: 'visible',
                                                border: '1px dashed #ddd',
                                                background: '#fff'
                                            });
                                            item[position](placeholder);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    });
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
                    if(dropping[0] !== that.get('element')[0]) {
                        that.dnd.disable(that.get('handler') ? node.find(that.get('handler')) : node);
                        if(dropping.data('dnd')) {
                            dropping.data('dnd').render(node);
                        }
                    }
                    that.trigger('dragend', element, dropping, dnd);
                }).on('drop', function(dataTransfer, element, dropping, dnd) {
                    that.trigger('drop', dataTransfer, element, dropping, dnd);
                });
            this.get('element').data('dnd', this.dnd);
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
/**
 * User: caolvchong@gmail.com
 * Date: 10/10/13
 * Time: 9:11 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Widget = require('../widget');
    var Filter = require('./filter');
    var AutoComplete = require('./autocomplete');

    var AC = AutoComplete.extend({
        setup: function() {
            AC.superclass.setup.call(this);
            this.selectedCache = []; // 选中的缓存
        },
        selectItem: function() {
            this.hide();

            var item = this.currentItem;
            var index = this.get('selectedIndex');
            var data = this.get('data')[index];
            if(item) {
                var trigger = this.get('trigger');
                var matchKey = item.attr('data-value');
                trigger.val('');
                this.set('inputValue', matchKey, {silent: true});
                this.trigger('itemSelect', data);
                this._clear();
                trigger.focus();
                this.trigger('selectItem', matchKey, item.text(), data, item);
            }
        }
    });

    var Selector = Widget.extend({
        attrs: {
            template: '<div class="widget-selector clearfix"><input type="text" data-role="input" class="widget-selector-input"/><pre class="hide" data-role="width"></pre></div>'
        },
        events: {
            'click [data-role=del]': function(e) {
                this._removeItem($(e.target).parent());
                return false;
            },
            'click': function() {
                this.$('[data-role=input]').eq(0).focus();
            },
            'keydown': function(e) {
                var trigger = this.$('[data-role=input]').eq(0);
                if(e.keyCode === 8 && trigger.val().length === 0) {
                    this._removeItem(this.$('[data-role=input]').eq(0).prev());
                }
            }
        },
        setup: function() {
            var that = this;
            var trigger = this.$('[data-role=input]').eq(0);
            var widthNode = this.$('[data-role=width]');
            Selector.superclass.setup.call(this);

            var hasInCache = this.get('hasInCache');
            var config = this.get('autocomplete');
            var filter = config.filter || Filter.startsWith;
            var inputor;
            if(config.attrs) {
                inputor = config.attrs.inputor;
            }
            config.trigger = trigger;
            config.align = config.align || {
                baseXY: [0, '100%'],
                baseElement: this.get('parentNode')
            };
            config.filter = function(data, query) {
                var result = [];
                var cache = this.selectedCache;
                $.each(data, function(index, value) {
                    var flag = true;
                    if(hasInCache) {
                        flag = !hasInCache(value, cache);
                    } else {
                        value = value.value ? value.value : value;
                        if($.inArray(value, cache) > -1) {
                            flag = false;
                        }
                    }
                    if(flag) {
                        result.push(value);
                    }
                });
                result = filter(result, query, cache);
                return result;
            };
            config.inputor = function(text) {
                if(inputor) {
                    inputor.call(ac, text);
                }
                widthNode.text(text);
                trigger.width(Math.max(15, widthNode.width()));
            };
            var ac = this.autoComplete = new AC(config).render();
            this.autoComplete.on('selectItem', function(val, text, data, item) {
                that.addItem(val, text);
            });
            this.autoComplete.after('selectItem', function() {
                setTimeout(function() {
                    trigger.focus();
                }, 1);
            });
        },
        result: function() {
            return this.autoComplete.selectedCache;
        },
        addItem: function(val, text) {
            var trigger = this.$('[data-role=input]').eq(0);
            var html = '<div class="widget-selector-item" data-role="selectedItem" data-value="' + val + '"><em>' + text + '</em> <span data-role="del">x</span></div>';
            this.autoComplete.selectedCache.push(val + '');
            trigger.before(html);
        },
        _removeItem: function(node) {
            var val = node.attr('data-value');
            var cache = this.autoComplete.selectedCache;
            for(var i = 0, len = cache.length; i < len; i++) {
                if(cache[i] === val) {
                    cache.splice(i, 1);
                    break;
                }
            }
            node.remove();
            this.$('[data-role=input]').eq(0).focus();
        }
    });

    return Selector;
});
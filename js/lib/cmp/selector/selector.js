/**
 * @fileoverview 选择器组件
 * @author chengbapi<chengabpi@gmail.com>
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Widget = require('../widget');

    /**
     * @name Selector
     * @class 选择器基类
     * @constructor
     * @extends Widget
     * @requires jQuery
     * @param {Object} config 组件配置
     * @property {number|Array.<number>} config.number 选择个数限制
     * @property {Array.<option>} config.options 所有选项
     * @property {Array.<option>} config.seleted 已选的选项
     * @property {Element} config.optionContainer 选项DOM Element的父节点
     * @property {String|Function} config.optionTemplate 渲染DOM的string或模板
     * @property {string} config.className 为父节点增加的新类名
     * @property {string} config.optionClassName 为选项DOM节点增加的新类名
     * @property {string} config.triggerType 触发选择的事件类型
     * @property {Array.<option>} config.selectable 可选的选项，默认为所有选项
     * @property {Array.<option>} config.unselectable 不可选的选项，默认为空
     * @property {Function} config.onSelect 选择的自定义事件
     * @property {Function} config.onUnselect 取消选择的自定义事件
     * @property {Function} config.onSelect 选择的自定义事件
     * @property {Function} config.onOverflow 当所选选项个数超出限定时的自定义事件
     * @property {Function} config.onSelectTwice 选择后再次选择的自定义事件
     * @property {Function} config.onUnselectable 选择了不可选选项的自定义事件
     * @example
     *  new Selector({
     *    number: [2, 3],
     *    options: options,
     *    onSelect: function(target, option, selected) {
     *      conosle.log(option);
     *    }
     *  });
     */

    var Selector = Widget.extend({
        attrs: {
            className: 'widget-select',

            number: 1,
            options: [],
            selected: [],
            optionContainer: null,
            optionTemplate: '<div></div>',
            optionClassName: 'widget-option',

            selectable: [],
            unselectable: [],

            triggerType: 'click',

            /**
             * @param {Element} target 选项绑定的DOM
             * @param {object} option 选项
             * @param {Array.<option>} selected 所有已选的选项
             */
            onSelect: function(target, option, selected) {  },
            onUnselect: function(target, option, selected) {  },
            onOverflow: function(target, option, selected) {  },
            onSelectTwice: function(target, option, selected) { return this.unselect(target); },
            onUnselectable: function(target, option, selected) {  }
        },
        setup: function() {
            this._normalizeAttr();
            this.setupSelectable();
            this.setupDOM();

            // select option in selected for the first time
            // this.trigger('change: selected')(null, );
            // bind event after first trigger change event
            this.bindEvents();
        },
        _normalizeAttr: function() {
            var number = this.get('number');
            var options = this.get('options');
            var optionContainer = this.get('optionContainer');

            if (!isNumber(number) && !isArray(number)) {
                throw new Error('Usage: number should be a number or array!');
            }
            if (isNumber(number)) {
                this.set('number', [number, number]);
            }
            if (!isArray(options)) {
                throw new Error('Usage: options should be an array!');
            }

            if (!optionContainer) {
                optionContainer = this.element;
            }
            this.set('optionContainer', $(optionContainer));

        },
        setupSelectable: function() {
            var options = this.get('options');
            var selectable = this.get('selectable');
            var unselectable = this.get('unselectable');
            if (selectable.length > 0) {
                // default: unselectable
                unselectable.length = 0;
                $.each(options, function(index, option) {
                    if (indexOf(selectable, option) === -1) {
                        unselectable.push(option);
                    }
                });
            } else {
                // default: selectable
                selectable.length = 0;
                $.each(options, function(index, option) {
                    if (indexOf(unselectable, option) === -1) {
                        selectable.push(option);
                    }
                });
            }
        },
        setupDOM: function() {
            var DOM, $DOM;
            var options = this.get('options');
            var optionTemplate = this.get('optionTemplate');
            var optionContainer = this.get('optionContainer');
            var optionClassName = this.get('optionClassName');
            optionContainer.html("");
            $.each(options, function(index, option) {
                if (isFunction(optionTemplate)) {
                    DOM = optionTemplate(option);

                } else {
                    DOM = optionTemplate;
                }
                $DOM = $(DOM);
                $DOM.addClass(optionClassName).data('option-data', option);
                optionContainer.append($DOM);
            });
        },
        refresh: function() {
            this._normalizeAttr();
            this.setupSelectable();
            this.setupDOM();
        },
        bindEvents: function() {
            var self = this;
            var SPACE_RE = /(\s+)/g;
            var optionContainer = this.get('optionContainer');
            var optionClassName = this.get('optionClassName');
            // className: 'a b c d' -> '.a.b.c.d'
            var normalizedClassName = (" " + optionClassName + " ").replace(SPACE_RE, function(m, m1) { return '.'; }).slice(0, -1);
            optionContainer.on(this.get('triggerType'), normalizedClassName, function(e) {
                self.select($(e.target));
            });
        },
        select: function(target) {
            // selectable
            var number = this.get('number');
            var options = this.get('options');
            var selected = this.get('selected');
            var option = $(target).data('option-data');
            if (indexOf(this.get('unselectable'), option) !== -1) {
                return this.trigger('unselectable', target, option, selected);
            }
            if (indexOf(this.get('selected'), option) !== -1) {
                return this.trigger('selectTwice', target, option, selected);
            }
            // number
            if (selected.length + 1 > number[1]) {
                return this.trigger('overflow', target, option, selected);
            }
            // normal
            selected.push(option);
            this.trigger('select', target, option, selected);
            return selected;
        },
        unselect: function(target) {
            var selected = this.get('selected');
            var option = $(target).data('option-data');
            var index = indexOf(selected, option);
            if (index !== -1) {
                selected.splice(index, 1);
                // trigger event
                this.trigger('unselect', target, option, selected);
            }
            return selected;
        },
        validateSelected: function() {
            var selected = this.get('selected');
            var number = this.get('number');
            if (selected.length < number[0]) {
                return false;
            }
            if (selected.length > number[1]) {
                return false;
            }
            return true;
        },
        getSelected: function() {
            return this.get('selected');
        },
        // Bug: SubClass extended from overlay.render trigger render events....
        _onRenderOptions: function() {
            this.refresh();
        },
        //_onRenderSelected: function() {
            //this.refresh();
        //},
        _onRenderSelectable: function() {
            this.refresh();
        },
        _onRenderUnselectable: function() {
            this.get('selectable').length = 0;
            this.refresh();
        }

    });


    // helper
    function isType(obj, type) { return Object.prototype.toString.call(obj) === '[object ' + type + ']'; }

    function isArray(obj) { return isType(obj, 'Array'); }
    function isFunction(obj) { return isType(obj, 'Function'); }
    function isNumber(obj) { return isType(obj, 'Number'); }

    function indexOf(arr, obj) {
        if (Array.prototype.indexOf) {
            return arr.indexOf(obj);
        }
        var i;
        for (i = 0; i < arr.length; i++) {
            if (arr[i] === obj) {
                return i;
            }
        }
        return -1;
    }

    module.exports = Selector;
});

/**
 * @fileoverview 表情选择器
 * @author chengbapi<chengabpi@gmail.com>
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Overlay = require('../overlay');
    var Selector = require('./selector');
    var Tabs = require('../switchable/tabs');

    /**
     * @name ExpressionSelector
     * @class 表情选择器
     * @constructor
     * @extends Overlay
     * @requires jQuery
     * @requires Selector
     * @requires Tabs
     * @param {Object} config 组件配置
     * @property {Object} config.align 定位元素和参数
     * @property {String|Function} config.optionTemplate 渲染DOM的string或模板
     * @property {Array.<group>} config.data 分组数据源
     * @property {Function} config.transport 输出所选表情
     * @see Selector
     * @example
     *  new ExpressionSelector({
     *    element: DOM,
     *    data: data,
     *    transport: function(option) {
     *      console.log(option);
     *    }
     *  }).render();
     */
    var ExpressionSelector = Overlay.extend({
        attrs: {
            element: null,
            target: null,

            optionTemplate: function(data){ return "<a title=" + data.title + " href='#' />";  },
            transport: function(option) {
                var output;
                if (option.type === '默认') {
                  output = "[" + option.title + "]";
                } else if (option.type === "符号表情") {
                  output = "<" + option.title + ">";
                }
                var target = this.get('target');
                insertAtCaret(target, output);
            }
        },
        setup: function() {
            ExpressionSelector.superclass.setup.call(this);
            this._initDOM();

            this._blurHide();
        },
        _initDOM: function() {
            var element = this.get('element');
            var triggers = $("<div>").addClass('expr-tabs');
            var panels = $("<div>").addClass('expr-panels');

            element.append(triggers).append(panels);
        },
        addGroup: function(options) {
            // add type to option
            this._addType(options);
            this._addTab(options);
            this._addSelector(options);
        },
        _addType: function(options) {
            $.each(options.data, function(index, option) {
                option.type = options.name;
            });
        },
        _addTab: function(options) {
            var element = this.get('element');
            var triggers = $('.expr-tabs', element);
            var panels = $('.expr-panels', element);

            var name = options.name;

            triggers.append($("<div>").addClass('expr-tab').html(name));
            panels.append($("<div>").addClass('expr-panel'));
        },
        _addSelector: function(options) {
            var self = this;
            var element = this.get('element');
            var panels = $('.expr-panels', element);

            var data = options.data;

            var Export = options.transport || this.get('transport');
            var optionTemplate = options.optionTemplate || this.get('optionTemplate');
            var onSelect = function(target, option, seleted) {
                this.get('Export').call(self, option);
                this.get('selected').length = 0;
                self.hide();
            };

            new Selector({
                number: 1,
                optionClassName: 'expr-option',
                options: data,
                element: panels.children().last(),
                optionTemplate: optionTemplate,
                onSelect: onSelect,
                Export: Export
            });
        },
        _setupTabs: function() {
            var element = this.get('element');
            var triggers = $("<div>").addClass('expr-tabs');

            new Tabs({
                element: element,
                triggers: '.expr-tabs .expr-tab',
                panels: '.expr-panels .expr-panel',
                activeTriggerClass: 'active',
                triggerType: 'click'
            });

        },
        render: function() {
            this._setupTabs();
            Overlay.prototype.render.call(this);
        }
    });

    module.exports = ExpressionSelector;

    // helper
    function insertAtCaret(target,text) {
        var txtarea = $(target)[0];
        var scrollPos = txtarea.scrollTop;
        var strPos = 0;
        var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
            "ff" : (document.selection ? "ie" : false ) );
        if (br == "ie") {
            txtarea.focus();
            var range = document.selection.createRange();
            range.moveStart ('character', -txtarea.value.length);
            strPos = range.text.length;
        }
        else if (br == "ff") strPos = txtarea.selectionStart;

        var front = (txtarea.value).substring(0,strPos);
        var back = (txtarea.value).substring(strPos,txtarea.value.length);
        txtarea.value=front+text+back;
        strPos = strPos + text.length;
        if (br == "ie") {
            txtarea.focus();
            var range = document.selection.createRange();
            range.moveStart ('character', -txtarea.value.length);
            range.moveStart ('character', strPos);
            range.moveEnd ('character', 0);
            range.select();
        }
        else if (br == "ff") {
            txtarea.selectionStart = strPos;
            txtarea.selectionEnd = strPos;
            txtarea.focus();
        }
        txtarea.scrollTop = scrollPos;
    }

});


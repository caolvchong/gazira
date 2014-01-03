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

            data: [],
            optionTemplate: function(data){ return "<img title=" + data.title +  " alt='" + data.title + "' src='" + "smile/" + data.filename + "' />";  },
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
            this._parseOpitions();
            ExpressionSelector.superclass.setup.call(this);
            this._setupTabs();
            this._setupSelector();

            this._blurHide();
        },
        _parseOpitions: function() {
            var data = this.get('data');
            var groups = [];
            var options = [];

            $.each(data, function(index, group) {
                groups.push({ id: group.id, title: group.title });
                options[index] = group.smileys;
            });

            this.set('options', options);
            this.set('groups', groups);
        },
        _setupTabs: function() {
            var element = this.get('element');
            var groups = this.get('groups');
            var triggers = $("<div>").addClass('expr-tabs');
            var panels = $("<div>").addClass('expr-panels');

            $.each(groups, function(index, group) {
                triggers.append($("<div>").addClass('expr-tab').html(group.title));
                panels.append($("<div>").addClass('expr-panel'));
            });

            element.append(triggers).append(panels);

            new Tabs({
                element: element,
                triggers: '.expr-tabs .expr-tab',
                panels: '.expr-panels .expr-panel',
                activeTriggerClass: 'active',
                triggerType: 'click'
            });

            // for setup selector
            this.set('panels', panels);
        },
        _setupSelector: function() {
            var self = this;
            var options = this.get('options');
            var panels = $(this.get('panels'));
            var Export = this.get('transport');
            var optionTemplate = this.get('optionTemplate');
            var onSelect = function(target, option, seleted) {
                this.get('Export').call(self, option);
                this.get('selected').length = 0;
                self.hide();
            };

            $.each(options, function(index, option) {
                new Selector({
                    number: 1,
                    optionClassName: 'expr-option',
                    options: option,
                    element: panels.children().eq(index),
                    optionTemplate: optionTemplate,
                    onSelect: onSelect,
                    Export: Export
                });
            });
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


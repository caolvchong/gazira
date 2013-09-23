define(function(require, exports, module) {
    var Base = require('../../../../util/base');
    var Dialog = require('../ui/dialog');
    var UE = require('../editor');

    /**
     * title 弹窗标题
     * content 弹窗内容
     * name 插件名
     */
    var DialogBase = Base.extend({
        attrs: {
            name: '',
            title: '',
            content: ''
        },
        initialize: function() {
            var that = this;
            DialogBase.superclass.initialize.apply(this, arguments);
            var getDialog = (function() {
                var dialog;
                return function() {
                    if(!dialog) {
                        that.editor = this;
                        that.dialog = dialog = new Dialog({
                            title: that.get('title'),
                            content: that.get('content'),
                            editor: this
                        });
                        that.trigger('init', that.dialog, that.editor);
                    }
                    return dialog;
                };
            })();
            this.plugin = UE.commands[this.get('name')] = {
                execCommand: function(cmdName) {
                    var dialog = getDialog.call(this);
                    dialog.open();
                    that.trigger('execCommand', dialog);
                },
                queryCommandState: function(cmdName) { // -1禁用状态，按钮不可点; 0正常状态，可以点击; 1选中状态
                    that.trigger('queryCommandState');
                }
            }
        }
    });

    module.exports = DialogBase;
});
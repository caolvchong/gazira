/**
 * User: caolvchong@gmail.com
 * Date: 10/23/13
 * Time: 6:10 PM
 */
define(function(require, exports, module) {
    var UE = require('./editor');
    var EditorUI = require('./ui/editorui');
    var Dialog = require('./ui/dialog');

    /**
     *
     * @param config
     *     name: 插件名称，用来注册到ueditor
     *     description: 描述
     *     execCommand(cmdName, dialog): 点击toolbar，调用插件，大部分逻辑都在这里写
     *     queryCommand(cmdName, dialog): 状态处理
     *     init(dialog, config): 初始化后处理函数
     *     dialog: 是否使用弹出层，注意：dialog关闭后其中的内容会清除，但dialog本身不会从dom移除
     *         title: 标题,默认同description
     *         content: 内容
     */
    UE.addPlugin = function(config) {
        if(!UE.commands[config.name]) {
            var dialog;
            var init = true;
            var getDialog = (function() {
                var dialog;
                return function() {
                    if(!dialog) {
                        dialog = new Dialog({
                            title: config.dialog.title || config.descrition || '',
                            content: config.dialog.content || '',
                            editor: this
                        });
                    }
                    return dialog;
                };
            })();

            EditorUI.addButton(config.name, config.description);
            UE.commands[config.name] = {
                execCommand : function(cmdName){
                    if(config.dialog) {
                        dialog = getDialog.call(this);
                    }
                    config.execCommand && config.execCommand.call(this, cmdName, dialog);
                    if(init) {
                        config.init && config.init.call(this, dialog, config);
                    }
                },
                queryCommandState:function(cmdName){ // -1禁用状态，按钮不可点; 0正常状态，可以点击; 1选中状态
                    return config.queryCommandState && config.queryCommandState.call(this, cmdName, dialog);
                }
            };
        }
    };

    module.exports = UE.addPlugin;
});
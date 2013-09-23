/**
 * User: caolvchong@gmail.com
 * Date: 9/5/13
 * Time: 11:36 PM
 */
define(function(require, exports, module) {
    var DialogBase = require('../dialog-base');
    var Action = require('../../../../../util/dom/action');
    var tpl = require('./tpl/content');

    var plugin = new DialogBase({
        name: 'dialog',
        title: '弹窗示例',
        content: tpl.render()
    });
    plugin.on('init', function(dialog, editor) {
        console.log(dialog);
        Action.listen({
            UEPluginDialogBtn: function(e, node, type) {
                editor.execCommand('insertHtml', node.prev().val());
                dialog.close();
            }
        });
    });

    module.exports = plugin.plugin;
});
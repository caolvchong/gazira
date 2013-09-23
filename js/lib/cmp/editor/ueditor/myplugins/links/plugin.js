define(function(require, exports, module) {
    var $ = require('$');
    var DialogBase = require('../dialog-base');
    var Action = require('../../../../../util/dom/action');
    var tpl = require('./tpl/content');

    var plugin = new DialogBase({
        name: 'links',
        title: '插入连接',
        content: tpl.render()
    });
    plugin.on('init', function(dialog, editor) {
        Action.listen({
            UEPluginLinksBtn: function(e, node, type) {
                var p = node.closest('.ue-plugin-links');
                var hrefNode = p.find('[data-role=href]').eq(0);
                var textNode = p.find('[data-role=text]').eq(0);
                var href = $.trim(hrefNode.val());
                var text = $.trim(textNode.val());
                var title = $.trim(p.find('[data-role=title]').eq(0).val());
                if(href) {
                    editor.execCommand('link', {
                        href: /\/\//.test(href) ? href : ('http://' + href),
                        textValue: text || href,
                        title: title || ''
                    });
                }
                dialog.close();
            }
        });
    });

    module.exports = plugin.plugin;
});
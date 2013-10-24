define(function(require, exports, module) {
    var $ = require('$');
    var Plugin = require('../../plugin');
    var tpl = require('./tpl/content');

    Plugin({
        name: 'links',
        description: '插入连接',
        dialog: {
            content: tpl.render()
        },
        execCommand: function(cmdName, dialog) {
            dialog.open();
            var node = $(dialog.getDom());
            var that = this;

            node.find('[data-action=UEPluginLinksBtn]').click(function() {
                var hrefNode = node.find('[data-role=href]').eq(0);
                var textNode = node.find('[data-role=text]').eq(0);
                var href = $.trim(hrefNode.val());
                var text = $.trim(textNode.val());
                var title = $.trim(node.find('[data-role=title]').eq(0).val());
                if(href) {
                    that.execCommand('link', {
                        href: /\/\//.test(href) ? href : ('http://' + href),
                        textValue: text || href,
                        title: title || ''
                    });
                }
                dialog.close();
            });
        }
    });
});
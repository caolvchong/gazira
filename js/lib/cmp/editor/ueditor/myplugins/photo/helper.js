/**
 * User: caolvchong@gmail.com
 * Date: 9/18/13
 * Time: 2:58 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var String = require('../../../../../util/string');
    var tpl = require('./tpl/item');

    module.exports = {
        item: function(file, node, msg) {
            var name = file.name;
            msg = msg || '';
            if(String.blength(name) > 20) {
                name = String.cut(name, 10, true) + '...' + String.cut(name, 7, {
                    dir: 'right',
                    fullSharp: true
                });
            }
            $(node).append(tpl.render({
                file: file,
                msg: msg,
                name: name
            }));
        },
        progress: function(file, loaded, total) {
            var node = $('#upfile_' + file.index).find('.progress');
            if(loaded === total) {
                node.hide();
            } else {
                node.text((loaded / total * 100).toFixed(2) + '%')
            }
        },
        tip: function(file, type, msg) {
            var node = $('#upfile_' + file.index);
            node.find('.progress').hide();
            if(type == 'success') {
                node.find('.tip').addClass('success').removeClass('error').text(msg || '上传成功');
            } else if(type == 'failure') {
                node.find('.tip').addClass('error').removeClass('success').text(msg || '上传失败');
            }
        }
    };
});
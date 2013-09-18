/**
 * User: caolvchong@gmail.com
 * Date: 9/18/13
 * Time: 2:58 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var String = require('../../../../../js/lib/util/string');
    var tpl = require('./item');

    module.exports = {
        item: function(file, msg, node, which) {
            var name = file.name;
            msg = msg || '';
            if(String.blength(name) > 20) {
                name = String.cut(name, 10, true) + '...' + String.cut(name, 7, {
                    dir: 'right',
                    fullSharp: true
                });
            }
            $(node || '#result').append(tpl.render({
                file: file,
                msg: msg,
                name: name,
                which: which
            }));
        },
        progress: function(file, loaded, total, which) {
            var node = $('#upfile_' + (which ? which + '_' : '') + file.index).find('.progress');
            if(loaded === total) {
                node.hide();
            } else {
                node.text((loaded / total * 100).toFixed(2) + '%')
            }
        },
        tip: function(file, type, msg, which) {
            var node = $('#upfile_' + (which ? which + '_' : '') + file.index);
            node.find('.progress').hide();
            if(type == 'success') {
                node.find('.tip').addClass('success').removeClass('error').text(msg || '上传成功');
            } else if(type == 'failure') {
                node.find('.tip').addClass('error').removeClass('success').text(msg || '上传失败');
            }
        },
        result: function() {
            var list = $('#result>.item');
            var arr = [];
            for(var i = 0, len = list.length; i < len; i++) {
                var node = list.eq(i);
                var id = node.attr('data-id');
                if(id != 0) {
                    arr.push(id);
                }
            }
            return arr;
        }
    };
});
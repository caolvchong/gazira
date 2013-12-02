/**
 * User: caolvchong@gmail.com
 * Date: 9/16/13
 * Time: 11:48 AM
 */
define(function(require, exports, module) {
    var $ = require('$');

    var isSupportHTML5Upload = false;

    (function() {
        if(typeof XMLHttpRequest != 'undefined') {
            var xhr = new XMLHttpRequest();
            isSupportHTML5Upload = !!xhr.upload;
        }
    })();

    var helper = {
        addEventListener: function(node, type, action) {
            node.addEventListener(type, function(e) {
                var files = e.target.files || e.dataTransfer.files;
                if(type === 'drop') {
                    try {
                        if(files && files.length) {
                            action && action(e, files);
                        }
                    } catch(e) {
                    }
                } else {
                    action && action(e, files);
                }
                e.stopPropagation();
                e.preventDefault();
            }, false);
        }
    };

    /**
     * HTML5 上传
     * 对接受容器加入dragenter,dragover, dragleave, drop 事件
     * @param params
     */
    var DragUpload = {
        bind: function(params) {
            params = params || {};
            var node = params.node || document.body;
            var arr = ['dragenter', 'dragover', 'dragleave', 'drop'];
            $.each(arr, function(i, key) {
                helper.addEventListener(node, key, params[key]);
            });
            return {
                unbind: function() {
                    $.each(arr, function(i, key) {
                        helper.removeEventListener(node, key, params[key]);
                    });
                }
            };
        },
        isSupportHTML5Upload: isSupportHTML5Upload
    };

    $(function() {
        if(isSupportHTML5Upload) {
            helper.addEventListener(document.body, 'drop', function(e) { // 防止拖拽到非目标区域，浏览器直接打开
                e.stopPropagation();
                e.preventDefault();
            });
        }
    });

    module.exports = DragUpload;
});
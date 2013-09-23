define(function(require, exports, module) {
    var $ = require('$');
    var DialogBase = require('../dialog-base');
    var Action = require('../../../../../util/dom/action');
    var tpl = require('./tpl/content');

    var Upload = require('../../../../../util/dom/upload/upload');
    var helper = require('./helper');

    var u;

    var plugin = new DialogBase({
        name: 'photo',
        title: '插入图片',
        content: tpl.render({
            supportDraggable: Upload.isSupportHTML5Upload
        })
    });
    plugin.on('init',function(dialog, editor) { // 初始化，只跑一次
        Action.listen({
            UEPluginPhotoBtn: function(e, node, type) {
                var p = $('.ue-plugin-photo').eq(0);
                var list = p.find('.item[data-id!=0]');

                var arr = [];
                list.each(function(i, div) {
                    arr.push({
                        src: 'http://192.168.57.103/avatar.jpg'
                    });
                });
                console.log(arr, list);
                editor.fireEvent('beforeInsertImage', arr);
                editor.execCommand("insertImage", arr);

                dialog.close();
                u = null;
            },
            UEPluginPhotoDel: function(e, node, type) {
                u.remove(node.closest('.item').data('index'));
            }
        });
    }).on('execCommand', function(dialog, editor) { // 打开dialog后
            var p = $('.ue-plugin-photo').eq(0);
            var resultNode = p.find('.upload-result').eq(0);
            u = new Upload({
                url: 'http://localhost/gazira/demo/lib/util/dom/upload/upload.php',
                swf: 'http://localhost/gazira/public/swf/swfupload.swf',
                node: p.find(':file').eq(0),
                container: p,
                type: '*.jpg; *.gif; *.png',
                maxSize: '3MB', // 文件大小限制
                maxCount: 15, // 文件数量限制，-1不限制
                multi: true, // 是否允许多文件上传
                max: 2,
                fileName: 'Filedata',
                data: {},
                text: '上传'
            }).on('overSizeLimit',function(size, file) { // 超过大小限制
                    helper.item(file, resultNode, '超过' + size + '大小限制');
                }).on('zeroSize',function(file) { // 空文件
                    helper.item(file, resultNode, '空文件');
                }).on('overCountLimit',function(limit) { // 超过数量限制
                    alert('超过数量限制：' + limit + '，不能再增加文件');
                }).on('notAllowType',function(file) { // 不允许文件类型
                    helper.item(file, resultNode, '文件类型不允许');
                }).on('successAdd',function(file, files) { // 成功加入队列
                    helper.item(file, resultNode);
                    Upload.preview && Upload.preview(file, function(file, result) {
                        $('#upfile_' + file.index).prepend('<img src="' + result + '" width="100" class="photo-preview"/>');
                    });
                    u.upload();
                }).on('errorAdd',function(file, files) { // 加入队列失败
                    le.log('failureAdd');
                }).on('progress',function(file, loaded, total) { // 上传进度
                    helper.progress(file, loaded, total);
                }).on('success',function(file, data) { // 上传成功
                    console.log(data);
                    helper.tip(file, 'success');
                    data = data.data;
                    $('#upfile_' + file.index).attr('data-id', data.id);
                }).on('error',function(file, data) { // 文件上传失败时或者被终止时触发，引起的可能性有：上传地址不存在/主动终止
                    console.log(data);
                    helper.tip(file, 'failure');
                }).on('complete',function(file) { // 上传文件完成，无论失败成功
                    console.log('complete');
                }).on('finish',function(file) { // 上传所有文件完成
                    console.log('finish');
                }).on('reset',function() {
                    resultNode.html('');
                }).on('abort',function(file, index) {
                    console.log('abort:', file, index);
                }).on('remove',function(file, index) {
                    $('#upfile_' + index).remove();
                }).on('drop', function(files) {
                    this.add(files);
                });
        });

    module.exports = plugin.plugin;
});
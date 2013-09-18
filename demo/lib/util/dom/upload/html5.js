/**
 * User: caolvchong@gmail.com
 * Date: 9/17/13
 * Time: 11:27 AM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var helper = require('./helper');
    var Action = require('../../../../../js/lib/util/dom/action');
    var Upload = require('../../../../../js/lib/util/dom/upload/upload-html5');

    $(function() {
        var u = new Upload({
            url: 'http://localhost/gazira/demo/lib/util/dom/upload/upload.php',
            node: '#btn',
            type: '*.jpg; *.gif; *.png',
            maxSize: '3MB', // 文件大小限制
            maxCount: 5, // 文件数量限制，-1不限制
            multi: true, // 是否允许多文件上传

            max:2,

            fileName: 'Filedata',
            data: {}

        }).on('overSizeLimit',function(size, file) { // 超过大小限制
                helper.item(file, '超过' + size + '大小限制');
            }).on('zeroSize',function(file) { // 空文件
                helper.item(file, '空文件');
            }).on('overCountLimit',function(limit) { // 超过数量限制
                alert('超过数量限制：' + limit + '，不能再增加文件');
            }).on('notAllowType',function(file) { // 不允许文件类型
                helper.item(file, '文件类型不允许');
            }).on('successAdd',function(file, files) { // 成功加入队列
                helper.item(file);
                Upload.preview(file, function(file, result) {
                    $('#upfile_' + file.index).prepend('<img src="' + result + '" width="100"/>');
                });
                u.upload();
            }).on('errorAdd',function(file, files) { // 加入队列失败
                console.log('failureAdd');
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
            }).on('finish', function(file) { // 上传所有文件完成
                console.log('finish');
            }).on('reset', function() {
                $('#result').html('');
            }).on('abort', function(file, index) {
                console.log('abort:', file, index);
            }).on('remove', function(file, index) {
                $('#upfile_' + index).remove();
            }).on('drop', function(files) {
                this.add(files);
            });

        $('#reset').click(function () {
            u.reset();
        });
        $('#disable').click(function () {
            u.disable();
        });
        $('#enable').click(function () {
            u.enable();
        });
        $('#submit').click(function() {
            var arr = helper.result();
            alert('提交图片id：' + arr);
            u.reset();
            $('#result').html('');
        });

        Action.listen({
            del: function(e, node, type) {
                u.remove(node.closest('.item').data('index'));
            }
        });

    });
});
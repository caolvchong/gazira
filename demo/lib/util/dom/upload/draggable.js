/**
 * User: caolvchong@gmail.com
 * Date: 9/17/13
 * Time: 11:27 AM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var helper = require('./helper');
    var Action = require('../../../../../js/lib/util/dom/action');
    var Ajax = require('../../../../../js/lib/util/ajax');
    var Upload = require('../../../../../js/lib/util/dom/upload/upload-html5');

    $(function() {
        var event = function(u, which) {
            var box = '#result' + which;
            u.on('overSizeLimit',function(size, file) { // 超过大小限制
                helper.item(file, '超过' + size + '大小限制', box, which);
            }).on('zeroSize',function(file) { // 空文件
                    helper.item(file, '空文件', box, which);
                }).on('overCountLimit',function(limit) { // 超过数量限制
                    alert('超过数量限制：' + limit + '，不能再增加文件');
                }).on('notAllowType',function(file) { // 不允许文件类型
                    helper.item(file, '文件类型不允许', box, which);
                }).on('successAdd',function(file, files) { // 成功加入队列
                    helper.item(file, false, box, which);
                    Upload.preview(file, function(file, result) {
                        $('#upfile_' + (which + '_') + file.index).prepend('<img src="' + result + '" width="100"/>');
                    });
                    if(which === 1) { // 容器1 直接上传
                        u.upload();
                    } else { // 容器2 获取上传地址后再处理上传
                        console.log(u.get('url'));
                        if(!u.get('url')) {
                            console.log('获取上传URL');
                            Ajax.single('getUploadUrl').send({
                                url: 'getUrl.php',
                                success: function(data) {
                                    u.set('url', data.data);
                                    u.upload();
                                    setTimeout(function() { // 简单模拟，10秒后上传地址过期
                                        console.log('URL过期');
                                        u.set('url' , '');
                                    }, 10000);
                                }
                            });
                        } else {
                            u.upload();
                        }
                    }
                }).on('errorAdd',function(file, files) { // 加入队列失败
                    console.log('failureAdd');
                }).on('progress',function(file, loaded, total) { // 上传进度
                    helper.progress(file, loaded, total, which);
                }).on('success',function(file, data) { // 上传成功
                    console.log(data);
                    helper.tip(file, 'success', which);
                    data = data.data;
                    $('#upfile_' + (which + '_') + file.index).attr('data-id', data.id);
                }).on('error',function(file, data) { // 文件上传失败时或者被终止时触发，引起的可能性有：上传地址不存在/主动终止
                    console.log(data);
                    helper.tip(file, 'failure', which);
                }).on('complete',function(file) { // 上传文件完成，无论失败成功
                    console.log('complete');
                }).on('finish',function(file) { // 上传所有文件完成
                    helper.progress(file, 1, 1, which);
                    console.log('finish');
                }).on('reset',function() {
                    $(box).html('');
                }).on('abort',function(file, index) {
                    console.log('abort:', file, index);
                }).on('remove',function(file, index) {
                    $('#upfile_' + (which + '_') + index).remove();
                }).on('drop', function(files) {
                    this.add(files);
                });
        };
        var u1 = new Upload({
            url: './upload.php',
            node: '#select_file1',
            type: '*.jpg; *.gif; *.png',
            maxSize: '3MB', // 文件大小限制
            maxCount: 5, // 文件数量限制，-1不限制
            multi: true, // 是否允许多文件上传
            max: 2,
            fileName: 'Filedata',
            data: {}
        });
        event(u1, 1);

        var u2 = new Upload({
            url: '', // 初始化不给上传地址
            node: '#select_file2',
            container: '#box2',
            type: '*.jpg; *.gif; *.png',
            maxSize: '3MB', // 文件大小限制
            maxCount: 5, // 文件数量限制，-1不限制
            multi: true, // 是否允许多文件上传
            max: 2,
            fileName: 'Filedata',
            data: {}
        });
        event(u2, 2);

        $('#reset1').click(function() {
            u1.reset();
        });
        $('#reset2').click(function() {
            u2.reset();
        });
        $('#submit2').click(function() {
            u2.upload();
        });

        Action.listen({
            del: function(e, node, type) {
                var item = node.closest('.item');
                var box = item.closest('.box');
                var id = +box.data('id');
                if(id === 1) {
                    u1.remove(item.data('index'));
                } else {
                    u2.remove(item.data('index'));
                }
            }
        });

    });
});
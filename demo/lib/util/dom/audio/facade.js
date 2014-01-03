define(function (require, exports, module) {
    var $ = require('$');
    var Audio = require('../../../../../js/lib/util/dom/audio/audio');

    $(function () {
        var log = function(text, type) {
            $('#log_area')[type || 'append']('<p>' + text + '</p>');
        };

        var setting = function (obj, config) {
            obj.preload = config.preload;
            obj.autoplay = config.autoplay;
            obj.loop = config.loop;
            return obj;
        };

        var getConfig = function () {
            return {
                preload: $('#song_preload')[0].checked,
                autoplay: $('#song_autoplay')[0].checked,
                loop: $('#song_loop')[0].checked
            };
        };

        var a1 = new Audio($.extend({
            swf: 'http://local.me/gazira/public/swf/audiojs.swf'
        }, (function(obj) {
            if(obj.preload || obj.autoplay) {
                obj.src = $('#song_src').val();
            }
            return obj;
        })(getConfig())));

        // 事件
        a1.on('loadStart',function () { // 开始加载事件
            log('开始加载：' + this.get('src'), 'html');
        }).on('progress',function (loaded, total) { // 加载进度事件
                $('#song_loaded').text((loaded / total * 100).toFixed(2) + '%');
            }).on('loaded',function () { // 加载完成事件
                log('加载完成！')
            }).on('play',function () { // 播放事件
                log('开始播放');
            }).on('timeupdate',function (played, total) { // 播放进度事件
                $('#song_played').text((played / total * 100).toFixed(2) + '%');
            }).on('pause',function () { // 暂停事件
                log('暂停');
            }).on('ended',function () { // 结束事件
                log('结束<br/>-----------------------------------------');
            }).on('skip', function (percent) { // 跳转事件
                log('跳到：' + percent);
            }).on('error', function () { // 异常事件
                log('载入异常');
            });

        $('#song_load').click(function () {
            setting(a1, getConfig);
            a1.load($('#song_src').val());
        });

        $('#song_play').click(function () {
            a1.play();
        });
        $('#song_pause').click(function () {
            a1.pause();
        });
        $('#song_stop').click(function () {
            a1.end();
        });
        $('#song_skip').click(function () {
            a1.skipTo(parseFloat($('#percent').val()) || 0);
        });
    });
});
define(function (require, exports, module) {
    var $ = require('$');
    var Browser = require('../../bom/browser')
    var Base = require('../../base');
    var tpl = require('./tpl/swf');

    var _id = 0;
    var flashInstanceName = 'myAudioJs';

    var resetStatus = function() {
        this.status = 0;
        this.prevPercent = 0;
        this.percentCount = 0;
    };

    /**
     * mp3音乐播放工具，流程包括：
     *     载入mp3（load），触发事件：loadStart, progress, loaded，异常触发：error
     *     播放，触发事件：play, timeupdate
     *     暂停，触发事件：pause
     *     结束，触发事件：ended
     *     跳转，触发事件：skip
     *
     * 当不支持audio播放mp3时，使用flash来播放，该flash内部暴露以下方法：
     *     init: 调用load
     *     load: 载入资源
     *     playPause: 播放/暂停
     *     pplay: 播放
     *     ppause: 暂停
     *     skipTo: 跳转
     *     setVolume: 设置音量
     *     updatePlayhead: 播放进度
     *     loadProgress: 载入进度
     *     loadError: 载入异常
     *     trackEnded: 结束
     * @param params
     */
    var Audio = Base.extend({
        attrs: {
            swf: '', // flash地址
            src: '', // 播放地址
            preload: true, // 预加载
            autoplay: true, // 自动播放
            loop: false // 自动循环
        },
        initialize: function (config) {
            Audio.superclass.initialize.call(this, config);
            var id = 'audio_' + (++_id);
            $(document.body).append(tpl.render({
                makeId: !Browser.firefox,
                flash: this.get('swf'),
                id: id,
                random: +new Date() + Math.random(),
                flashName: flashInstanceName
            }));

            if (!window[flashInstanceName]) {
                window[flashInstanceName] = {};
            }
            window[flashInstanceName][id] = this;
            var swf = document[id] || window[id];
            this.element = swf.length > 1 ? swf[swf.length - 1] : swf;
            resetStatus.call(this);
        },
        /**
         * 载入资源
         * @param src 载入mp3
         */
        load: function (src) {
            this.set('src', src);
            if (this._flashLoaded) {
                resetStatus.call(this);
                this.status = 0;
                this.prevPercent = 0; // 上一次播放进度，flash会出现接近100%但是无法到达100%的情况
                this.percentCount = 0; // 相同播放进度累积次数

                this.element.load(this.get('src')); // 调用flash载入mp3
                this.trigger('loadStart'); // 触发开始载入事件
                if (this.get('autoplay')) {
                    this.play();
                }
            }
        },
        /**
         * @private
         * 此方法提供给flash内部调用（flash载入后会自动调用）
         * 载入开始后的初始化
         */
        loadStarted: function () {
            this._flashLoaded = true;
            if (this.get('src')) {
                if (this.get('preload')) {
                    this.load(this.get('src'));
                }
                if (this.get('autoplay')) {
                    this.play();
                }
            }
        },
        /**
         * @private
         * 此方法提供给flash内部调用（会自动调用）
         * 载入进度
         * @param percent flash提供，已经载入的百分比
         * @param duration flash提供，播放总长度
         */
        loadProgress: function (percent, duration) {
            this.loadedPercent = percent;
            this.duration = duration;
            if (duration !== 0) {
                this.trigger('progress', duration * percent, duration); // 触发载入进度事件
            }
            if (percent >= 1) {
                this.trigger('loaded'); // 触发载入完成事件
            }
        },
        /**
         * @private
         * 此方法提供给flash内部调用（会自动调用）
         * 更新播放进度，相当于timeupdate
         * @param percent
         */
        updatePlayhead: function (percent) {
            this.trigger('timeupdate', percent * this.duration, this.duration);
            if (this.prevPercent !== percent) {
                this.prevPercent = percent;
            } else {
                this.percentCount++;
                if (this.percentCount > 3) {
                    percent = 1;
                    this.trigger('timeupdate', percent * this.duration, this.duration);
                    this.end(true);
                }
            }
        },
        skipTo: function (percent) {
            percent /= 100;
            if (percent <= this.loadedPercent) {
                this.element.skipTo(percent); // 调用flash跳转到某个进度
                this.trigger('skip', percent);
            }
        },
        setVolume: function (num) {
            this.element.setVolume(num);
        },
        /**
         * 停止
         * @param flag 设置为true是内部调用时候判断是否进行循环播放
         */
        end: function (flag) { // 设置结束
            this.element.skipTo(0);
            this.element.ppause();
            resetStatus.call(this);
            this.trigger('ended');
            if(this.get('loop') && flag === true) {
                this.play();
            }
        },
        loadError: function () { // 载入异常
            this.trigger('error');
        },
        play: function () {
            if (this.get('src')) {
                if (!this.get('preload')) {
                    this.set('preload', true);
                    this.element.init(this.get('src'));
                }
                if (this.status !== 1) {
                    this.element.pplay();
                    this.status = 1;
                    this.trigger('play');
                }
            }
        },
        pause: function () {
            if (this.status === 1) {
                this.status = 2;
                this.element.ppause();
                this.trigger('pause'); // 触发暂停事件
            }
        },
        toggle: function () {
            this.status === 1 ? this.pause() : this.play();
        }
    });

    module.exports = Audio;
});
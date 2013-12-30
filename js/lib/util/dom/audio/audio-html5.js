define(function (require, exports, module) {
    var $ = require('$');
    var Base = require('../../base');

    var resetStatus = function () {
        this.status = 0;
        this.prevPercent = 0;
        this.percentCount = 0;
    };

    var createPlayer = function (src) {
        var html = '<audio src="' + (src || '') + '"></audio>';
        var fragment = document.createDocumentFragment();
        var doc = fragment.createElement ? fragment : document;
        doc.createElement('audio');
        var div = doc.createElement('div');
        fragment.appendChild(div);
        div.innerHTML = html;
        return div.firstChild;
    };


    var Audio = Base.extend({
        attrs: {
            src: '', // 播放地址
            preload: true, // 预加载
            autoplay: true, // 自动播放
            loop: false // 自动循环
        },
        initialize: function (config) {
            var _this = this;
            Audio.superclass.initialize.call(this, config);
            this.element = createPlayer(this.get('src'));
            this.init = true;
            this.loaded = false;
            $(this.element).bind('timeupdate',function (e) { // 播放进度
                _this.trigger('timeupdate', _this.element.currentTime, _this.element.duration);
            }).bind('ended',function (e) { // 结束
                    resetStatus.call(_this);
                    _this.trigger('ended');
                }).bind('error',function (e) { // 错误
                    if (_this.get('src')) {
                        _this.trigger('error');
                    }
                }).bind('progress', function (e) {
                    if (_this.init && _this.get('autoplay')) {
                        _this.init = false;
                        _this.play();
                    }
                    setTimeout(function () {
                        var durationLoaded = _this.element.buffered.end(_this.element.buffered.length - 1); // 载入时长
                        _this.loadedPercent = durationLoaded / _this.element.duration;
                        _this.trigger('progress', durationLoaded, _this.element.duration); // 触发载入进度事件
                        if(_this.loaded === false && _this.loadedPercent >= 1) {
                            _this.loaded = true;
                            _this.trigger('loaded');
                        }
                    }, 20);
                });
            if (this.get('autoplay')) {
                this.set('preload', true);
            }
            resetStatus.call(this);
        },
        /**
         * 载入资源，处理自动预加载和自动播放问题
         */
        load: function (src) {
            this.set('src', src);
            resetStatus.call(this);
            this.init = true;
            this.loaded = false;
            this.element.setAttribute('src', this.get('src'));
            this.element.load();
            this.trigger('loadStart');
        },
        skipTo: function (percent) {
            percent = percent /= 100;
            try {
                this.element.currentTime = this.element.duration * percent; // 设置播放位置
                this.trigger('skip', percent);
            } catch (e) {
            }
        },
        end: function () {
            this.element.pause();
            try {
                this.element.currentTime = 0;
            } catch (e) {
            }
            resetStatus.call(this);
            this.trigger('ended');
        },
        setVolume: function (num) {
            this.element.volume = num / 100;
        },
        play: function () {
            if (this.get('src')) {
                if (!this.get('preload')) {
                    this.set('preload', true);
                }
                if (this.status !== 1) {
                    this.element.play();
                    this.status = 1;
                    this.trigger('play');
                }
            }
        },
        pause: function () {
            if (this.status === 1) {
                this.status = 2;
                this.element.pause();
                this.trigger('pause');
            }
        },
        toggle: function () {
            this.status === 1 ? this.pause() : this.play();
        }
    });

    module.exports = Audio;
});
define(function(require, exports, module) {
    var helper = {
        /**
         * 是否需要使用flash
         */
        useFlash: (function() {
            var a = document.createElement('audio');
            return !(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, '')) || navigator.userAgent.indexOf('Chromium') !== -1;
        })(),
        /**
         * 格式化好load方法的参数，需要绑定this
         * @param params
         * @return {Object}
         */
        loadParams: function(params) {
            var p = {};
            if(typeof params === 'string') {
                p.src = params;
                p.preload = true;
                p.autoplay = true;
                p.loop = false;
            } else {
                params = params || {};
                p.src = params.src;
                p.preload = params.preload !== false;
                p.autoplay = params.autoplay !== false;
                p.loop = params.loop !== true;
            }
            this.src = p.src;
            this.preload = p.preload;
            this.autoplay = p.autoplay;
            this.loop = p.loop;
            this.status = 0;
            return p;
        },
        /**
         * 进度
         */
        progress: function() {
            if(!this.preload) {
                return;
            }
            if(!this.timer) {
                this.timer = {
                    start: null, // 准备载入数据的监听器
                    progress: null // 载入过程的监听器
                };
            } else {
                clearInterval(this.timer.start);
                clearInterval(this.timer.progress);
            }
            var _this = this;
            _this.timer.start = setInterval(function() {
                if(_this.element.readyState > 1) { // 已经开始接收数据
                    if(_this.autoplay) { // 自动播放则开始播放
                        _this.play();
                    }
                    clearInterval(_this.timer.start);

                    var prePercent = 0;
                    var count = 0;
                    var percent;
                    _this.timer.progress = setInterval(function() { // 进度条加载
                        var durationLoaded = _this.element.buffered.end(_this.element.buffered.length - 1); // 载入时长
                        percent = durationLoaded / _this.element.duration;
                        if(percent !== prePercent) {
                            prePercent = percent;
                        } else {
                            count++;
                            if(count === 5) { // 缓存检测
                                durationLoaded = _this.element.duration;
                                _this._event.trigger('loaded', [_this]); // 触发载入完成事件
                                clearInterval(_this.timer.progress);
                            }
                        }
                        _this._event.trigger('progress', [durationLoaded, _this.element.duration, _this]); // 触发载入进度事件
                        if(percent >= 1) { // 大于1表示加载完毕
                            _this._event.trigger('loaded', [_this]); // 触发载入完成事件
                            clearInterval(_this.timer.progress);
                        }
                    }, 32);
                }
            }, 10);
        }
    };

    module.exports = helper;
});
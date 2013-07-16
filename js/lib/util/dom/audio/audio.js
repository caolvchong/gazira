define(function(require, exports, module) {
    var $ = require('$');
    var helper = require('./helper');

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
    var audio = function(params) {
        var _this = this;
        this.status = 0; // 0: 非播放/暂停状态；1: 播放中； 2: 暂停
        this._event = $({});
        helper.loadParams.call(this, params);
        if(helper.useFlash) {
            this.element = helper.create.flash.call(this);
            this.prevPercent = 0; // 上一次播放进度，flash会出现接近100%但是无法到达100%的情况
            this.percentCount = 0; // 相同播放进度累积次数
        } else {
            this.element = helper.create.html5(params);
            $(this.element).bind('timeupdate',function(e) { // 播放进度
                _this._event.trigger('timeupdate', [_this.element.currentTime, _this.element.duration, _this]);
            }).bind('ended',function(e) { // 结束
                    _this._event.trigger('ended', [_this]);
                }).bind('error', function(e) { // 错误
                    if(_this.timer) {
                        clearInterval(_this.timer.start);
                        clearInterval(_this.timer.progress);
                    }
                    _this._event.trigger('error', [_this]);
                });
        }
    };

    if(helper.useFlash) {
        audio.prototype = {
            constructor: audio,
            /**
             * 载入资源
             * @param params
             */
            load: function(params) {
                helper.loadParams.call(this, params);
                if(this._flashLoaded) {
                    this.element.load(this.src); // 调用flash载入mp3
                    this._event.trigger('loadStart', [this]); // 触发开始载入事件
                }
            },
            /**
             * 此方法提供给flash内部调用
             * 载入开始后的初始化
             * @return {*}
             */
            loadStarted: function() {
                this._flashLoaded = true;
                if(this.preload) {
                    this.element.init(this.src);
                }
                if(this.autoplay) {
                    this.play();
                }
            },
            /**
             * 此方法提供给flash内部调用
             * 载入进度
             * @param percent flash提供，已经载入的百分比
             * @param duration flash提供，播放总长度
             */
            loadProgress: function(percent, duration) {
                this.loadedPercent = percent;
                this.duration = duration;
                if(duration != 0) {
                    this._event.trigger('progress', [duration * percent, duration, this]); // 触发载入进度事件
                }
                if(percent >= 1) {
                    this._event.trigger('loaded', [this]); // 触发载入完成事件
                }
            },
            /**
             * 此方法提供给flash内部调用
             * 更新播放进度，相当于timeupdate
             * @param percent
             */
            updatePlayhead: function(percent) {
                this._event.trigger('timeupdate', [percent * this.duration, this.duration, this]);
                if(this.prevPercent != percent) {
                    this.prevPercent = percent;
                } else {
                    this.percentCount++;
                    if(this.percentCount > 3) {
                        percent = 1;
                        this._event.trigger('timeupdate', [percent * this.duration, this.duration, this]);
                        this._event.trigger('ended', [this]);
                    }
                }
            },
            skipTo: function(percent) {
                percent /= 100;
                if(percent <= this.loadedPercent) {
                    this.element.skipTo(percent); // 调用flash跳转到某个进度
                    this._event.trigger('skip', [percent, this]);
                }
            },
            setVolume: function(num) {
                this.element.setVolume(num);
            },
            end: function(e) { // 设置结束
                this.skipTo(0);
                this.pause();// 跳到初始位置并暂停
                this._event.trigger('ended', [this]);
            },
            loadError: function() { // 载入异常
                this._event.trigger('error', [this]);
            }
        };
    } else {
        audio.prototype = {
            constructor: audio,
            /**
             * 载入资源，处理自动预加载和自动播放问题
             * @param params
             *     src: 资源
             *     preload: 预加载
             *     autoplay: 自动播放
             */
            load: function(params) {
                helper.loadParams.call(this, params);
                this.preload ? this.element.setAttribute('preload', 'true') : this.element.removeAttribute('preload');
                this.autoplay ? this.element.setAttribute('autoplay', 'true') : this.element.removeAttribute('autoplay');
                this.element.setAttribute('src', this.src);
                this.element.load();
                helper.progress.call(this); // 调用载入进度
                this._event.trigger('loadStart', [this]); // 触发开始载入事件
            },
            skipTo: function(percent) {
                try {
                    this.element.currentTime = this.element.duration * percent / 100; // 设置播放位置
                    this._event.trigger('skip', [percent, this]);
                } catch(e) {}
            },
            end: function() {
                this.pause();
                this.skipTo(0);
                this.status = 0;
                this._event.trigger('ended', [this]);
            },
            setVolume: function(num) {
                this.element.volume = num / 100;
            }
        };
    }
    /**
     * 播放
     */
    audio.prototype.play = function() {
        if(!this.preload) {
            this.preload = true;
            if(helper.useFlash) {
                this.element.init(this.src);
            }
        }
        helper.useFlash ? (this.status != 1 && this.element.pplay()) : this.element.play();
        this.status = 1;
        this._event.trigger('play', [this]); // 触发播放事件，和timeupdate区别是播放中一直触发timeupdate，play仅调用播放时触发一次
    };
    /**
     * 暂停
     */
    audio.prototype.pause = function() {
        if(this.status == 1) {
            this.status = 2;
            helper.useFlash ? this.element.ppause() : this.element.pause();
            this._event.trigger('pause', [this]); // 触发暂停事件
        }
    };
    /**
     * 切换播放/暂停
     */
    audio.prototype.toggle = function() {
        this.status == 1 ? this.pause() : this.play();
    };
    audio.prototype.bind = function() {
        var len = arguments.length;
        if(len == 1) {
            this._event.bind(arguments[0]);
        } else if(len == 2) {
            this._event.bind(arguments[0], arguments[1]);
        }
    };
    audio.prototype.unbind = function() {
        var len = arguments.length;
        if(len == 1) {
            this._event.unbind(arguments[0]);
        } else if(len == 2) {
            this._event.unbind(arguments[0], arguments[1]);
        }
    };
    return audio;
});
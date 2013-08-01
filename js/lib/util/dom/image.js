define(function(require, exports, module) {
    var $ = require('$');
    var undef;

    var helper = {
        getCssPrefix: (function() {
            var prefix = false; // 前缀类型,false表示不支持
            return function() {
                var node = document.createElement('div');
                if(node.style.MozTransform !== undef) {
                    prefix = 'Moz';
                } else if(node.style.webkitTransform !== undef) {
                    prefix = 'webkit';
                } else if(node.style.OTransform !== undef) {
                    prefix = 'O';
                } else {
                    prefix = '';
                }
                return prefix;
            }
        })()
    };

    var r = {
        /**
         * params
         *     url: 图片url，必须
         *     ready: 获取到图片宽高后的处理函数，必须
         *     load: 图片完全载入后的处理函数，可选，load肯定是在ready之后
         *     error: 获取图片失败后的处理函数，可选
         */
        load: (function() {
            var list = []; // 存放监听图片获取到大小的函数的队列
            var intervalId = null; // 用来执行队列
            /**
             * 提供给setInterval来执行list中的函数
             */
            var tick = function() {
                for(var i = 0; i < list.length; i++) {
                    list[i].end ? list.splice(i--, 1) : list[i]();
                }
                !list.length && stop();
            };
            /**
             * 停止所有定时器队列
             */
            var stop = function() {
                clearInterval(intervalId);
                intervalId = null;
            };

            return function(params) {
                var onready; // 获取图片大小的函数
                var width; // 图片宽
                var height; // 图片高
                var newWidth; // 用来比较的图片宽
                var newHeight; // 用来比较的图片高
                var img = new Image(); // 图片对象

                img.src = params.url;

                // 如果图片被缓存，则直接返回缓存数据
                if(img.complete) {
                    params.ready.call(img);
                    params.load && params.load.call(img);
                } else {
                    width = img.width; // 初始化宽度
                    height = img.height; // 初始化高度

                    // 加载错误后的事件
                    img.onerror = function() {
                        params.error && params.error.call(img);
                        onready.end = true;
                        img = img.onload = img.onerror = null;
                    };

                    // 图片尺寸就绪
                    onready = function() {
                        newWidth = img.width;
                        newHeight = img.height;
                        if(newWidth !== width || newHeight !== height || newWidth * newHeight > 1024) {// 如果图片已经在其他地方加载可使用面积检测
                            params.ready.call(img);
                            onready.end = true;
                        }
                    };
                    onready();

                    // 完全加载完毕的事件
                    img.onload = function() {
                        !onready.end && onready(); // onload在定时器时间差范围内可能比onready快，这里进行检查并保证onready优先执行
                        params.load && params.load.call(img);
                        img = img.onload = img.onerror = null;// IE gif动画会循环执行onload，置空onload即可
                    };

                    // 加入队列中定期执行
                    if(!onready.end) {
                        list.push(onready);
                        if(intervalId === null) { // 无论何时只允许出现一个定时器，减少浏览器性能损耗
                            intervalId = setInterval(tick, 40);
                        }
                    }
                }
            };
        })(),
        /**
         * 缩放图片，但没有进行缩放，需要在使用时候的回调中调用
         * @param params
         *     node: 图片对象
         *     max: 图片最大尺寸（宽或高），可选
         *     maxWidth: 图片最大宽度，优先级大于max，缺省是max，可选
         *     maxHeight: 图片最大高度，优先级大于max，缺省是max，可选
         *     width: 传入的图片宽度
         *     height: 传入的图片高度
         *     overflow: 是否允许图片超出max范围，true允许，即按短边缩放，其他标识按长边缩放（默认值），可选
         *     callback: 回调
         * @return {Object}
         *     width: 缩放后的宽
         *     height: 缩放后的高
         */
        zoom: function(params) {
            var image = params.node[0] || params.node;
            var width = params.width || image.width;
            var height = params.height || image.height;
            var maxWidth = params.maxWidth || params.max;
            var maxHeight = params.maxHeight || params.max;
            var overflow = params.overflow === true;
            if(width > maxWidth || height > maxHeight) {
                if(overflow) { // 根据短边缩放
                    if(width > height) {
                        width /= height / maxHeight;
                        height = maxHeight;
                    } else {
                        height /= width / maxWidth;
                        width = maxWidth;
                    }
                } else { // 根据长边缩放，这是常用情况
                    if(width > height) {
                        height /= width / maxWidth;
                        width = maxWidth;
                    } else {
                        width /= height / maxHeight;
                        height = maxHeight;
                    }
                }
            }

            params.callback && params.callback.call(image, width, height);

            return {
                width: width,
                height: height
            };
        },

        /**
         * 让图片居中，但没有进行居中，需要在使用时候的回调中调用
         * @param params
         *     node: 图片节点
         *     height: 容器高度
         *     width: 容器宽度
         *     callback: 回调
         * @return {Object}
         */
        center: function(params) {
            var image = params.node[0] || params.node;
            var top = (params.height - image.height) / 2;
            var left = (params.width - image.width) / 2;

            params.callback && params.callback.call(image, top, left);

            return {
                top: top,
                left: left
            };
        },
        /**
         * 前端中心旋转，注意：中心旋转前请使用zoom和center确保原先居中，且旋转后不越界
         * @param params
         *     node: image
         *     dir: true 逆时针； false 顺时针
         *     animate: 是否过度效果，默认有
         *     center: 是否居中，默认居中
         */
        rotate: function(params) {
            var image = params.node[0] || params.node;
            var dir = params.dir;
            var prefix = helper.getCssPrefix();
            if(image.degree === undef) {
                image.degree = 0;
                if(prefix !== false && params.animate !== false) {
                    if(prefix) {
                        image.style[prefix + 'Transition'] = '-' + prefix.toLowerCase() + '-transform .2s ease-in';
                    } else {
                        image.style.transition = 'transform .2s ease-in';
                    }
                }
            }
            if(dir === true) { // 逆时针
                image.degree -= 90;
            } else { // 顺时针
                image.degree += 90;
            }
            if(prefix) {
                var str = 'rotate(' + image.degree + 'deg)';
                if(prefix) {
                    image.style[prefix + 'Transform'] = str;
                } else {
                    image.style.transform = str;
                }
                params.callback && params.callback.call(image);
            } else {
                var obj = $(image);
                var deg2radians = Math.PI / 180;
                var rad = image.degree * deg2radians;
                var sin = Math.sin(rad);
                var cos = Math.cos(rad);
                var pos = obj.position();
                obj.css({
                    filter:'progid:DXImageTransform.Microsoft.Matrix(M11="' + cos +  '", M12="' + -sin + '", M21=' + sin + ', M22="' + cos + '", sizingMethod="auto expand")',
                    left: pos.left + (obj.width() - obj.height()) / 2,
                    top: pos.top - (obj.width() - obj.height()) / 2
                });
                params.callback && params.callback.call(image);
            }
        }
    };
    module.exports = r;
});
/**
 * User: caolvchong@gmail.com
 * Date: 9/29/13
 * Time: 7:22 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Widget = require('../../widget');

    var url = 'http://api.map.baidu.com/getscript?v=1.5&ak=';
    var undef;
    var Map = Widget.extend({
        attrs: {
            key: '562941f982ffa9d7885b58507fa474cd',
            lat: 119.305894, // 初始化经度
            lng: 26.092583, // 初始化纬度
            level: 16, // 初始化地图级别
            marker: false,
            wheel: true, // 滚轮放大缩小
            keyboard: true, // 键盘支持上下左右移动
            removeCopyright: false // 移除logo和版权
        },
        setup: function() {
            var that = this;
            Map.superclass.setup.call(this);
            this.map = null;
            this.cache = []; // 响应队列，如果地图没有载完，所有操作会缓存在此
            this.after('render', function() {
                require.async(url + this.get('key'), function() {
                    var cache = that.cache;
                    var fn;
                    that.cache.length = 0;
                    that.element.attr('id', 'bdmap_' + that.cid).css({
                        width: '100%',
                        height: '100%'
                    });

                    var map = that.map = new BMap.Map(that.element.attr('id'));
                    var point = new BMap.Point(that.get('lat'), that.get('lng')); // 创建点坐标
                    map.centerAndZoom(point, that.get('level')); // 初始化地图，设置中心点坐标和地图级别

                    var marker = that.get('marker');
                    if(marker === true) {
                        that.set('marker', {
                            lat: that.get('lat'),
                            lng: that.get('lng')
                        });
                        marker = that.get('marker');
                    }
                    if(marker.lat !== undef && marker.lng !== undef) {
                        map.addOverlay(new BMap.Marker(new BMap.Point(marker.lat, marker.lng)));
                    }
                    if(that.get('wheel')) {
                        map.enableScrollWheelZoom(); // 启用滚轮放大缩小
                    }
                    if(that.get('keyboard')) {
                        map.enableKeyboard(); // 键盘支持上下左右移动
                    }
                    if(that.get('removeCopyright') === true) { // 移除版权
                        map.addEventListener('addcontrol', function(ctrl) {
                            var target = ctrl.target;
                            if((target.Gj && target.Gj.indexOf('copyright_logo') > -1) || (target.Zu === 'CopyrightControl')) {
                                map.removeControl(target);
                            }
                        });
                    }
                    while(fn = cache.shift()) {
                        fn.call(that, that.map, BMap);
                    }
                });
            });
        },
        action: function(fn) {
            if(this.map) {
                fn.call(this, this.map, BMap);
            } else {
                this.cache.push(fn);
            }
        }
    });

    module.exports = Map;
});
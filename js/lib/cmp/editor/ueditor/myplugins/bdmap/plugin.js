define(function(require, exports, module) {
    var $ = require('$');
    var DialogBase = require('../dialog-base');

    var plugin = new DialogBase({
        name: 'bdmap',
        title: '百度地图',
        content: '<div style="width:500px;height: 400px;" id="container"></div>'
    });
    plugin.on('init', function(dialog, editor) {
        require.async('http://api.map.baidu.com/getscript?v=1.5&ak=562941f982ffa9d7885b58507fa474cd&services=', function() {
            var map = new BMap.Map('container');          // 创建地图实例
            var point = new BMap.Point(116.404, 39.915);  // 创建点坐标
            map.centerAndZoom(point, 15);                 // 初始化地图，设置中心点坐标和地图级别
        });
    });

    module.exports = plugin.plugin;
});
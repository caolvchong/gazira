(function() {
    var version = '0.0.1'; // 线上部署版本
    var development = true; // 开关：true开发版本 false部署版本
    var _ts = new Date().getTime();
    var plugins = [];
    var map = [];
    if(location.href.indexOf('development') > 0 || location.search.indexOf('seajs-debug') > 0) {
        development = true;
    }
    if(development) { // 开发模式
        var dist = 'public/js/dist/';
        var src = 'js/'
        map.push(function(url) {
            if(url.indexOf(dist) > 0) {
                url = url.replace(dist, src);
            }
            return url;
        });
        map.push([/^.*$/, function(url) {
            url += (url.indexOf('?') === -1 ? '?' : '&') + '_ts=' + _ts;
            return url;
        }]);
    } else {
        map.push([/^.*$/, function(url) {
            url += (url.indexOf('?') === -1 ? '?' : '&') + '_v=' + version;
            return url;
        }]);
    }

    seajs.development = development;

    seajs.config({
        plugins: plugins,
        map: map,
        alias: {
            $: 'jquery/jquery.js',
            'seajs-debug': 'seajs/seajs-debug'
        }
    });
})();

(function() {
    var development = true;
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
        seajs.on('fetch', function(data) {
            if (data.uri) {
                data.requestUri = data.uri + '?t=' + new Date().getTime()
            }
        });
    }

    seajs.development = development;

    seajs.config({
        plugins: plugins,
        map: map,
        alias: {
            $: 'jquery/jquery.js',
            'seajs-debug': 'seajs/plugin-debug'
        }
    });
})();

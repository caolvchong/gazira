define(function(require, exports, module) {
    var loc = this.location;
    var search = loc.search;

    var map = [];
    var plugins = ['shim'];

    var local = 'localhost/mobi/';
    var remote = 'remote.com/';

    if (search.indexOf('online') > -1) {
        map.push(function(url) {// 本地发布形式
            return url.replace(remote, local);
        });
    } else {
        map.push(function(url) {// 本地源码形式
            return url.replace(remote + 'public/js/dist/', local + 'js/');
        });
    }
    plugins.push('nocache');

    seajs.config.data.map = [];
    seajs.config({
        plugins: plugins,
        map: map
    });
});
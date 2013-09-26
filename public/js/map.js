define(function(require, exports, module) {
    var loc = this.location;
    var search = loc.search;

    var local = 'meifa.com/';
    var remote = 'api.hair.121.207.242.210.xip.io/backend/';

    seajs.on('fetch', function(data) {
        if (data.uri) {
            if (search.indexOf('online') > -1 || seajs.development) {
                data.requestUri = data.uri.replace(remote, local);
            } else {
                data.requestUri = data.uri.replace(remote + 'public/js/dist/', local + 'js/');
            }
        }
    });
});
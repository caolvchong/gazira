define(function(require, exports, module) {
    var $ = require('$');
    var Map = require('../../../../js/lib/cmp/map/baidu/map');

    $(function() {
        var m = new Map({
            parentNode: '#map_1',
            marker: true
        }).render();

    });
});
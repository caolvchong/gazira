/**
 * User: caolvchong@gmail.com
 * Date: 7/3/13
 * Time: 8:46 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Carousel = require('../../../../js/lib/cmp/switchable/carousel');

    $(function() {
        new Carousel({
            element: '#carousel-demo-1',
            hasTriggers: false,
            easing: 'easeOutStrong',
            effect: 'scrollx',
            viewSize: [510],
            circular: false,
            autoplay: false
        }).render();
    });
});
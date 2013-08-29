/**
 * User: caolvchong@gmail.com
 * Date: 8/29/13
 * Time: 1:42 PM
 */
define(function(require, exports, module) {
    var browser = require('../bom/browser');

    module.exports = function(node, callback) {
        node = node[0] || node;
        if(browser.ie) {
            node.attachEvent('onmousewheel', function(e) {
                e = window.event;
                var prevent = function() {
                    node.scrollTop += e.wheelDelta > 0 ? -60 : 60;
                    e.returnValue = false;
                };
                callback && callback.call(node, e, e.wheelDelta > 0 ? 'up' : 'down', prevent, 'ie'); // e.wheelDelta > 0 向上滚动
            });
        } else if(browser.firefox) {
            node.addEventListener('DOMMouseScroll', function(e) {
                callback && callback.call(node, e, e.detail < 0 ? 'up' : e.detail > 0 ? 'down' : '', function() {
                    e.preventDefault();
                }, 'firefox');
            }, false);
        } else {
            node.addEventListener('mousewheel', function(e) {
                callback && callback.call(node, e, e.wheelDelta >= 0 ? 'up' : e.wheelDelta <= 0 ? 'down' : '', function() {
                    e.returnValue = false;
                }, 'standard');
            }, false);
        }
    };
});
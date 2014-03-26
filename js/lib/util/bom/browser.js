define(function(require, exports, module) {
    module.exports = (function() {
        var ie = !!window.ActiveXObject;
        var webkit = !!window.devicePixelRatio;
        return {
            ie: ie,
            ie6: ie && !window.XMLHttpRequest, // IE6没有Window.XMLHttpRequest，其后版本都有
            ie7: ie && navigator.appVersion.match(/7./i) === '7.',
            ie8: !!window.XDomainRequest,
            ie9: ie && +'\v1',
            firefox: !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
            opera: webkit && !!window.opera,
            safari: Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
            chrome: webkit && !!window.chrome
        };
    })();
});
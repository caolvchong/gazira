define(function(require, exports, module) {
    module.exports = (function() {
        var ie = !!window.ActiveXObject;
        var webkit = !!window.devicePixelRatio;
        var browser = {
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

        var is = (function() {
            if (browser.ie || browser.ie6 || browser.ie7 || browser.ie8 || browser.ie9) {
                return 'IE';
            }
            for (var b in browser) {
                if (browser.hasOwnProperty(b) && browser[b] && b != 'is') {
                    return b;
                }
            }
            return 'IE'; // IE version > 9
        })();

        browser.is = is;
        return browser;
    })();
});

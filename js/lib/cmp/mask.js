define(function(require, exports, module) {

    var $ = require('$');
    var Overlay = require('./overlay');

    var ua = (window.navigator.userAgent || '').toLowerCase();
    var isIE6 = ua.indexOf('msie 6') !== -1;

    var body = $(document.body);
    var doc = $(document);

    var zIndex = [];
    window.ddddd = zIndex;

    // Mask
    // ----------
    // 全屏遮罩层组件

    var Mask = Overlay.extend({

        attrs: {
            width: isIE6 ? doc.outerWidth(true) : '100%',
            height: isIE6 ? doc.outerHeight(true) : '100%',
            className: 'dialog-mask',
            opacity: 0.2,
            backgroundColor: '#000',
            style: {
                position: isIE6 ? 'absolute' : 'fixed',
                top: 0,
                left: 0
            },

            align: {
                // undefined 表示相对于当前可视范围定位
                baseElement: isIE6 ? body : undefined
            }
        },

        show: function() {
            if (isIE6) {
                this.set('width', doc.outerWidth(true));
                this.set('height', doc.outerHeight(true));
            }
            return Mask.superclass.show.call(this);
        },

        setup: function() {
            // 加载 iframe 遮罩层并与 overlay 保持同步
            this._setupShim();
            this.before('show', function() {
                zIndex.push(this.get('zIndex'));
            });
        },
        hide: function() {
            zIndex.pop();
            if(zIndex.length > 0) {
                this.set('zIndex', zIndex[zIndex.length - 1]);
                return this;
            } else {
                return Mask.superclass.hide.call(this);
            }
        },
        _onRenderBackgroundColor: function(val) {
            this.element.css('backgroundColor', val);
        },

        _onRenderOpacity: function(val) {
            this.element.css('opacity', val);
        }
    });

    // 单例
    module.exports = new Mask();

});

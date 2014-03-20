define(function(require, exports, module) {

    var $ = require('$');
    var BasicTip = require('./basic-tip');
    var tpl = require('./tpl/tip');

    // 气泡提示弹出组件
    // ---
    var Tip = BasicTip.extend({

        attrs: {
            template: tpl.render(),

            // 提示内容
            content: 'A TIP BOX',

            // 箭头位置
            // 按钟表点位置，目前支持1、2、5、7、10、11点位置
            // https://i.alipayobjects.com/e/201307/jBty06lQT.png
            arrowPosition: 7,

//            align: {
//                setter: function(val) {
//                    // 用户初始化时主动设置了 align
//                    // 且并非来自 arrowPosition 的设置
//                    if (val && !val.comeFromArrowPosition) {
//                        console.log('-d--')
//                        this._specifiedAlign = true;
//                    }
//                    return val;
//                }
//            },

            // 颜色 [yellow|blue|white]
            theme: 'yellow',

            // 当弹出层显示在屏幕外时，是否自动转换浮层位置
            inViewport: false
        },

        setup: function() {
            BasicTip.superclass.setup.call(this);
            this._originArrowPosition = this.get('arrowPosition');

            this.after('show', function() {
                this._makesureInViewport();
            });
        },

        _makesureInViewport: function() {
            if (!this.get('inViewport')) {
                return;
            }
            var ap = this._originArrowPosition,
                scrollTop = $(window).scrollTop(),
                viewportHeight = $(window).outerHeight(),
                elemHeight = this.element.height() + this.get('distance'),
                triggerTop = this.get('trigger').offset().top,
                triggerHeight = this.get('trigger').height(),
                arrowMap = {
                    '1': 5,
                    '5': 1,
                    '7': 11,
                    '11': 7
                };

            if ((ap == 11 || ap == 1) &&
                (triggerTop + triggerHeight > scrollTop + viewportHeight - elemHeight)) {
                // tip 溢出屏幕下方
                this.set('arrowPosition', arrowMap[ap]);
            } else if ((ap == 7 || ap == 5) &&
                     (triggerTop < scrollTop + elemHeight)) {
                // tip 溢出屏幕上方
                this.set('arrowPosition', arrowMap[ap]);
            } else {
                // 复原
                this.set('arrowPosition', this._originArrowPosition);
            }
        },

        // 用于 set 属性后的界面更新

        _onRenderArrowPosition: function(val, prev) {
            val = parseInt(val, 10);
            var arrow = this.$('.widget-poptip-arrow');
            arrow.removeClass('widget-poptip-arrow-' + prev)
                 .addClass('widget-poptip-arrow-' + val);

            // 用户设置了 align
            // 则直接使用 align 表示的位置信息，忽略 arrowPosition
            if (this._specifiedAlign) {
                return;
            }

            var direction = '', arrowShift = 0;
            if (val === 10) {
                direction = 'right';
                arrowShift = 20;
            }
            else if (val === 11) {
                direction = 'down';
                arrowShift = 22;
            }
            else if (val === 1) {
                direction = 'down';
                arrowShift = -22;
            }
            else if (val === 2) {
                direction = 'left';
                arrowShift = 20;
            }
            else if (val === 5) {
                direction = 'up';
                arrowShift = -22;
            }
            else if (val === 7) {
                direction = 'up';
                arrowShift = 22;
            }
            this.set('direction', direction);
            this.set('arrowShift', arrowShift);
            this._setAlign();
        },

        _onRenderWidth: function(val) {
            this.$('[data-role="content"]').css('width', val);
        },

        _onRenderHeight: function(val) {
            this.$('[data-role="content"]').css('height', val);
        },

        _onRenderTheme: function(val, prev) {
            this.element.removeClass('widget-poptip-' + prev);
            this.element.addClass('widget-poptip-' + val);
        }

    });

    module.exports = Tip;

});

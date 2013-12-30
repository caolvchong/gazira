define(function(require, exports, module) {

    var $ = require('$');
    var Tip = require('./tip');
    var tpl = require('./tpl/atip');

    // 气泡提示弹出组件
    // ---
    var Atip = Tip.extend({

        attrs: {

            template: tpl.render(),

            // 提示内容
            content: '这是一个提示框',

            // 箭头位置
            // 按钟表点位置，目前支持1、2、5、7、10、11点位置
            arrowPosition: 7,

            // 颜色 [yellow|blue|white]
            theme: 'yellow',

            // 当弹出层显示在屏幕外时，是否自动转换浮层位置
            inViewport: false,

            // 宽度
            width: 'auto',

            // 高度
            height: 'auto'

        },

        setup: function() {
            this._originArrowPosition = this.get('arrowPosition');
            Atip.superclass.setup.call(this);
        },

        show: function() {
            Atip.superclass.show.call(this);
            this._makesureInViewport();
        },

        _makesureInViewport: function() {
            if(this.get('inViewport')) {
                var ap = this._originArrowPosition;
                var scrollTop = $(window).scrollTop();
                var viewportHeight = $(window).outerHeight();
                var elemHeight = this.element.height() + this.get('distance');
                var triggerTop = $(this.get('trigger')).offset().top;
                var arrowMap = {
                    '1': '5',
                    '5': '1',
                    '7': '11',
                    '11': '7'
                };
                if((ap === 11 || ap === 1) && (triggerTop > scrollTop + viewportHeight - elemHeight)) {
                    this.set('arrowPosition', arrowMap[ap]);
                } else if((ap === 7 || ap === 5) && (triggerTop < scrollTop + elemHeight)) {
                    this.set('arrowPosition', arrowMap[ap]);
                } else {
                    this.set('arrowPosition', this._originArrowPosition);
                }
            }
        },

        // 用于 set 属性后的界面更新

        _onRenderArrowPosition: function(val, prev) {
            val = parseInt(val, 10);
            var arrow = this.$('.ui-poptip-arrow');
            arrow.removeClass('ui-poptip-arrow-' + prev).addClass('ui-poptip-arrow-' + val);

            var direction = '', arrowShift = 0;
            if(val === 10) {
                direction = 'right';
                arrowShift = 20;
            } else if(val === 11) {
                direction = 'down';
                arrowShift = 22;
            } else if(val === 1) {
                direction = 'down';
                arrowShift = -22;
            } else if(val === 2) {
                direction = 'left';
                arrowShift = 20;
            } else if(val === 5) {
                direction = 'up';
                arrowShift = -22;
            } else if(val === 7) {
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
            this.element.removeClass('ui-poptip-' + prev);
            this.element.addClass('ui-poptip-' + val);
        }

    });

    module.exports = Atip;

});



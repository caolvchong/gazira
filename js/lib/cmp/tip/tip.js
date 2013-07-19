define(function(require, exports, module) {

    var Popup = require('popup');

    // 通用提示组件
    // 兼容站内各类样式
    var Tip = Popup.extend({

        attrs: {
            // 提示内容
            content: null,

            // 提示框在目标的位置方向 [up|down|left|right]
            direction: 'up',

            // 提示框离目标距离(px)
            distance: 8,

            // 箭头偏移位置(px)，负数表示箭头位置从最右边或最下边开始算
            arrowShift: 22,

            // 箭头指向 trigger 的水平或垂直的位置
            pointPos: '50%'
        },

        _setAlign: function() {
            var alignObject = {},
                arrowShift = this.get('arrowShift'),
                distance = this.get('distance'),
                pointPos = this.get('pointPos'),
                direction = this.get('direction');

            if (arrowShift < 0) {
                arrowShift = '100%' + arrowShift;
            }

            if (direction === 'up') {
                alignObject.baseXY = [pointPos, 0];
                alignObject.selfXY = [arrowShift, '100%+' + distance];
            }
            else if (direction === 'down') {
                alignObject.baseXY = [pointPos, '100%+' + distance];
                alignObject.selfXY = [arrowShift, 0];
            }
            else if (direction === 'left') {
                alignObject.baseXY = [0, pointPos];
                alignObject.selfXY = ['100%+' + distance, arrowShift];
            }
            else if (direction === 'right') {
                alignObject.baseXY = ['100%+' + distance, pointPos];
                alignObject.selfXY = [0, arrowShift];
            }

            this.set('align', alignObject);
        },

        setup: function() {
            Tip.superclass.setup.call(this);
            this._setAlign();
        },

        // 用于 set 属性后的界面更新

        _onRenderContent: function(val) {
            var ctn = this.$('[data-role="content"]');
            if (typeof val !== 'string') {
                val = val.call(this);
            }
            ctn && ctn.html(val);
        }

    });

    module.exports = Tip;

});

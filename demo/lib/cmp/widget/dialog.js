/**
 * User: caolvchong@gmail.com
 * Date: 7/1/13
 * Time: 1:45 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Widget = require('../../../../js/lib/cmp/widget');
    var tpl = require('./dialog-tpl');

    var defaultConfig = {
        width: 450,
        height: 200
    };
    var undefined;
    var Dialog = Widget.extend({
        attrs: {
            title: '窗口',
            content: '内容',
            width: defaultConfig.width,
            height: defaultConfig.height,
            template: tpl.render()
        },
        events: {
            'click .widget-dialog-close': 'hide'
        },
        setup: function() {
            this.$('.widget-dialog-title').html(this.get('title'));
            this.$('.widget-dialog-body').html(this.get('content'));
            this.center();
        },
        position: function(top, left) {
            top = top === undefined ? this.element.css('top') : top;
            left = left === undefined ? this.element.css('left') : left;
            this.element.css({
                top: top,
                left: left
            });
            return this;
        },
        center: function() {
            var win = $(window);
            var top = (win.height() - this.element.height()) /2 + win.scrollTop();
            var left = (win.width() - this.element.width()) /2 + win.scrollLeft();
            this.position(top, left);
            return this;
        },
        show: function(config) {
            config = config || {};
            this.render();
            this.element.css({
                display: 'block',
                width: config.width || this.get('width'),
                height: config.height || this.get('height')
            });
            return this;
        },
        hide: function() {
            this.element.hide();
            return this;
        }
    });

    module.exports = Dialog;
});
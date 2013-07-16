/**
 * User: caolvchong@gmail.com
 * Date: 7/9/13
 * Time: 11:45 AM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Widget = require('../../../../js/lib/cmp/widget');

    var Tab = Widget.extend({
        attrs: {
            index: 0
        },
        events: {
            'click .nav li': function(e) {
                var index = this.$('.nav li').index(e.target);
                this.active(index);
            }
        },
        _onRenderIndex: function(index, prev) {
            var list = this.$('.nav li');
            list.eq(prev).removeClass('active');
            list.eq(index).addClass('active');

            var contentList = this.$('.content div');
            contentList.eq(prev).hide();
            contentList.eq(index).show();
        },
        setup: function() {
            this.active(this.get('index'));
        },
        active: function(index) {
            this.set('index', index);
            return this;
        }
    });

    module.exports = Tab;
});
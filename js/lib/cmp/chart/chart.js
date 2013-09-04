/**
 * User: caolvchong@gmail.com
 * Date: 8/29/13
 * Time: 5:36 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Widget = require('../widget');
    var highcharts = require('./highcharts');
    require('./highcharts-more');

    var Chart = Widget.extend({
        attrs: {
            style: {
                'min-width': '310px',
                'height': '400px',
                'margin': '0 auto'
            },
            copyright: false
        },
        events: {},
        setup: function() {
            Chart.superclass.setup.call(this);
            this.render();
        },
        render: function() {
            var attrs = this.attrs;
            var config = {};
            for(var key in attrs) {
                config[key] = this.get(key);
            }
            if(this.get('copyright') === false) {
                if(!config.credits) {
                    config.credits = {};
                }
                config.credits.enabled = false;
            }
            Chart.superclass.render.call(this);
            this.element.highcharts(config);
        }
    });
    Chart.highcharts = highcharts;

    module.exports = Chart;
});
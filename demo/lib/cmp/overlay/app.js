/**
 * User: caolvchong@gmail.com
 * Date: 7/3/13
 * Time: 8:46 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Overlay = require('../../../../js/lib/cmp/overlay');
    var Dialog = require('./dialog');

    $(function() {
        var o1 = new Overlay({
            template: '<div class="overlay"></div>',
            width: 75,
            height: 75,
            zIndex: 99,
            style: {
                border: '1px solid #fe0',
                background: '#528CE3'
            },
            parentNode: '#container1',
            align: {
                baseElement: '#box1'
            }
        });

        $('#btn11').click(function() {
            o1.set('align', {
                selfXY: ['center', 'bottom'],
                baseXY: ['center', 'top']
            }).show();
        });
        $('#btn12').click(function() {
            o1.set('align', {
                selfXY: [0, 'center'],
                baseXY: ['right', 'center']
            }).show();
        });
        $('#btn13').click(function() {
            o1.set('align', {
                selfXY: ['center', 'top'],
                baseXY: ['center', 'bottom']
            }).show();
        });
        $('#btn14').click(function() {
            o1.set('align', {
                selfXY: ['right', 'center'],
                baseXY: ['left', 'center']
            }).show();
        });



        var d1 = new Dialog({
            trigger: '#btn21'
        });
    });
});
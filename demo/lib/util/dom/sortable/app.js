/**
 * User: caolvchong@gmail.com
 * Date: 7/1/13
 * Time: 1:42 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Sortable = require('../../../../../js/lib/util/dom/sortable');

    $(function() {
        /**--------------------------------------------
         * 实例1： 纵向排序
         * --------------------------------------------*/
        new Sortable({
            element: '#sortable1',
            item: 'li'
        });

        /**--------------------------------------------
         * 实例2： 横向排序
         * --------------------------------------------*/
        new Sortable({
            element: '#sortable2',
            item: 'li'
        });

        /**--------------------------------------------
         * 实例3： grid排序
         * --------------------------------------------*/
        new Sortable({
            element: '#sortable3',
            item: 'li'
        });

        /**--------------------------------------------
         * 实例4： 带handler排序
         * --------------------------------------------*/
        new Sortable({
            element: '#sortable4',
            item: 'li',
            handler: '.handler'
        });
        /**--------------------------------------------
         * 实例5： 双容器排序
         * --------------------------------------------*/
        var s5_1 = new Sortable({
            element: '#sortable5_1',
            item: 'li',
            connect: '#sortable5_2'
        });
        $('#sortable5_1').on('click', 'li', function(e) {
            var node = $(this);
            node.toggleClass('drag-disabled');
            s5_1.dnd[node.hasClass('drag-disabled') ? 'disable' : 'enable'](node);
        });


        new Sortable({
            element: '#sortable5_2',
            item: 'li',
            connect: '#sortable5_1'
        }).on('dragend', function(element, dropping, dnd) {
                element.fadeOut(function() {
                    element.fadeIn();
                });
            });

        /**--------------------------------------------
         * 实例6： 多容器排序
         * --------------------------------------------*/
        new Sortable({
            element: '#sortable6_1',
            item: 'li',
            connect: '#sortable6_2'
        });
        new Sortable({
            element: '#sortable6_2',
            item: 'li',
            connect: '#sortable6_3'
        });
        new Sortable({
            element: '#sortable6_3',
            item: 'li',
            connect: ['#sortable6_1', '#sortable6_4']
        });

        /**--------------------------------------------
         * 实例7：
         * --------------------------------------------*/
        new Sortable({
            element: '#sortable7_1',
            item: 'li',
            connect: '#sortable7_2',
            connectSelf: false,
            revert: false,
            placeholder: function(element) {
                var div = $('<div style="width:200px;height: 10px; border: 1px solid #ddd; background: #C6E746"></div>');
                return div;
            },
            proxy: function(element) {
                var div = $('<div style="width:200px;height: 50px; border: 1px solid #ddd;">代理节点：' + element.text() + '</div>');
                return div;
            },
            dropped: function(element, dropping) {
                var div = $('<li style="width:200px;height: 50px; border: 1px solid #ddd;">drop节点：' + element.text() + '</li>');
                return div;
            },
            visible: true
        });
        new Sortable({
            element: '#sortable7_2',
            item: 'li'
        });

        /**--------------------------------------------
         * 实例8： portlet
         * --------------------------------------------*/

     });
});
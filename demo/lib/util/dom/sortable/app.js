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
            connect: [{
                element: '#sortable5_2',
                item: 'li'
            }]
        });
        $('#sortable5_1 li').on('click', function(e) {
            var node = $(this);
            node.toggleClass('drag-disabled');
            s5_1.dnd[node.hasClass('drag-disabled') ? 'disable' : 'enable'](node);
        });


        new Sortable({
            element: '#sortable5_2',
            item: 'li',
            connect: [{
                element: '#sortable5_1',
                item: 'li'
            }]
        }).on('drop', function(dataTransfer, element, dropping, dnd) {
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
            connect: [{
                element: '#sortable6_2',
                item: 'li'
            }]
        });
        new Sortable({
            element: '#sortable6_2',
            item: 'li',
            connect: [{
                element: '#sortable6_3',
                item: 'li'
            }]
        });
        new Sortable({
            element: '#sortable6_3',
            item: 'li',
            connect: [{
                element: '#sortable6_1',
                item: 'li'
            }]
        });

        /**--------------------------------------------
         * 实例7： 事件触发
         * --------------------------------------------*/


        /**--------------------------------------------
         * 实例8： portlet
         * --------------------------------------------*/

     });
});
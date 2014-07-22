/**
 * User: caolvchong@gmail.com
 * Date: 7/1/13
 * Time: 1:42 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Sortable = require('../../../../../js/lib/util/dom/sortable');
    var Action = require('../../../../../js/lib/util/dom/action');

    $(function() {
        /**--------------------------------------------
         * 新增实例： 父元素的position为fixed
         * --------------------------------------------*/
        new Sortable({
            element: '#sortable0',
            item: 'li',
            proxyParent:$('#proxyparent')//可以任意指定position不是fixed的元素作为父元素
        })

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
        var s7_1 = new Sortable({
            element: '#sortable7_1',
            item: 'li',
            connect: '#sortable7_2',
            connectSelf: false,
            revert: false,
            placeholder: function(element) {
                var node = $('<div class="placeholder-node"></div>');
                return node;
            },
            proxy: function(element) {
                var node = $('<div class="proxy-node">代理节点：' + element.text() + '</div>');
                return node;
            },
            dropped: function(element, dropping) {
                var node = $('<li class="dropped-node">drop节点：' + element.text() + '<span class="del-btn" data-action="del">X</span></li>');
                return node;
            },
            visible: true
        });
        new Sortable({
            element: '#sortable7_2',
            item: 'li'
        });
        Action.listen({
            del: function(e) {
                var node = $(e.target).closest('li');
                s7_1.dnd.destroy(node); // 移除该节点的拖拽
                node.remove();
            }
        });

        /**--------------------------------------------
         * 实例8： portlet
         * --------------------------------------------*/

     });
});
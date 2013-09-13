/**
 * User: caolvchong@gmail.com
 * Date: 7/1/13
 * Time: 1:42 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Dnd = require('../../../../../js/lib/util/dom/dnd');

    $(function() {
        /**--------------------------------------------
         * 实例1： 简单拖拽
         * --------------------------------------------*/
        new Dnd({
            element: '#drag1 .drag'
        });

        /**--------------------------------------------
         * 实例2： 句柄拖拽
         * --------------------------------------------*/
        new Dnd({
            element: '#drag2 .drag',
            handler: '.handler'
        });

        /**--------------------------------------------
         * 实例3： 容器限制
         * --------------------------------------------*/
        new Dnd({
            element: '#drag3 .drag',
            container: '#drag3'
        });

        /**--------------------------------------------
         * 实例4： x,y方向限制
         * --------------------------------------------*/
        new Dnd({
            element: '#drag4_1',
            axis: 'x'
        });
        new Dnd({
            element: '#drag4_2',
            axis: 'y'
        });

        /**--------------------------------------------
         * 实例5： 拖拽排除
         * --------------------------------------------*/
        new Dnd({
            element: '#drag5 .drag',
            except: '.except'
        });

        /**--------------------------------------------
         * 实例6： 每次拖动固定距离
         * --------------------------------------------*/
        new Dnd({
            element: '#drag6 .drag',
            grid: 50
        });

        /**--------------------------------------------
         * 实例7： 允许拖拽时支持滚动条滚动
         * --------------------------------------------*/
        new Dnd({
            element: '#drag7 .drag',
            scroll: true
        });

        /**--------------------------------------------
         * 实例8： drop
         * --------------------------------------------*/
        new Dnd({
            element: '#drag8 .drag',
            drop: '#drop8'
        });

        /**--------------------------------------------
         * 实例9： 各种事件
         * --------------------------------------------*/
        var logArea = $('#log9');
        var log = function(val) {
            var date = new Date();
            logArea.val(date.getMinutes() + ':' + date.getSeconds() + ': ' + val + '\n' + logArea.val());
        };
        var d9 = new Dnd({
            element: '#drag9 .drag',
            drop: '#drop9'
        });
        d9.on('beforedrag', function(e, dnd) {

        }).on('dragstart',function(e) {
            log('dragstart');
        }).on('drag',function(e) {
                log('drag');
            }).on('dragenter',function(e) {
                log('dragenter');
            }).on('dragover',function(e) {
                log('dragover');
            }).on('dragleave',function(e) {
                log('dragleave');
            }).on('dragend',function(e) {
                log('dragend');
            }).on('drop', function(e) {
                log('drop');
            });

        /**--------------------------------------------
         * 实例10： 禁用拖拽
         * --------------------------------------------*/
        var d10 = new Dnd({
            element: '#drag10 .drag',
            handler: '.handler'
        });
        $('#btn10_1').click((function(flag) {
            return function() {
                flag = !flag;
                d10[flag ? 'disable' : 'enable']($('#drag10 .handler').eq(0));
                $(this).val(flag ? '启用拖拽-1' : '禁用拖拽-1');
            };
        })(false));
        $('#btn10_2').click((function(flag) {
            return function() {
                flag = !flag;
                d10[flag ? 'disable' : 'enable']($('#drag10 .handler').eq(1));
                $(this).val(flag ? '启用拖拽-2' : '禁用拖拽-2');
            };
        })(false));

        /**--------------------------------------------
         * 实例11： 自定义代理节点样式
         * --------------------------------------------*/
        new Dnd({
            element: '#drag11 .drag',
            proxy: '<div class="proxy-self">---</div>'
        });

        /**--------------------------------------------
         * 实例12： 同时拖拽多个节点
         * --------------------------------------------*/

        /**--------------------------------------------
         * 实例13： drop到多个容器
         * --------------------------------------------*/
        new Dnd({
            element: '#drag13 .drag',
            drop: [$('#drop13_1'), $('#drop13_2')]
        });

        /**--------------------------------------------
         * 实例14： 快速注册
         * --------------------------------------------*/
        var d14 = new Dnd({
            element: '#drag14 .drag',
            drop: '#drop14',
            handler: '.handler',
            except: '.except'
        });
        $('#btn14').click(function() {
            var node = $('<div class="item drag"><div class="handler">我也可以拖拽</div></div>').appendTo($('#drag14'));
            d14.render(node);
        });
     });
});
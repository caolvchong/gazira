/**
 * User: caolvchong@gmail.com
 * Date: 7/1/13
 * Time: 1:42 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var action = require('../../../../../js/lib/util/dom/action');

    $(function() {
        action.listen({
            alert: function() {
                alert('document接受到冒泡，click');
            },
            aim1: {
                is: function(e, node, key) {
                    alert('aim1  只触发一次');
                },
                not: function() {
                    alert('没点击到aim1');
                }
            },
            aim2: {
                is: function(e, node, key) {
                    alert('aim2 会一直触发');
                },
                not: function() {
                    alert('没点击到aim2');
                    return false;
                }
            }
        });

        action.listen({
            alert: function(e, node, key) {
                e.stopPropagation();
                alert('click other');
            }
        }, $('#box2'));

        action.listen({
            alert: function(e, node, key) {
                alert('节点，click');
            }
        }, $('#box3'));

        action.listen({
            alert: function(e, node, key) {
                e.stopPropagation();
                alert($(e.target).val());
            }
        }, $('#box4'));

        action.listen({
            A: function(e, node, key) {
                alert('A');
            },
            B: function(e, node, key) {
                alert('B');
            },
            C: function(e, node, key) {
                alert('C');
            }
        }, $('#box6'));

        var num = 0;
        action.listen({
            aspect: {
                is: function(e, node, key) {
                    alert('is');
                },
                before: function(e, node, key) {
                    alert('before');
                    num++;
                    if (num % 2 === 1) {
                        return true;
                    } else {
                        return false;
                    }
                },
                after: function(e, node, key) {
                    alert('after');
                }
            }
        }, $('#box7'));
    });
});

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
            aim: {
                is: function(e, node, key) {
                    alert('aim');
                },
                not: function() {
                    alert('没点击到aim');
                }
            }
        });

        action.listen({
            alert: function() {
                alert('click other');
                return -1;
            }
        }, $('#box2'));

        action.listen({
            alert: function(e, node, key) {
                alert('节点，click');
            }
        }, $('#box3'));

        action.listen({
            alert: function(e, node, key) {
                alert($(e.target).val());
                return -1;
            }
        }, $('#box4'));
    });
});
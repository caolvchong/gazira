/**
 * User: caolvchong@gmail.com
 * Date: 7/3/13
 * Time: 8:46 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Selector = require('../../../../js/lib/cmp/autocomplete/selector');

    $(function() {
        var s = new Selector({
            parentNode: '#box1',
            autocomplete: {
                dataSource: ['abc', 'abd', 'cbd', 'csd', 'xxx', 'yyy', 'thank', 'you']
            }
        }).render();

        $('#btn').click(function() {
            alert(s.result());
        });
    });
});
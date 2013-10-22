define(function(require, exports, module) {
    var $ = require('$');
    var JSON = require('../../../../js/lib/util/json');

    $(function() {
        var json = {
            name: 'Tom',
            age: 15,
            male: true,
            friend: ['Jerry', 'White']
        };
        $('#btn1').click(function() { // 加密
            $('#result1').val(JSON.stringify(json));
        });
        $('#btn2').click(function() { // 加密
            console.log(JSON.parse($('#result1').val()));
        });
    });
});
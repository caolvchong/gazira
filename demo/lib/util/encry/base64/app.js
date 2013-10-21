define(function(require, exports, module) {
    var $ = require('$');
    var Base64 = require('../../../../../js/lib/util/encry/base64');

    $(function() {

        $('#btn1').click(function() { // 加密
            var str = $('#txt1').val();
            $('#result1').text(Base64.encode(str));
        });
        $('#btn2').click(function() { // 解密
            var str = $('#result1').text();
            $('#result2').text(Base64.decode(str));
        });
    });
});
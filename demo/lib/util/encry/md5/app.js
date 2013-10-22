define(function(require, exports, module) {
    var $ = require('$');
    var MD5 = require('../../../../../js/lib/util/encry/md5');

    $(function() {

        $('#btn1').click(function() { // 加密
            var str = $('#txt1').val();
            $('#result1').text(MD5(str));
        });
    });
});
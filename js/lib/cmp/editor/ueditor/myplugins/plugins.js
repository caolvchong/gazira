/**
 * User: caolvchong@gmail.com
 * Date: 9/5/13
 * Time: 7:59 PM
 */
define(function(require, exports, module) {
    var UE = require('../editor');
    UE.myplugins = {
        example: '我的插件例子',
        dialog: '一个弹窗的例子',
        photo: '上传照片',
        links: '插入链接',
        bdmap: '百度地图'
    };
    module.exports = UE.myplugins;
});
/**
 * User: caolvchong@gmail.com
 * Date: 9/16/13
 * Time: 11:47 AM
 */
define(function(require, exports, module) {
    var Class = require('../../class');
    var SwfUpload = require('./upload-swfupload');
    var Html5Upload = require('./upload-html5');
    var Upload = Class.create({
        Extends: Html5Upload.isSupportHTML5Upload ? Html5Upload : SwfUpload
    });
    Upload.isSupportHTML5Upload = Html5Upload.isSupportHTML5Upload;

    module.exports = Upload;
});
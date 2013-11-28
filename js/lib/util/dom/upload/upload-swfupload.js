/**
 * User: caolvchong@gmail.com
 * Date: 9/16/13
 * Time: 1:38 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var SWFUpload = require('./swfupload');
    var Base = require('../../base');

    /**
     * Queue Error错误码
     * SWFUpload.QUEUE_ERROR = {
     *     QUEUE_LIMIT_EXCEEDED : -100, // 文件数超过限定
     *     FILE_EXCEEDS_SIZE_LIMIT : -110, // 文件大小超过限定
     *     ZERO_BYTE_FILE : -120, // 存在空文件
     *     INVALID_FILETYPE : -130 // 存在不允许类型文件
     * };
     * file object 结构：文件属性，很多处理事件都会传递一个File Object参数来访问该文件的相关属性
     * {
     *     id : string, // SWFUpload控制的文件的id,通过指定该id可启动此文件的上传、退出上传等
     *     index : number, // 文件在选定文件队列（包括出错、退出、排队的文件）中的索引，getFile可使用此索引
     *     name : string, // 文件名，不包括文件的路径。
     *     size : number, // 文件字节数
     *     type : string, // 客户端操作系统设置的文件类型
     *     creationdate : Date, // 文件的创建时间
     *     modificationdate : Date, // 文件的最后修改时间
     *     filestatus : number // 文件的当前状态，对应的状态代码可查看SWFUpload.FILE_STATUS
     * }
     *
     * status object 结构：上传队列的状态信息，访问实例的getStats方法可获取此对象
     * {
     *     in_progress : number // 值为1或0，1表示当前有文件正在上传，0表示当前没有文件正在上传
     *     files_queued : number // 当前上传队列中存在的文件数量
     *     successful_uploads : number // 已经上传成功（uploadSuccess触发）的文件数量
     *     upload_errors : number // 已经上传失败的文件数量 (不包括退出上传的文件)
     *     upload_cancelled : number // 退出上传的文件数量
     *     queue_errors : number // 入队失败（fileQueueError触发）的文件数量
     * }
     */

    /**
     * 事件说明：
     * flashLoaded: 载入flash后触发
     * dialogStart: 弹出选择文件对话框之前触发
     * successAdd(file): 选择文件对话框消失时，文件成功加入队列时触发，每个文件加入成功都会触发
     *
     * overCountLimit(n): 超过上传限制数量
     * overSizeLimit(limit, file): 超过文件上传大小限制
     * zeroSize(file): 空文件上传
     * notAllowType(file): 不允许的文件类型
     *
     * errorAdd(file, code, message): 选择文件对话框消失时，文件加入队列失败时触发，每个文件加入失败都会触发
     * dialogComplete(n1, n2): 选择文件完成后触发（无论成功失败）
     * uploadStart(file): 上传文件到服务端之前的事件，可以在这里做最后的验证，曾删改post数据等, 如果该function返回false，则不会上传该文件，同时触发uploadError
     * process(file, bytes, total): 上传文件过程中定时触发，一般用来做进度条等即时反馈, bytes 该文件已经上传的字节数, total 该文件的总字节数
     * error(file, code, message): 文件上传失败时或者被终止时触发，引起的可能性有：上传地址不存在/主动终止，退出/upload_start_handler返回false/HTTP错误/IO错误/文件数目超过限制
     * success(file, data): 文件成功上传时触发，文件上传途中不能开始下一个文件上传
     * complete(file): 当在进行多文件上传的时候，中途用cancelUpload取消了正在上传的文件，或者用stopUpload停止了正在上传的文件，那么在uploadComplete中就要很小心的使用this. startUpload()，因为在上述情况下，uploadError和uploadComplete会顺序执行，因此虽然停止了当前文件的上传，但会立即进行下一个文件的上传，你可能会觉得这很奇怪，但事实上程序并没有错。如果你希望终止整个队列的自动上传，那么你需要做额外的程序处理了。
     * finish(file): 某个文件上传完
     * remove(file, index): 移除一个上传文件后
     * abort(file, index): 终止上传一个文件后
     * reset: 重置所有上传后
     */

    var Upload = Base.extend({
        attrs: {
            url: '', // 上传地址，必须配置
            swf: '', // flash地址，必须配置
            node: '', // 替换的DOM节点，必须配置
            type: '*', // 可允许上传类型
            maxSize: '5MB', // 文件大小限制
            maxCount: -1, // 文件数量限制，-1不限制
            multi: true, // 是否允许多文件上传
            disabled: false, // 是否禁用
            requeueOnError: false, // 如果设置为true，当文件对象发生uploadError时（除开fileQueue错误和FILE_CANCELLED错误），该文件对象会被重新插入到文件上传队列的前端，而不是被丢弃。如果需要，重新入队的文件可以被再次上传。如果要从上传队列中删除该文件对象，那么必须使用cancelUpload方法

            fileName: 'Filedata', // 该参数设置了POST信息中上传文件的name值。在Linux下面此参数设置无效，接收的name总为Filedata，因此为了保证最大的兼容性，建议此参数使用默认值
            data: {}, // 每个文件上传的时候，其中的值对都会被一同发送到服务端，键值对的值只能是字符串或者数字
            method: 'post',
            customSettings: {}, // 接收一个Object类型数据，可用于安全地存储与SWFUpload实例关联的自定义信息，例如属性和方法，而不用担心跟SWFUpload内部的方法和属性冲突以及版本升级的兼容.设置完毕以后，可以通过实例的customSettings属性来访问
            dataType: 'json',

            backgroundImage: '', // 按钮背景图片
            width: 100,
            height: 24,
            text: '', // 按钮文本
            textStyle: '', // 文本样式
            description: '选择文件', // 描述
            cursor: SWFUpload.CURSOR.ARROW, // 设置鼠标划过Flash Button时的光标状态。默认为SWFUpload.CURSOR.ARROW，如果设置为SWFUpload.CURSOR.HAND，则为手形
            mode: SWFUpload.WINDOW_MODE.TRANSPARENT, // 设置浏览器具体以哪种模式显示该SWF影片, 包括： SWFUpload.WINDOW_MODE.WINDOW是默认的模式. 该SWF将位于页面元素的最高层级。SWFUpload.WINDOW_MODE.OPAQUE　该SWF可以被页面类的其他元素通过层级的设置来覆盖它。SWFUpload.WINDOW_MODE.TRANSPARENT 该SWF的背景是透明的，可以透过它看到背后的页面元素

            debug: false, // 如果debug setting设置为true，那么页面底部会自动添加一个textArea， SWFUpload库和Flash都会调用此事件来在页面底部的输出框中添加debug信息供调试使用
            cache: false // 该布尔值设置是否在Flash URL后添加一个随机值，用来防止浏览器缓存了该SWF影片。这是为了解决一些基于IE-engine的浏览器上的出现一个BUG
        },
        initialize: function() {
            var that = this;
            Upload.superclass.initialize.apply(this, arguments);

            var settings = {};
            settings.upload_url = this.get('url');
            settings.flash_url = this.get('swf');
            settings.button_placeholder_id = $(this.get('node')).attr('id');
            settings.file_types = (function(types) {
                var arr = types.split(';');
                var result = [];
                for(var i = 0, len = arr.length; i < len; i++) {
                    result.push(arr[i].toLowerCase(), arr[i].toUpperCase());
                }
                return result.join(';');
            })(this.get('type'));
            settings.file_size_limit = this.get('maxSize').toUpperCase();
            if(this.get('maxCount') !== -1) {
                settings.file_upload_limit = this.get('maxCount');
                settings.file_queue_limit = this.get('maxCount');
            }
            settings.button_action = this.get('multi') === false ? SWFUpload.BUTTON_ACTION.SELECT_FILE : SWFUpload.BUTTON_ACTION.SELECT_FILES;
            settings.requeue_on_error = this.get('requeueOnError');


            settings.file_post_name = this.get('fileName');
            settings.post_params = this.get('data');
            settings.use_query_string = this.get('method').toLowerCase() === 'get';
            settings.custom_settings = this.get('customSettings');

            settings.button_image_url = this.get('backgroundImage');
            settings.button_width = this.get('width');
            settings.button_height = this.get('height');
            settings.button_text = this.get('text');
            settings.file_types_description = this.get('description');
            settings.button_cursor = this.get('cursor');
            settings.button_window_mode = this.get('mode');
            settings.button_text_style = this.get('textStyle');

            if(!!window.ActiveXObject || this.get('cache')) { // IE 强制设置不用缓存
                settings.prevent_swf_caching = true;
            }


            // 回调函数
            // 该事件函数是内部事件，因此不能被重写。当SWFupload实例化，加载的FLASH完成所有初始化操作时触发此事件
            settings.swfupload_loaded_handler = function() {
                that.trigger('flashLoaded');
                if(that.get('disabled')) {
                    that.disable();
                }
            };
            // 弹出选择文件对话框之前触发，该对话框单例模式
            settings.file_dialog_start_handler = function() {
                window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
                that.trigger('dialogStart');
            };
            // 选择文件对话框消失时，文件成功加入队列时触发，每个文件加入成功都会触发
            settings.file_queued_handler = function(file) {
                if(file) {
                    that.trigger('successAdd', file);
                }
            };
            // 选择文件对话框消失时，文件加入队列失败时触发，每个文件加入失败都会触发，加入队列失败的原因可能：文件大小限制，文件为0，超过文件队列限制，无效文件类型等
            settings.file_queue_error_handler = function(file, code, message) {
                if(code == SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
                    that.trigger('overCountLimit', settings.file_queue_limit);
                } else if(code == SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT) {
                    that.trigger('overSizeLimit', settings.file_size_limit, file);
                } else if(code == SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE) {
                    that.trigger('zeroSize', file);
                } else if(code == SWFUpload.QUEUE_ERROR.INVALID_FILETYPE) {
                    that.trigger('notAllowType', file);
                }
                that.trigger('errorAdd', file, code, message);
            };
            // 选择文件完成后触发（无论成功失败），如果要做自动上传，可以在这里调用this.startUpload() (事先最好判断是否满足上传条件)
            settings.file_dialog_complete_handler = function(n1, n2) {
                that.trigger('dialogComplete', n2, n1);
            };
            // 上传文件到服务端之前的事件，可以在这里做最后的验证，曾删改post数据等, 如果该function返回false，则不会上传该文件，同时触发uploadError
            settings.upload_start_handler = function(file) {
                if(file) {
                    that.trigger('uploadStart', file);
                }
            };
            // 上传文件过程中定时触发，一般用来做进度条等即时反馈, bytes 该文件已经上传的字节数, total 该文件的总字节数
            settings.upload_progress_handler = function(file, bytes, total) {
                if(file) {
                    that.trigger('progress', file, bytes, total);
                }
            };
            // 文件上传失败时或者被终止时触发，引起的可能性有：上传地址不存在/主动终止，退出/upload_start_handler返回false/HTTP错误/IO错误/文件数目超过限制
            settings.upload_error_handler = function(file, code, message) {
                if(file) {
                    that.trigger('error', file, code, message);
                }
            };
            // 文件成功上传时触发，文件上传途中不能开始下一个文件上传
            settings.upload_success_handler = function(file, data) {
                if(file) {
                    that.trigger('success', file, that.get('dataType').toLowerCase() === 'json' ? $.parseJSON(data) : data);
                }
            };
            // 一个文件完成了一个上传周期，无论是成功(uoloadSuccess触发)还是失败(uploadError触发)，此事件都会被触发，这也标志着一个文件的上传完成，可以进行下一个文件的上传了
            // 当在进行多文件上传的时候，中途用cancelUpload取消了正在上传的文件，或者用stopUpload停止了正在上传的文件，那么在uploadComplete中就要很小心的使用this. startUpload()，因为在上述情况下，uploadError和uploadComplete会顺序执行，因此虽然停止了当前文件的上传，但会立即进行下一个文件的上传，你可能会觉得这很奇怪，但事实上程序并没有错。如果你希望终止整个队列的自动上传，那么你需要做额外的程序处理了。
            settings.upload_complete_handler = function(file) {
                this.startUpload(); // 开启下一个上传
                var stats = that.swfupload.getStats();
                stats = stats || {};
                if(!stats.in_progress && stats.files_queued == 0) {
                    that.trigger('complete', file);
                }
                if(file) {
                    that.trigger('finish', file);
                }
            };

            // 如果debug setting设置为true，那么页面底部会自动添加一个textArea， SWFUpload库和Flash都会调用此事件来在页面底部的输出框中添加debug信息供调试使用
            settings.debug_handler = function(message) {
                if(typeof that.get('debug') === 'function') {
                    that.get('debug')(message);
                }
            };

            this.swfupload = new SWFUpload(settings);
        },
        remove: function(index) {
            var file = this.swfupload.getFile(index);
            var stats = this.swfupload.getStats();
            if(stats.in_progress) { // 有正在上传的放弃该文件上传
                this.abort(index);
            }
            stats.successful_uploads--;
            this.swfupload.setStats(stats);
            this.trigger('remove', file, index);
            return this;
        },
        abort: function(index) {
            index = +index;
            var file = this.swfupload.getFile(index);
            this.swfupload.cancelUpload(file.id);
            this.trigger('abort', file, index);
            return this;
        },
        upload: function() {
            this.swfupload.startUpload();
            return this;
        },
        reset: function() {
            var swf = this.swfupload;
            var stats = swf.getStats();
            stats = stats || {};
            if(stats.in_progress) { // 有正在上传的终止上传
                swf.stopUpload();
            }
            stats.successful_uploads = 0;
            stats.upload_errors = 0;
            stats.upload_cancelled = 0;
            stats.queue_errors = 0;
            swf.setStats(stats);
            this.set('disabled', false);
            this.trigger('reset');
            return this;
        },
        enable: function() {
            this.set('disabled', false);
            return this;
        },
        disable: function() {
            this.set('disabled', true);
            return this;
        },
        _onChangeUrl: function(url) {
            this.swfupload.setUploadURL(url);
        },
        _onChangeDisabled: function(val) {
            var swf = this.swfupload;
            swf.setButtonDisabled(!!val);
        }
    });

    module.exports = Upload;
});
define(function(require, exports, module) {
    /**
     * cookie存储方式：
     *     Set-Cookie: name=value; expires=date; path=path; domain=domain; secure
     *     name：cookie的名字，value：cookie的值
     *     expires：保存时间，使用GMT格式，不指定的话默认保存到浏览器关闭为止
     *     path：cookie存取的路径，默认是当前网页所在的路径。一般情况下，父目录可以访问子目录的cookie，子目录不可以访问父目录的cookie
     *     domain：指定cookie存取的域，默认是当前网页的域
     *     secure：使用HTTPS时候使用
     * javascript操作cookie：
     *     存储：document.cookie = name=<value>[; expires=<date>][; domain=<domain>][; path=<path>][; secure]
     *     读取：document.cookie可以取出所有cookie，然后根据name=value;来切割出value
     *     删除：重新存储cookie，将其expires设置为过去的时间即可
     * cookie大小限制: 4K
     */
    var decode = decodeURIComponent;
    var encode = encodeURIComponent;
    var r = {
        /**
         * 设置一个cookie
         * @param key {String} cookie的名字
         * @param value {String} cookie的值
         * @param time {Integer} 过期时间，毫秒数，默认一天
         * @param params {Object} 附加选项
         *     path {String} cookie存储路径
         *     domain {String} cookie存储域
         *     secure {Boolean} 是否使用HTTPS方式
         * @return {Undefined}
         */
        set:function(key, value, time, params) {
            if(!time) {
                time = 365 * 24 * 3600 * 1000;
            }
            var expires = new Date();
            expires.setTime(expires.getTime() + time);
            var cookie = encode(key) + '=' + encode(value) + ';expires=' + expires.toGMTString();
            if(params) {
                if(params.path) {
                    cookie += ';path=' + params.path;
                }
                if(params.domain) {
                    cookie += ';domain=' + params.domain;
                }
                if(params.secure) {
                    cookie += ';secure';
                }
            }
            document.cookie = cookie;
        },
        /**
         * 设置多个cookie
         * @param object {Object} 键值对，键是cookie的name，值是cookie的value
         * @param time {Integer} 过期时间，毫秒数，默认一天
         * @param params {Object} 附加选项，同set方法
         * @return {Undefined}
         */
        sets:function(object, time, params) {
            for(var i in object) {
                r.set(i, object[i], time, params);
            }
        },
        /**
         * 获取一个指定的cookie
         * @param key {String} cookie的名字
         * @return {String} cookie的值
         */
        get:function(key) {
            var cookieString = document.cookie;
            key = encode(key);
            var start = cookieString.indexOf(key + '=');
            var result = '';
            if(start !== -1) {
                start += key.length + 1;
                var end = cookieString.indexOf(';', start);
                if(end === -1) {
                    result = decode(cookieString.substring(start));
                } else {
                    result = decode(cookieString.substring(start, end));
                }
            }
            return result;
        },
        /**
         * 删除一个或多个cookie
         * 如果最后一个参数是一个对象，则删除指定域上的指定cookie(1-倒数第二个)
         * 如果最后一个参数是字符串，表明全部都是当前域上的指定cookie
         */
        del:function() {
            var expires = new Date();
            var len = arguments.length;
            var params = arguments[len - 1];
            var hasParams = typeof params === 'object';
            params = hasParams ? params : '';
            expires.setTime(expires.getTime() - 1 * 24 * 3600 * 1000);
            for(var i = 0, l = hasParams ? len - 1 : len; i < l; i++) {
                r.set(arguments[i], '', expires, params);
            }
        }
    };
    module.exports = r;
});

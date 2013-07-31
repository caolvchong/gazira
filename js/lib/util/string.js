define(function(require, exports, module) {
    var r = {
        /**
         * 返回字符串的长度,全角字符算两个长度
         * @param {String} string 需要计算长度的字符串
         */
        blength: function(string, flag) {
            var len = 0;
            if(string) {
                len = string.replace(/[^\x00-\xff]/g, '**').length;
                if(flag === true) {
                    len = Math.ceil(len / 2);
                }
            }
            return len;
        },
        /**
         * 从字符串的左边或者右边截取需要长度的字符串(默认左边)
         * @param {String} string 被操作的字符串
         * @param {Integer} n 截取的长度
         * @param {Object} params 附加参数
         *         fullSharp : string中的全角字符算作两个长度
         *         dir : 默认中左边开始截取,取值为right则从右边开始截取
         * @return {String} 截取得到的字符串
         */
        cut: function(string, n, params) {
            params = params || {};
            var fullSharp = (params === true || params.fullSharp === true);
            var right = params && params.dir === 'right';
            if(fullSharp) { // 全角算两个字符
                var bLen = this.blength(string), nowLen = 0, suitLen = 0;
                if(bLen <= n) { // 全角长度还不如n,则返回全部,减少计算量
                    return string;
                }
                var t = n / 2, temp;
                t = t !== parseInt(t, 10) ? parseInt(t, 10) - 1 : t;
                temp = right ? string.slice(string.length - t) : string.slice(0, t);
                suitLen = this.blength(temp);
                nowLen = temp.length;
                for(var i = nowLen, len = string.length; i < len; i++) {
                    if(suitLen < n && nowLen < bLen) {
                        t = right ? len - i - 1 : i;
                        /[^\x00-\xff]/.test(string.charAt(t)) ? suitLen += 2 : suitLen++;
                        nowLen++;
                    } else {
                        break;
                    }
                }
                return right ? string.slice(string.length - nowLen) : string.slice(0, nowLen);
            } else {
                return right ? string.slice(string.length - n) : string.slice(0, n);
            }
        },
        /**
         * 将html标签的字符串转义(或者将转义后的转回来)
         * @param {String} string 被操作的字符串
         * @param {Boolean} isDecode 反转义,默认是转义，无需该参数
         */
        code: function(string, isDecode) {
            var r, s;
            if(isDecode === true) {
                r = [/&amp;/g, /&gt;/g, /&lt;/g];
                s = ['&', '>', '<'];
            } else {
                r = [/&/g, />/g, /</g];
                s = ['&amp;', '&gt;', '&lt;'];
            }
            for(var i = 0, len = s.length; i < len; i++) {
                string = string.replace(r[i], s[i]);
            }
            return string;
        },
        /**
         * 解析字符串为可读格式：先转义标签为实体，然后解析空格和换行，最后解析链接
         * @param string
         * @return {String}
         */
        content: function(string) {
            string = r.code(string);
            string = string.replace(/ /g, '&nbsp;').replace(/\n/g, '<br/>');
            string = string.replace(/((https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?)/g, function($0, $1) {
                return '<a href="' + $1 + '" target="_blank">' + $1 + '</a>';
            });
            return string;
        }
    };
    module.exports = r;
});

/**
 * User: caolvchong@gmail.com
 * Date: 10/12/12
 * Time: 11:42 AM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Widget = require('../widget');
    var ajax = require('../../util/ajax');

    var helper = {
        tpl: function(url, page, flag) {
            var html = '<a href="' + (flag === true ? '#' : (url + page)) + '" data-page="' + page + '" data-action="page">' + page + '</a>';
            return html;
        }
    };

    var Pagination = Widget.extend({
        attrs: {
            url: '', // 获取数据的URL
            type: 'ajax', // 默认方式ajax分页，
            data: null, // 静态分页时候的数据数组，或ajax分页的附加数据
            before: null, // ajax请求前的回调
            success: null, // 点击分页后的回调,ajax则为成功之后
            error: null, // ajax请求失败后的回调
            method: 'get', // ajax请求方法
            pageName: 'page', // 传递给后端的页数参数名
            sizeName: 'pagesize', // 传递给后端的每页数量参数名
            totalName: 'data.total', // 后端返回总条数的参数名
            pageIndexOffset: 0, //定义获取后端页码的偏移量
            size: 12, // 每页数量
            current: { // 当前页
                value: 1,
                setter: function(val, prev) {
                    if(!val) {
                        var totalPage = Math.ceil(this.get('total') / this.get('size'));
                        return Math.min(Math.max(val, 1), totalPage);
                    } else {
                        return val;
                    }
                }
            },
            total: 0, // 数据总数
            template: '<div class="widget-pagination"></div>'
        },
        setup: function() {
            Pagination.superclass.setup.call(this);
            this._init = true;
        },
        events: {
            'click [data-action=prev]': function(e) { // 上一页事件
                if(this.get('type') !== 'link') {
                    if(!$(e.target).hasClass('disabled')) {
                        this.prev();
                    }
                    e.preventDefault();
                }
            },
            'click [data-action=page]': function(e) { // 某一页事件
                if(this.get('type') !== 'link') {
                    this.load($(e.target).attr('data-page'));
                    e.preventDefault();
                }
            },
            'click [data-action=next]': function(e) { // 下一页事件
                if(this.get('type') !== 'link') {
                    if(!$(e.target).hasClass('disabled')) {
                        this.next();
                    }
                    e.preventDefault();
                }
            }
        },
        prev: function() {
            this.set('current', Math.max(1, this.get('current') - 1));
            return this;
        },
        next: function() {
            var totalPage = Math.ceil(this.get('total') / this.get('size'));
            this.set('current', Math.min(totalPage, this.get('current') + 1));
            return this;
        },
        load: function(val) {
            this.set('current', +val);
            return this;
        },
        classicHTML: function() {
            var isPost = this.get('method').toLowerCase() === 'post';
            var url = this.get('url');
            var x = this.get('x') || 2; // 当前页码附近显示页数
            var y = this.get('y') || 1; // 省略号附近显示页数
            var size = this.get('size');
            var totalPage = Math.ceil(this.get('total') / size); // 总页数
            var current = this.get('current'); // 当前页
            var sizeName = this.get('sizeName');
            var pageName = this.get('pageName');
            var html = [];
            var pn = ['', ''];
            var split = '<span>...</span>';
            var i;
            if(!isPost) {
                url += url.indexOf('?') === -1 ? '?' : '&';
                url += $.param(this.get('data') || {});
                if(url.indexOf(sizeName + '=') === -1) {
                    url += sizeName + '=' + size + '&';
                }
                if(url.indexOf(pageName + '=') === -1) {
                    url += pageName + '=';
                }
            }
            if(this.get('showPN') !== false) {
                pn[0] = '<a href="' + (isPost ? '#' : (url + Math.max(1, current - 1))) + '" data-action="prev">上一页</a>';
                pn[1] = '<a href="' + (isPost ? '#' : (url + Math.min(totalPage, current + 1))) + '" data-action="next">下一页</a>';
            }
            if(totalPage <= 5) {
                for(i = 1; i <= totalPage; i++) {
                    html.push(helper.tpl(url, i, isPost));
                }
            } else {
                if(current <= 3) {
                    for(i = 1; i <= 4; i++) {
                        html.push(helper.tpl(url, i, isPost));
                    }
                    html.push(split, helper.tpl(url, totalPage, isPost));
                } else if(current >= totalPage - 2) {
                    html.push(helper.tpl(url, 1, isPost), split);
                    for(i = totalPage - 2; i <= totalPage; i++) {
                        html.push(helper.tpl(url, i, isPost));
                    }
                } else {
                    html.push(helper.tpl(url, 1, isPost), split, helper.tpl(url, current - 1, isPost), helper.tpl(url, current, isPost), helper.tpl(url, current + 1, isPost), split, helper.tpl(url, totalPage, isPost));
                }
            }
            return pn[0] + html.join('') + pn[1];
        },
        /**
         * 视图，自定义显示的话需要重写此方法
         * flag
         */
        view: function(flag) {
            var size = this.get('size');
            var current = this.get('current'); // 当前页
            this.element.html(this.classicHTML());
            this.reflow();
            if(this.get('type') === 'ajax') {
                if(flag !== false) {
                    this.ajax();
                }
            } else {
                this.get('success') && this.get('success').call(this, current, $.isArray(this.get('data')) ? this.get('data').splice((current - 1) * size, Math.min(this.get('data').length, current * size)) : []);
            }
            return this;
        },
        reflow: function() {
            var current = this.get('current');
            var totalPage = Math.ceil(this.get('total') / this.get('size'));
            this.$('[data-action=prev]').toggleClass('disabled', current <= 1);
            this.$('[data-action=next]').toggleClass('disabled', current >= totalPage);
            this.$('[data-page]').removeClass('active');
            this.$('[data-page=' + current + ']').addClass('active');
            return this;
        },
        ajax: function() {
            var that = this;
            var sa = ajax.single(this.cid);
            var data = {};
            var list = ['before', 'error', 'complete'];
            var obj = {
                url: this.get('url'),
                success: function(data) {
                    var totalName = that.get('totalName').split('.');
                    var total = data;
                    var prev = +that.get('total');
                    for(var i = 0, len = totalName.length; i < len; i++) {
                        if(total) {
                            total = total[totalName[i]];
                        }
                    }
                    that.checkTotal(total, prev);
                    that.get('success') && that.get('success').call(that, that.get('current'), data);
                }
            };
            var params = this.get('data');
            params = $.isFunction(params) ? params.call(this) : params;
            data[this.get('pageName')] = +this.get('current') + (+this.get('pageIndexOffset'));
            data[this.get('sizeName')] = this.get('size');
            obj.data = typeof params === 'object' ? $.extend(data, params) : params;
            obj.type = this.get('method');

            for(var i = 0, len = list.length; i < len; i++) {
                var key = list[i];
                if(that.get(key)) {
                    obj[key] = that.get(key).call(that);
                }
            }
            return sa.send(obj);
        },
        checkTotal: function(total, prev) {
            var current = this.get('current');
            var size = this.get('size');
            total = +total || 0;
            if(prev !== total) {
                var totalPage = Math.ceil(total / size);
                this.set('total', total, {silent: true});
                if(current > totalPage) {
                    this.set('current', totalPage);
                } else {
                    this.view(false); // 只刷新分页视图，false避免递归请求
                }
            }
        },
        _onRenderCurrent: function(val, prev) {
            this.view();
        },
        _onRenderTotal: function(val, prev) {
            if(this._init !== true) {
                this.view();
            } else {
                delete this._init;
            }
        }
    });

    return Pagination;
});
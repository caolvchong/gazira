/**
 * User: caolvchong@gmail.com
 * Date: 7/3/13
 * Time: 8:46 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Pagination = require('../../../../js/lib/cmp/pagination/pagination');

    $(function() {
        var p1 = new Pagination({
            parentNode: '#box1',
            type: 'static',
            total: +$('#total_count1').val(),
            size: 10,
            success: function(page, data) {
                $('#content1').html('载入第<em class="super">' + page + '</em>页数据，这里自行拼接显示');
                console.log('1', data);
            }
        }).render();

        $('#btn11').click(function() {
            p1.set('current', 1).set('total', +$('#total_count1').val());
        });
        $('#btn12').click(function() {
            p1.set('current', 6);
        });

        //----------------------------------------
        var p2 = new Pagination({
            parentNode: '#box2',
            url: './data.php',
            size: 10,
            before: function() {
                $('#content2').html('正在请求数据');
            },
            success: function(page, data) {
                $('#content2').html('载入第<em class="super">' + page + '</em>页数据，这里自行拼接显示');
                console.log('2', data);
            }
        }).render();
        $('#btn21').click(function() {
            p2.set('current', 6);
        });

        //----------------------------------------
        new Pagination({
            parentNode: '#box3',
            type: 'link',
            url: '.',
            size: 10,
            total: Math.floor(Math.random() * 100)
        }).render();

        //----------------------------------------
        var P = Pagination.extend({
            view: function(flag) {
                var html = '<span>共<em>' + this.get('total') + '</em>个</span>';
                html += '<input type="button" class="btn" value="<" data-action="prev"/>';
                html += '<input type="button" class="btn" value=">" data-action="next"/>';

                this.element.html(html);
                this.reflow();
                this.ajax();
                return this;
            }
        });

        new P({
            parentNode: '#box4',
            url: './data.php',
            size: 10,
            before: function() {
                $('#content4').html('正在请求数据');
            },
            success: function(page, data) {
                $('#content4').html('载入第<em class="super">' + page + '</em>页数据，这里自行拼接显示');
                console.log('4', data);
            }
        }).render();

        //----------------------------------------
        new Pagination({
            parentNode: '#box5',
            url: './data.php',
            data: {
                name: 'tom',
                age: 22
            },
            size: 10,
            before: function() {
                $('#content5').html('正在请求数据');
            },
            success: function(page, data) {
                $('#content5').html('载入第<em class="super">' + page + '</em>页数据，这里自行拼接显示');
                console.log('5', data);
            }
        }).render();

        //----------------------------------------
        new Pagination({
            parentNode: '#box6',
            url: './data.php',
            data: function() {
                return {
                    url: 'pagination.php',
                    method: 'get',
                    params: {
                        position: this.get('current'),
                        size: this.get('size')
                    }
                };
            },
            method: 'post',
            size: 10,
            before: function() {
                $('#content6').html('正在请求数据');
            },
            success: function(page, data) {
                $('#content6').html('载入第<em class="super">' + page + '</em>页数据，这里自行拼接显示');
                console.log('6', data);
            }
        }).render();

        //----------------------------------------
        new Pagination({
            parentNode: '#box7',
            url: './data.php',
            data: {
                name: 'tom',
                age: 22
            },
            size: 10,
            pageName: 'pageIndex',
            pageIndexOffset: -1,
            before: function() {
                $('#content7').html('正在请求数据');
            },
            success: function(page, data) {
                $('#content7').html('载入第<em class="super">' + page + '</em>页数据，这里自行拼接显示');
                console.log('7', data);
            }
        }).render();

        //----------------------------------------
        // 非规范数据示例
        var P2 = Pagination.extend({
            /**
             * AJAX自定义，这里参数随意，但要确保view里面调用是一致的传参
             * @param page
             */
            ajax: function(page) {
                var that = this;
                $.ajax({
                    url: './data.json?page=' + page,
                    dataType: 'json',
                    success: function(data) {
                        var total = data.pagesum * data.pagesize;
                        var prev = +that.get('total');
                        that.checkTotal(total, prev);
                        that.get('success') && that.get('success').call(that, that.get('current'), data);

                    }
                });
            },
            /**
             * 视图
             * @param flag
             * @returns {*}
             */
            view: function(flag) {
                var total = this.get('total');
                var totalPage = Math.ceil(total / this.get('size'));
                var html = '<span>共<em>' + totalPage + '</em>页</span>';
                for(var i = 0; i < totalPage; i++) {
                    html += '<a href="#" data-action="page" data-page="' + (i + 1) + '">' + (i + 1) + '</a>'
                }
                html += '<a href="#" data-action="next">下一页</a>';
                this.element.html(html);
                this.reflow();
                if(flag !== false) {
                    this.ajax(this.get('current'));
                }
                return this;
            }
        });
        new P2({
            parentNode: '#box8',
            total: 0,
            size: 2,
            success: function(page, data) {
                console.log(arguments);
            }
        }).render();

    });
});
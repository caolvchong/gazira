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
    });
});
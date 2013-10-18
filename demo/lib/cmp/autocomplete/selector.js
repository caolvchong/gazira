/**
 * User: caolvchong@gmail.com
 * Date: 7/3/13
 * Time: 8:46 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Selector = require('../../../../js/lib/cmp/autocomplete/selector');
    var Filter = require('../../../../js/lib/cmp/autocomplete/filter');

    $(function() {
        // 简单selector
        var s1 = new Selector({
            parentNode: '#box1',
            autocomplete: {
                dataSource: ['abc', 'abd', 'cbd', 'csd', 'xxx', 'yyy', 'thank', 'you']
            }
        }).render();

        $('#btn').click(function() {
            alert(s1.result());
        });

        // ajax请求的
        new Selector({
            parentNode: '#box2',
            autocomplete: {
                dataSource: './data.php?key={{query}}'
            }
        }).render();

        // 另一个ajax请求的
        new Selector({
            parentNode: '#box3',
            hasInCache: function(value, cache) {
                return $.inArray(value.id + '', cache) > -1;
            },
            autocomplete: {
                filter: function(data, query, cache) {
                    return data;
                },
                itemTemplate: function(data) {
                    return '<li data-role="item" data-value="' + data.id + '">' + data.content + ' ' + data.xxx + '</li>';
                },
                dataSource: function(value) {
                    var that = this;
                    $.ajax({
                        url: './data2.php',
                        data: {
                            key: value,
                            date: +new Date
                        },
                        dataType: 'json',
                        success: function(data) {
                            that.trigger('data', data.data);
                        },
                        error: function(data) {
                            that.trigger('data', {});
                        }
                    });
                }
            }
        }).render();

    });
});
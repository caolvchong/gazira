/**
 * User: caolvchong@gmail.com
 * Date: 7/3/13
 * Time: 8:46 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var AutoComplete = require('../../../../js/lib/cmp/autocomplete/autocomplete');

    $(function() {
        // 简单autocomplete
        new AutoComplete({
            trigger: '#ac1',
            dataSource: ['abc', 'abd', 'cbd']
        }).render();

        // 阻止回车事件:当输入框在 form 中，直接回车会提交表单，这时需要设置 submitOnEnter
        new AutoComplete({
            trigger: '#ac2',
            dataSource: ['abc', 'abd', 'cbd'],
            submitOnEnter: false
        }).render();

        // 默认选中第一个
        new AutoComplete({
            trigger: '#ac3',
            dataSource: ['abc', 'abd', 'cbd'],
            selectFirst: true
        }).render();

        // 高亮匹配值
        new AutoComplete({
            trigger: '#ac4',
            dataSource: ['abc', 'abd', 'cbd'],
            highlight: true
        }).render();

        // ajax
        new AutoComplete({
            trigger: '#ac5',
            dataSource: './data.php?key={{query}}'
        }).render();

        // 另一种ajax
        new AutoComplete({
            trigger: '#ac6',
            filter: function(data) {
                return data;
            },
            itemTemplate: function(data) {
                return '<li data-role="item" data-value="' + data.content + '->' + data.id + '">' + data.content + ' ' + data.xxx + '</li>';
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
        }).render().on('itemSelect', function(data) {
                var trigger = this.get('trigger');
                setTimeout(function() {
                    trigger.val(data.content);
                }, 1000);
            });

        // 自定义模板
        new AutoComplete({
            trigger: '#ac7',
            dataSource: ['abc', 'abd', 'cbd'],
            itemTemplate: '<li data-value="{{value}}">---{{text}}---</li>'
        }).render();

        // Email 自动补全
        var data = [
            '163.com',
            '126.com',
            'gmail.com'
        ];
        new AutoComplete({
            trigger: '#ac8',
            dataSource: function(query) {
                var a = $.map(data, function(v, i) {
                    return query + '@' + v;
                });
                return a;
            },
            filter: '',
            inputFilter: function(v){
                return v.replace(/^(.*)@.*$/,'$1');
            }
        }).render();
    });
});
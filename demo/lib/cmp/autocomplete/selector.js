/**
 * User: caolvchong@gmail.com
 * Date: 7/3/13
 * Time: 8:46 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Selector = require('../../../../js/lib/cmp/autocomplete/selector');
    var Overlay = require('../../../../js/lib/cmp/overlay');
    var ZTree = require('../../../../js/lib/cmp/tree/ztree/ztree');

    $(function() {
        // 简单selector
        var s1 = new Selector({
            parentNode: '#box1',
            autocomplete: {
                dataSource: ['abc', 'abd', 'cbd', 'csd', 'xxx', 'yyy', 'thank', 'you']
            }
        }).render();

        $('#btn1').click(function() {
            alert(s1.result());
        });

        // ajax请求的
        var s2 = new Selector({
            parentNode: '#box2',
            autocomplete: {
                dataSource: './data.php?key={{query}}'
            }
        }).render();
        s2.addItem('val', '显示的值');
        $('#btn2').click(function() {
            alert(s2.result());
        });

        // 另一个ajax请求的
        var s3 = new Selector({
            parentNode: '#box3',
            hasInCache: function(value, cache) {
                return $.inArray(value.id + '', cache) > -1;
            },
            autocomplete: {
                attrs: {
                    inputor: function(text) {
                        if(text) {
                            treeShow.hide();
                        } else {
                            treeShow.show();
                        }
                    }
                },
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

        var treeShow = new Overlay({
            template: '<div class="ztree" id="overlayTree"></div>',
            width: 200,
            height: 375,
            zIndex: 99,
            align: {
                baseElement: '#box3',
                baseXY: [0, '100%']
            }
        }).render();
        var setting = {
            data: {
                simpleData: {
                    enable: true
                }
            }
        };
        var zNodes = [
            { id: 1, pId: 0, name: "父节点1 - 展开", open: true},
            { id: 11, pId: 1, name: "父节点11 - 折叠"},
            { id: 111, pId: 11, name: "叶子节点111"},
            { id: 112, pId: 11, name: "叶子节点112"},
            { id: 113, pId: 11, name: "叶子节点113"},
            { id: 114, pId: 11, name: "叶子节点114"},
            { id: 12, pId: 1, name: "父节点12 - 折叠"},
            { id: 121, pId: 12, name: "叶子节点121"},
            { id: 122, pId: 12, name: "叶子节点122"},
            { id: 123, pId: 12, name: "叶子节点123"},
            { id: 124, pId: 12, name: "叶子节点124"},
            { id: 13, pId: 1, name: "父节点13 - 没有子节点", isParent: true},
            { id: 2, pId: 0, name: "父节点2 - 折叠"},
            { id: 21, pId: 2, name: "父节点21 - 展开", open: true},
            { id: 211, pId: 21, name: "叶子节点211"},
            { id: 212, pId: 21, name: "叶子节点212"},
            { id: 213, pId: 21, name: "叶子节点213"},
            { id: 214, pId: 21, name: "叶子节点214"},
            { id: 22, pId: 2, name: "父节点22 - 折叠"},
            { id: 221, pId: 22, name: "叶子节点221"},
            { id: 222, pId: 22, name: "叶子节点222"},
            { id: 223, pId: 22, name: "叶子节点223"},
            { id: 224, pId: 22, name: "叶子节点224"},
            { id: 23, pId: 2, name: "父节点23 - 折叠"},
            { id: 231, pId: 23, name: "叶子节点231"},
            { id: 232, pId: 23, name: "叶子节点232"},
            { id: 233, pId: 23, name: "叶子节点233"},
            { id: 234, pId: 23, name: "叶子节点234"},
            { id: 3, pId: 0, name: "父节点3 - 没有子节点", isParent: true}
        ];
        $.fn.zTree.init($('#overlayTree'), setting, zNodes);

        $(document).bind('click', function(e) { // 不在树上点击隐藏
            var p = $(e.target).closest('#overlayTree');
            if(!(p && p[0])) {
                treeShow.hide();
            }
        });
    });
});
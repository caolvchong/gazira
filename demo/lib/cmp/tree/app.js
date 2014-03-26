define(function(require, exports, module) {
    var $ = require('$');
    var ZTree = require('../../../../js/lib/cmp/tree/ztree/ztree');

    $(function() {
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

        $.fn.zTree.init($("#treeDemo"), setting, zNodes);


        var setting = {
            data: {
                simpleData: {
                    enable: true
                }
            },
            async: {
                enable: true,
                url: "./data.php",
                method: 'get',
                autoParam: ["id", "pId", "name=n", "level=lv"],
                otherParam: {"otherParam": "zTreeAsyncTest"},
                dataFilter: function(treeId, parentNode, childNodes) {
                    if(!childNodes) return null;
                    for(var i = 0, l = childNodes.length; i < l; i++) {
                        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
                    }
                    return childNodes;
                }
            },
            callback: {
                onClick: function(e, treeId, treeNode) {
                    if(treeNode.good) {
                        console.log(treeNode);
                    }
                }
            }
        };
        var zNodes = [
            { id: 1, pId: 0, name: "x1", right: false},
            { id: 11, pId: 1, name: "x1-1", right: false, isParent: true, sync: true},
            { id: 12, pId: 1, name: "x1-2", right: false, isParent: true, sync: true},
            { id: 13, pId: 1, name: "x1-3", right: false, isParent: true, sync: true},
            { id: 2, pId: 0, name: "x2", right: false},
            { id: 21, pId: 2, name: "x2-1", right: false, isParent: true, sync: true},
            { id: 22, pId: 2, name: "x2-2", right: false, isParent: true, sync: true},
            { id: 23, pId: 2, name: "x2-3", right: false, isParent: true, sync: true}
        ];

        $.fn.zTree.init($("#treeDemo2"), setting, zNodes);


//        var setting = {
//            view: {
//                selectedMulti: false
//            },
//            async: {
//                enable: true,
//                url: "../asyncData/getNodes.php",
//                autoParam: ["id", "name=n", "level=lv"],
//                otherParam: {"otherParam": "zTreeAsyncTest"},
//                dataFilter: filter
//            },
//            callback: {
//                beforeClick: beforeClick,
//                beforeAsync: beforeAsync,
//                onAsyncError: onAsyncError,
//                onAsyncSuccess: onAsyncSuccess
//            }
//        };
//
//        function filter(treeId, parentNode, childNodes) {
//            if(!childNodes) return null;
//            for(var i = 0, l = childNodes.length; i < l; i++) {
//                childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
//            }
//            return childNodes;
//        }
//
//        function beforeClick(treeId, treeNode) {
//            if(!treeNode.isParent) {
//                alert("请选择父节点");
//                return false;
//            } else {
//                return true;
//            }
//        }
//
//        var log, className = "dark";
//
//        function beforeAsync(treeId, treeNode) {
//            className = (className === "dark" ? "" : "dark");
//            showLog("[ " + getTime() + " beforeAsync ]&nbsp;&nbsp;&nbsp;&nbsp;" + ((!!treeNode && !!treeNode.name) ? treeNode.name : "root"));
//            return true;
//        }
//
//        function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
//            showLog("[ " + getTime() + " onAsyncError ]&nbsp;&nbsp;&nbsp;&nbsp;" + ((!!treeNode && !!treeNode.name) ? treeNode.name : "root"));
//        }
//
//        function onAsyncSuccess(event, treeId, treeNode, msg) {
//            showLog("[ " + getTime() + " onAsyncSuccess ]&nbsp;&nbsp;&nbsp;&nbsp;" + ((!!treeNode && !!treeNode.name) ? treeNode.name : "root"));
//        }
//
//        function showLog(str) {
//            if(!log) log = $("#log");
//            log.append("<li class='" + className + "'>" + str + "</li>");
//            if(log.children("li").length > 8) {
//                log.get(0).removeChild(log.children("li")[0]);
//            }
//        }
//
//        function getTime() {
//            var now = new Date(),
//                h = now.getHours(),
//                m = now.getMinutes(),
//                s = now.getSeconds(),
//                ms = now.getMilliseconds();
//            return (h + ":" + m + ":" + s + " " + ms);
//        }
//
//        function refreshNode(e) {
//            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
//                type = e.data.type,
//                silent = e.data.silent,
//                nodes = zTree.getSelectedNodes();
//            if(nodes.length == 0) {
//                alert("请先选择一个父节点");
//            }
//            for(var i = 0, l = nodes.length; i
//                < l; i++) {
//                zTree.reAsyncChildNodes(nodes[i], type, silent);
//                if(!silent) zTree.selectNode(nodes[i]);
//            }
//        }
//
//        $(document).ready(function() {
//            $.fn.zTree.init($("#treeDemo"), setting);
//            $("#refreshNode").bind("click", {type: "refresh", silent: false}, refreshNode);
//            $("#refreshNodeSilent").bind("click", {type: "refresh", silent: true}, refreshNode);
//            $("#addNode").bind("click", {type: "add", silent: false}, refreshNode);
//            $("#addNodeSilent").bind("click", {type: "add", silent: true}, refreshNode);
//        });
    });
});
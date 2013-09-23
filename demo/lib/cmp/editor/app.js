/**
 * User: caolvchong@gmail.com
 * Date: 7/3/13
 * Time: 8:46 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Editor = require('../../../../js/lib/cmp/editor/ueditor/ueditor');

    $(function() {
        Editor.getEditor('myEditor', {
            UEDITOR_HOME_URL: 'http://localhost/gazira/js/lib/cmp/editor/ueditor/',
            //这里可以选择自己需要的工具按钮名称,此处仅选择如下五个
            toolbars: [
                ['FullScreen', 'Source', 'Undo', 'Redo', '|', 'Bold', 'Italic', 'SubScript', 'SuperScript', 'AutoTypeSet', 'BlockQuote', 'ClearDoc'],
                [
                    'ToUpperCase', 'ToLowerCase', 'DirectionalityLtr', 'DirectionalityRtl', '|', 'FontColor', 'BackColor', 'FontSize', 'FontFamily', 'Underline', 'StrikeThrough', '|', 'FormatMatch', 'Horizontal'],
                [
                    'ImageNone', 'ImageLeft', 'ImageRight', 'ImageCenter', 'InsertImage', '|', 'Paragraph', 'Indent', '|', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyJustify', '|', 'LineHeight', 'InsertOrderedList', 'InsertUnorderedList'],
                [
                    'Preview', 'Print', 'PastePlain', 'RemoveFormat', 'RowSpacingBottom', 'RowSpacingTop', '|', 'SelectAll'],
                [
                    'InsertTable', 'DeleteTable', 'InsertParagraphBeforeTable', 'InsertRow', 'DeleteRow', 'InsertCol', 'DeleteCol', '|', 'MergeCells', 'MergeRight', 'MergeDown', 'SplitToCells', 'SplitToRows', 'SplitToCols'
                ],
                ['example', 'dialog', 'links', 'photo', 'bdmap']
            ],
            shortcutMenu: ["fontfamily", "fontsize", "bold", "italic", "underline", "forecolor", "backcolor", "insertorderedlist", "insertunorderedlist"],
            // 自动高度，默认true
            autoHeightEnabled: false,
            //focus时自动清空初始化时的内容
            autoClearinitialContent: true,
            //关闭字数统计
            wordCount: true,
            //关闭elementPath
            elementPathEnabled: false,
            //默认的编辑区域高度
            initialFrameHeight: 300,
            initialFrameWidth: 800
            //更多其他参数，请参考ueditor.config.js中的配置项
        })
    });
});
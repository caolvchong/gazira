/**
 * User: caolvchong@gmail.com
 * Date: 9/4/13
 * Time: 8:43 PM
 */
define(function(require, exports, module) {
    require('./baidu');
    var UE = require('./editor');
    require('./dom');

    // core
    require('./core/browser');
    require('./core/utils');
    require('./core/EventBase');
    require('./core/dtd');
    require('./core/domUtils');
    require('./core/Range');
    require('./core/Selection');
    require('./core/Editor');
    require('./core/ajax');
    require('./core/node');

    // ui
    require('./ui/ui');
    require('./ui/uiutils');
    require('./ui/uibase');
    require('./ui/separator');
    require('./ui/mask');
    require('./ui/popup');
    require('./ui/colorpicker');
    require('./ui/tablepicker');
    require('./ui/stateful');
    require('./ui/button');
    require('./ui/splitbutton');
    require('./ui/colorbutton');
    require('./ui/tablebutton');
    require('./ui/autotypesetpicker');
    require('./ui/autotypesetbutton');
    require('./ui/cellalignpicker');
    require('./ui/pastepicker');
    require('./ui/toolbar');
    require('./ui/menu');
    require('./ui/combox');
    require('./ui/dialog');
    require('./ui/menubutton');
    require('./ui/editorui');
    require('./ui/editor');
    require('./ui/multiMenu');
    require('./ui/shortcutmenu');
    require('./ui/breakline');

    // plugin
    require('./plugins/autoheight'); // 自动高度
    require('./plugins/autolink'); // 自动感应连接
    require('./plugins/autotypeset'); // 自动排版: AutoTypeSet
    require('./plugins/basestyle'); // 加粗: Bold,斜体: Italic,上标: SubScript,下标: SuperScript
    require('./plugins/blockquote'); // 引用: BlockQuote
    require('./plugins/cleardoc'); // 清空: ClearDoc
    require('./plugins/contextmenu'); // 右键菜单
    require('./plugins/convertcase'); // 大小写转化: ToUpperCase,ToLowerCase
    require('./plugins/defaultfilter'); // 编辑器默认的过滤转换机制
    require('./plugins/directionality'); // 从左向右输入: DirectionalityLtr，从右向左输入: DirectionalityRtl
    require('./plugins/elementpath'); // 选区路径
    require('./plugins/undo'); // 撤销: Undo, 重做: Redo
    require('./plugins/enterkey'); // 设置回车标签p或br
    require('./plugins/fiximgclick'); // 修复chrome下图片不能点击的问题
    require('./plugins/font'); // 字体颜色: FontColor,背景色: BackColor,字号: FontSize,字体: FontFamily,下划线: Underline,删除线: StrikeThrough
    require('./plugins/formatmatch'); // 格式刷: FormatMatch
    require('./plugins/inserthtml'); // 插入HTML
    require('./plugins/horizontal'); // 分割线: Horizontal
    require('./plugins/image'); // 插入图片，操作图片的对齐方式
    require('./plugins/paragraph'); // 段落格式，插入'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' : Paragraph
    require('./plugins/indent'); // 首行缩进与取消: indent,outdent
    require('./plugins/justify'); // 居左对齐: JustifyLeft, 居中对齐: JustifyCenter, 居右对齐: JustifyRight, 两端对齐: JustifyJustify
    require('./plugins/keystrokes'); // 处理特殊键的兼容性问题
    require('./plugins/lineheight'); // 行间距: LineHeight
    require('./plugins/list'); // 有序列表: InsertOrderedList,无序列表: InsertUnorderedList
    require('./plugins/paste'); // 粘贴
    require('./plugins/preview'); // 预览: Preview
    require('./plugins/print'); // 打印: Print
    require('./plugins/puretxtpaste'); // 纯文本粘贴: PastePlain
    require('./plugins/removeformat'); // 纯文本粘贴: RemoveFormat
    require('./plugins/rowspacing'); // 段前距: RowSpacingBottom,  段后距: RowSpacingTop
    require('./plugins/selectall'); // 全选: SelectAll
    require('./plugins/shortcutmenu'); // 快捷菜单
    require('./plugins/source'); // 查看源码: Source
    require('./plugins/link'); // 插入链接
    // 表格
    // 插入表格: InsertTable , 删除表格: DeleteTable , 表格前插入一行: InsertParagraphBeforeTable , 插入行: InsertRow , 删除行: DeleteRow , 插入列: InsertCol ,
    // 删除列: DeleteCol , 合并单元格: MergeCells , 向右合并: MergeRight , 向下合并: MergeDown ,
    // 切分单元格: SplitToCells , 切分成行: SplitToRows , 切分成列: SplitToCols ,
    require('./plugins/table.core.js');
    require('./plugins/table.cmds.js');
    require('./plugins/table.action.js');
    require('./plugins/wordcount'); // 字数统计: wordcount


    // 插件机制
    require('./plugin');
    require('./myplugins/links/plugin');


    // lang
    require('./lang/zh-cn/zh-cn');

    window.UE = UE; // 必须暴露一个全局变量，由于初始化加载会使用到iframe来判断父窗口UE实例
    module.exports = UE;
});
/**
 * User: caolvchong@gmail.com
 * Date: 7/3/13
 * Time: 8:46 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Dialog = require('../../../../js/lib/cmp/dialog/dialog');
    var ConfirmBox = require('../../../../js/lib/cmp/dialog/confirm-box');
    require('../../../../js/lib/util/dom/easing');

    $(function() {
        $('#btn11').click(function() {
            ConfirmBox.alert();
        });
        $('#btn12').click(function() {
            var content = (function() {
                var arr = [];
                for(var i = 0; i < 30; i++) {
                    arr[i] = '<p>锄禾日当午' + i + '</p>';
                }
                return arr.join('');
            })();
            ConfirmBox.alert({
                title: '新标题',
                width: 500,
                height: 400,
                content: content
            });
        });
        $('#btn13').click(function() {
            ConfirmBox.alert({
                hasMask: false
            });
        });
        $('#btn14').click(function() {
            ConfirmBox.alert({
                closable: false
            });
        });
        //----------------------------------------
        $('#btn21').click(function() {
            new Dialog({
                title: '百度',
                width: 750,
                height: 550,
                content: 'http://www.baidu.com'
            }).after('hide',function() {
                    this.destroy();
                }).show();
        });
        $('#btn22').click(function() {
            new Dialog({
                title: '自适应高度',
                width: 750,
                height: null,
                content: './height.html'
            }).after('hide',function() {
                    this.destroy();
                }).show();
        });
        $('#btn23').click(function() {
            new Dialog({
                title: '自适应高度',
                width: 750,
                height: null,
                content: './height.html'
            }).after('hide',function() {
                    this.destroy();
                }).on('complete:show', function() {
                    alert('呵呵，载入完成了');
                }).show();
        });
        $('#btn24').click(function() {
            new Dialog({
                title: '框架内关闭',
                width: 750,
                height: null,
                content: './inner-close.html'
            }).after('hide',function() {
                    this.destroy();
                }).show();
        });
        //----------------------------------------
        var multiDialog = function(config) {
            var p = new Dialog(config).show().after('hide', function() {
                this.destroy();
            });
            config.callback && config.callback(p);
        };
        $('#btn31').click(function() {
            multiDialog({
                content: '<input id="and" type="button" value="再来一个弹窗"/>',
                callback: function() {
                    $('#and').click(function() {
                        multiDialog({
                            width: 350,
                            height: 450,
                            content: '<input id="and2" type="button" value="再来一个弹窗"/>',
                            callback: function() {
                                $('#and2').click(function() {
                                    ConfirmBox.alert({
                                        content: '哦也'
                                    });
                                });
                            }
                        });
                    });
                }
            });
        });
        $('#btn32').click(function() {
            ConfirmBox.alert({
                content: '<input id="other" type="button" value="再来一个弹窗"/>'
            });
            $('#other').click(function() {
                ConfirmBox.alert({
                    width: 350,
                    height: 450,
                    content: '<input id="other2" type="button" value="再来一个弹窗"/>'
                });

                $('#other2').click(function() {
                    ConfirmBox.alert({
                        width: 150,
                        height: 150,
                        content: ':-)'
                    });
                });
            });
        });
        //----------------------------------------
        $('#btn41').click(function() {
            ConfirmBox.alert({
                title: '最简单的alert',
                content: 'simple'
            });
        });
        $('#btn42').click(function() {
            ConfirmBox.alert({
                title: 'alert',
                content: 'hehe',
                buttons: [{
                    text: '自定义的按钮事件哦',
                    action: 'confirm'
                }]
            }).on('confirm', function() {
                    var that = this;
                    this.set('content', '呵呵呵呵，三秒后窗口关闭');
                    setTimeout(function() {
                        that.hide();
                    }, 3000);
                });
        });
        $('#btn43').click(function() {
            ConfirmBox.confirm({
                title: 'confirm',
                content: 'confirm'
            }).on('confirm', function() {
                    alert('confirm');
                    this.hide();
                });
        });
        $('#btn44').click(function() {
            ConfirmBox.confirm({
                title: 'confirm2',
                content: 'confirm2',
                buttons: [{
                    text: '呵呵',
                    action: 'confirm'
                }, {
                    text: '关闭啊'
                }]
            }).on('confirm', function() {
                    alert('confirm2');
                    this.hide();
                });
        });
        $('#btn45').click(function() {
            ConfirmBox.show({
                title: 'define',
                content: 'define',
                buttons: [{
                    text: 'hello',
                    action: 'hello'
                }, {
                    text: 'baby',
                    action: 'baby'
                }, {
                    text: 'close',
                    action: 'close',
                    focus: true
                }]
            }).on('hello', function() {
                    alert('hello');
                }).on('baby', function() {
                    alert('baby');
                });
        });
        //----------------------------------------
        $('#btn51').click(function() {
            ConfirmBox.alert({
                header: false,
                content: '没有header的弹出层'
            });
        });
        $('#btn52').click(function() {
            ConfirmBox.alert({
                footer: false,
                content: '没有footer的弹出层'
            });
        });
        //----------------------------------------
        $('#btn61').click(function() {
            new Dialog({
                hasMask: {
                    hideOnClick: true
                },
                content: '点击mask可以关闭哦',
                width: 500,
                height: 300
            }).show().after('hide', function() {
                this.destroy();
            });
        });
        $('#btn62').click(function() {
            ConfirmBox.alert({
                fixed: false,
                content: '不是fixed'
            });
        });
        //----------------------------------------
        $('#btn71').click(function() {
            new Dialog({
                content: 'fade',
                effect: function() {
                    this.element.fadeIn(750);
                },
                width: 500,
                height: 300
            }).show().after('hide', function() {
                    this.destroy();
                });
        });
        $('#btn72').click(function() {
            ConfirmBox.alert({
                effect: function() {
                    this.element.fadeIn(1750);
                },
                content: 'fade'
            });
        });
        $('#btn73').click(function() {
            ConfirmBox.alert({
                effect: function() {
                    this.element.css({
                        display: 'block',
                        top: 0
                    }).animate({
                        top: ($(window).height() - this.element.height()) / 2
                    }, 500, 'backIn');
                },
                content: '更多动画支持'
            });
        });
    });
});
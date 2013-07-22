/**
 * User: caolvchong@gmail.com
 * Date: 7/19/13
 * Time: 1:54 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Widget = require('../widget');
    var ajax = require('../../util/ajax');

    var undefined;
    var helper = {
        loading: function(item) {
            return '<option value="' + (item.value || 0) + '">' + (item.placeholder || 'loading...') + '</option>';
        }
    };
    var Cascade = Widget.extend({
        attrs: {
            data: [],
            template: '<div class="widget-cascade"></div>'
        },
        setup: function() {
            Cascade.superclass.setup.call(this);
            this.view();
            this.cascadeEvent();
        },
        _view: function() {
            var list = this.get('data');
            var html = [];
            for(var i = 0, len = list.length; i < len; i++) {
                var item = list[i];
                html[i] = '<select' + (item.name ? ' name="' + item.name + '"' : '') + '>' + helper.loading(item) + '</select>';
            }
            return html;
        },
        view: function() {
            var html = this._view();
            this.element.html(html.join(''));
            this.build();
            return this;
        },
        build: function() {
            this._getData(0);
            return this;
        },
        /**
         * 给某个select设置值
         * @param i
         * @private
         */
        _getData: function(index) {
            var that = this;
            var list = this.get('data');
            var item = list[index];
            if(item) {
                var data = item.data;
                var select = this.$('select').eq(index);
                if(typeof data === 'string') { // url，需要ajax请求
                    if(!this._xhr) {
                        this._xhr = ajax.single(this.cid);
                    }
                    var actions = this._xhr;
                    var obj = $.extend({
                        url: data
                    }, item.ajax);
                    obj.data = obj.data || {};
                    obj.data[item.field || this.get('field')] = this.$('select').eq(index - 1).val();
                    if(!obj.success) {
                        obj.success = function(data) {
                            var result = data[item.resultField || 'data'];
                            that._buildItem(result, index);
                            if(result && result.length > 0) {
                                that._getData(index + 1);
                            }
                        };
                    }
                    actions.abort();
                    actions.send(obj);
                } else { // 数组，静态数据
                    var selectData = this._getDataCore(index);
                    if(selectData) {
                        this._buildItem(selectData, index);
                        this._getData(index + 1);
                    }
                }
            }
        },
        /**
         * 获取下一个select需要的data(静态返回数组，ajax返回url)
         * @returns {*}
         * @private
         */
        _getDataCore: function(index) {
            var selectPrev = this.$('select:lt(' + index + ')');
            var arr = [];
            var data = this.get('data')[index];
            if(data) {
                selectPrev.each(function(i, v) {
                    arr.push(this.selectedIndex);
                });
                var temp = data.data;
                for(var i = 0, len = arr.length; i < len; i++) {
                    temp = temp[arr[i]];
                }
                return temp;
            }
            return false;
        },
        /**
         * 给某个select设置options
         * @param data
         */
        _buildItem: function(data, index) {
            var select = this.$('select').eq(index || 0);
            if(data && data.length) {
                var flagment = document.createDocumentFragment();
                for(var i = 0, len = data.length; i < len; i++) {
                    var item = data[i];
                    var option = new Option();
                    if(typeof item !== 'object') {
                        option.value = item;
                        option.text = item;
                    } else {
                        option.value = item.value;
                        option.text = item.text === undefined ? item.value : item.text;
                        if(item.selected) {
                            option.selected = true;
                        }
                    }
                    flagment.appendChild(option);
                }
                select.empty().show();
                select[0].appendChild(flagment);
            } else {
                select.hide();
            }
            return this;
        },
        cascadeEvent: function() {
            var that = this;
            var selectList = this.$('select');
            var len = selectList.length - 1;
            selectList.each(function(i, v) {
                if(i < len) {
                    $(v).change(function() {
                        that.$('select:gt(' + i + ')').each(function(j, v) {
                            $(v).html(helper.loading(that.get('data')[i]));
                        });
                        that._getData(i + 1);
                        return true;
                    });
                }
            });
            return this;
        }
    });

    module.exports = Cascade;
});
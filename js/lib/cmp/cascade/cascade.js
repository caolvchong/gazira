/**
 * User: caolvchong@gmail.com
 * Date: 7/19/13
 * Time: 1:54 PM
 */
define(function(require, exports, module) {
    var $ = require('$');
    var Widget = require('../widget');
    var ajax = require('../../util/ajax');

    var undef;
    var helper = {
        loading: function(item, key) {
            return '<option value="' + (item[key] || 0) + '">' + (item.placeholder || 'loading...') + '</option>';
        }
    };
    var Cascade = Widget.extend({
        attrs: {
            data: [],
            template: '<div class="widget-cascade"></div>',
            model: {
                val: 'value',
                text: 'text'
            }
        },
        setup: function() {
            Cascade.superclass.setup.call(this);
            this.view();
            this._cascadeEvent();
        },
        _view: function() {
            var list = this.get('data');
            var html = [];
            for(var i = 0, len = list.length; i < len; i++) {
                var item = list[i];
                html[i] = '<select' + (item.name ? ' name="' + item.name + '"' : '') + '>' + helper.loading(item, this.get('model').val) + '</select>';
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
                    }, item.ajax || this.get('ajax'));
                    var extData = item.extData || this.get('extData');
                    obj.data = obj.data || {};
                    obj.data[item.field || this.get('field')] = this.$('select').eq(index - 1).val();
                    if($.isFunction(extData)) {
                        var result = extData.call(this, this.$('select').eq(index - 1), obj.data, index);
                        obj.data = typeof result === 'object' ? $.extend(obj.data, result) : result;
                    }
                    if(!obj.success) {
                        obj.success = function(data) {
                            var resultField = item.resultField || that.get('resultField');
                            var result = $.isFunction(resultField) ? resultField.call(that, data, index) : data[resultField || 'data'];
                            that._buildItem(result, index);
                            if(result && result.length > 0) {
                                that._getData(index + 1);
                            }
                        };
                    } else {
                        var temp = obj.success;
                        obj.success = function(data) {
                            temp.call(that, data);
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
            var type = (function(option) {
                return option.innerText !== undef ? 'innerText' : 'text';
            })(new Option());
            var model = this.get('model');

            if(data && data.length) {
                var flagment = document.createDocumentFragment();
                for(var i = 0, len = data.length; i < len; i++) {
                    var item = data[i];
                    var option = new Option();
                    if(typeof item !== 'object') {
                        option.value = item;
                        option.text = item;
                    } else {
                        option.value = item[model.val];
                        option[type] = item[model.text] === undef ? item[model.val] : item[model.text];
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
        },
        _cascadeEvent: function() {
            var that = this;
            var selectList = this.$('select');
            var len = selectList.length - 1;
            selectList.each(function(i, v) {
                if(i < len) {
                    $(v).change(function() {
                        that.$('select:gt(' + i + ')').each(function(j, v) {
                            $(v).html(helper.loading(that.get('data')[i]), that.get('model').val);
                        });
                        that._getData(i + 1);
                        return true;
                    });
                }
            });
            return this;
        },
        /**
         * 获取某个select
         * @param which number则按顺序，从0开始；string为按name获取
         * @returns {*}
         */
        getItem: function(which) {
            var select;
            if(typeof which === 'number') {
                select = this.$('select').eq(which);
            } else {
                select = this.$('select[name=' + which + ']').eq(0);
            }
            return select;
        }
    });

    module.exports = Cascade;
});
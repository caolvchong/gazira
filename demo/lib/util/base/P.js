/**
 * User: caolvchong@gmail.com
 * Date: 7/1/13
 * Time: 1:45 PM
 */
define(function(require, exports, module) {
    var Base = require('../../../../js/lib/util/base');

    var P = Base.extend({
        say: function(word) {
            console.log(this.get('name'), word);
            this.trigger('say', word);
        },
        _onChangeAge: function(prev, now, type) {
            console.log('trigger age change event', prev, now);
        }
    });

    module.exports = P;
});
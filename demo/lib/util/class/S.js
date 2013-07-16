/**
 * User: caolvchong@gmail.com
 * Date: 7/1/13
 * Time: 1:46 PM
 */
define(function(require, exports, module) {
    var P = require('./P');

    var S = P.extend({
        initialize: function(name, age, sex) {
            S.superclass.initialize.apply(this, arguments);
            this.sex = sex;
        },
        introduce: function() {
            console.log('hello, my name is ' + this.name);
        },
        getAge: function(word) {
            S.superclass.getAge.call(this);
            console.log(word);
        }
    });

    module.exports = S;
});
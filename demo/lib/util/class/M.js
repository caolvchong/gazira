/**
 * User: caolvchong@gmail.com
 * Date: 7/1/13
 * Time: 1:54 PM
 */
define(function(require, exports, module) {
    var Class = require('../../../../js/lib/util/class');
    var P = require('./P');
    var S = require('./S');

    var M = Class.create({
        Implements: [P, S],
        initialize: function(name, age, sex) {
            this.name = name;
            this.age = age;
            this.sex = sex;
        },
        doing: function() {
            console.log('I am doing homework');
        }
    });

    module.exports = M;
});
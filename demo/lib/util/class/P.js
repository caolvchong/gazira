/**
 * User: caolvchong@gmail.com
 * Date: 7/1/13
 * Time: 1:45 PM
 */
define(function(require, exports, module) {
    var Class = require('../../../../js/lib/util/class');

    var P = Class.create({
        initialize: function(name, age) {
            this.name = name;
            this.age = age;
        },
        say: function() {
            console.log(this.name);
        },
        getAge: function() {
            console.log(this.age);
        }
    });

    module.exports = P;
});
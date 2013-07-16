/**
 * User: caolvchong@gmail.com
 * Date: 7/1/13
 * Time: 1:42 PM
 */
define(function(require, exports, module) {
    var Class = require('../../../../js/lib/util/class');
    var event = require('../../../../js/lib/util/event');

    var F = Class.create({
        initialize: function(name) {
            this.name = name;
        },
        say: function() {
            this.trigger('say');
            console.log('hello, my name is ' + this.name);
        }
    });

    event.mixTo(F);

    var f = new F('Tom');
    f.on('say', function() {
        console.log('say event trigger');
    });

    f.say();
});
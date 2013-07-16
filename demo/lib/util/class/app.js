/**
 * User: caolvchong@gmail.com
 * Date: 7/1/13
 * Time: 1:42 PM
 */
define(function(require, exports, module) {
    var P = require('./P');
    var S = require('./S');
    var M = require('./M');

    var p1 = new P('Tom', 27);
    p1.say();
    console.log('---------------');

    var s1 = new S('Jerry', 23, 'F');
    s1.introduce();
    s1.say(':-)');
    s1.getAge('hehe');
    console.log('---------------');

    var m1 = new M('Lucy', 33, 'M');
    m1.introduce();
    m1.say('popo...');
    m1.getAge('haha');
    console.log('---------------');
});
/**
 * User: caolvchong@gmail.com
 * Date: 7/3/13
 * Time: 8:46 PM
 */
define(function(require, exports, module) {
    var P = require('./P');

    var p1 = new P({
        name: 'Tom',
        age: 25,
        beforeSay: function(word) {
            console.log('before say', word);
        },
        onSay: function(word) {
            console.log('on say', word);
        },
        afterSay: function(result, word) {
            console.log('after say', word);
        }
    });
    p1.on('say', function(word) {
        console.log('on say 2 ', word);
    });
    p1.say('hello');
    p1.set('age', 22);

    console.log(p1);
});
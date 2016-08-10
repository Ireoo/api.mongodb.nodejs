/**
 * Created by S2 on 2015/12/17.
 */

var assert = require("assert");
describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        })
    })
});
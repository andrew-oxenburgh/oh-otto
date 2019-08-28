'use strict';

var should = require('should');
var Chance = require('chance');

var hashCode = require('../../../public/js/ob-testable').testable().hashCode;

describe('hashCode behaves reasonabley', function() {
   var checkHashIsPositiveGT0 = function(val) {
      var res = hashCode(val);
      should.exist(res);
      res.should.be.a.Number().above(0);
      Number.isInteger(res).should.be.True();
   };
   it('string', function() {
      checkHashIsPositiveGT0('string');
   });
   it('null', function() {
      checkHashIsPositiveGT0(null);
   });
   it('undefined', function() {
      checkHashIsPositiveGT0(undefined);
   });
   it('number', function() {
      checkHashIsPositiveGT0(12345);
   });
   it('negative number', function() {
      checkHashIsPositiveGT0(-1);
   });
   it('zero', function() {
      checkHashIsPositiveGT0(0);
   });
   it('empty string', function() {
      checkHashIsPositiveGT0('');
   });
   it('a bunch of strings of various lengths', function() {
      var random = new Chance();
      for (var i = 1 ; i <= 30 ; i ++) {
         for (var j = 0 ; j < 10 ; j ++) {
            var str = random.word({length: (i * 10)});
            checkHashIsPositiveGT0(str);
         }
      }
   });
});


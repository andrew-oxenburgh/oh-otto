'use strict';

/*jshint mocha:true, node:true*/

var diff = require('../src/diff');

var _ = require('lodash');
var should = require('should');

var assertEquality = function(df) {
   if (df === true) {
      return;
   }
   var res = _.keys(df).length === 0;
   res.should.be.True(df);
};

var assertInequality = function(df) {
   if (df === false) {
      return;
   }
   var res = _.keys(df).length === 0;
   res.should.be.False(df);
};

describe('#js diff test', function() {
   it('minimal equality', function() {

      assertEquality(diff({}, {}));
      assertEquality(diff(null, null));
      assertEquality(diff({}, null));
      assertEquality(diff(null, {}));
      assertEquality(diff({a: 1}, {a: 1}));
      assertEquality(diff({a: 1, b: 3}, {a: 1, b: 3}));
      assertEquality(diff({a: 1, b: null}, {a: 1, b: []}));
      assertEquality(diff({a: 1, b: []}, {a: 1, b: []}));
      assertEquality(diff({a: 1, b: [1]}, {a: 1, b: [1]}));
      assertEquality(diff({_id: 1}, {_id: 1}));
      assertEquality(diff({_id: 'a'}, {_id: 'a'}));
      assertEquality(diff({_id: 'b'}, {_id: 'b'}));
      assertEquality(diff({_id: 'b'}, {_id: 'b'}));

   });

   it('minimal inequality', function() {
      assertInequality(diff({a: 1}, {a: 1, b: 1}));
      assertInequality(diff({a: 1, b: 1}, {a: 1}));
      assertInequality(diff({b: 1}, {a: 1}));
      assertInequality(diff({b: null}, {b: 1}));
      assertInequality(diff({b: 1}, {b: null}));
      assertInequality(diff({b: [2]}, {b: [1]}));
      assertInequality(diff({b: [2]}, {b: [1]}));
   });

   it('equality ignores order', function() {
      assertEquality(diff({a: 1, b: 2}, {b: 2, a: 1}));
   });

   it('equality includes sub-objects', function() {
      assertEquality(diff({b: 1}, {b: 1}));
      assertEquality(diff({b: 1, c: {}}, {b: 1, c: {}}));
      assertEquality(diff({a: 1, b: {c: 1}}, {a: 1, b: {c: 1}}));
   });

   it('use ===', function() {
      assertInequality(diff({b: 1}, {b: '1'}));
   });

   it('includes empty objects in comparison', function() {
      assertInequality(diff({}, {sub: {}}));
   });

   it('ignores named properties', function() {
      assertEquality(diff({b: 1, ignore: 3}, {b: 1}, ['ignore']));
      assertEquality(diff({b: 1}, {b: 1, ignore: 3}, ['ignore']));
      assertEquality(diff({b: 1, sub: {c: 1}}, {b: 1, sub: {c: 1, ignore: 4}}, ['ignore']));
      assertEquality(diff({b: 1, ignore: 3}, {b: 1, andme: 6}, ['ignore', 'andme']));
   });

   it('handles arrays', function() {
      assertEquality(diff({b: []}, {b: []}));
      assertEquality(diff({b: [1]}, {b: [1]}));
      assertInequality(diff({b: ['a']}, {b: [1]}));
   });

   it('handles arrays of objects', function() {
      assertEquality(diff({b: [{}]}, {b: [{}]}));
      assertEquality(diff({b: [{a: 1}]}, {b: [{a: 1}]}));
      assertInequality(diff({b: [{a: 1}]}, {b: [{a: 2}]}));
      assertEquality(diff({b: [{a: ''}]}, {b: [{a: ''}]}));
   });

   var strAndObj = function(var2) {
      return JSON.parse(JSON.stringify(var2, null, 2));
   };

   it('realistic test', function() {
      var var1 = {
         '_id': '56c38b7d084edc200b0eb3f7',
         'name': 'board1',
         'cards': [
                {
                   '_id': '56c38b7d084edc200b0eb3f8',
                   'content': 'i am what i am'
                }
            ]
      };

      var var2 = {
         _id: '56c38b7d084edc200b0eb3f7',
         name: 'board1',
         cards: [
                {
                   _id: '56c38b7d084edc200b0eb3f8',
                   content: 'i am what i am'
                }
            ]
      };

      assertEquality(diff(var1, var2, ['__v']));
      assertEquality(diff(var2, var1, ['__v']));
      assertEquality(diff(strAndObj(var2), var1, ['__v']));
      assertEquality(diff(var2, strAndObj(var1), ['__v']));
      assertEquality(diff(var1, strAndObj(var1), ['__v']));
      assertEquality(diff(var2, strAndObj(var2), ['__v']));
   });

});


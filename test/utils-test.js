'use strict';

var should = require('should');
var _ = require('lodash');
var store = require('../src/server/store');

var diff = require('@andrew.oxenburgh/find-largest-icon').diff;

var assert = require('assert');

var testUtils = require('./utils');

describe('inner test - id checks', function() {
   it('#hasId - pass - string, right length', function() {
      var objWithValidId = {_id: testUtils.validObjId};
      testUtils.hasId(objWithValidId);
   });
   it('#hasId - fail - string, wrong length', function() {
      (function() {
         var objWithInvalidId = {_id: '1'};
         testUtils.hasId(objWithInvalidId);
      }).should.throw(/expected .* to match/);
   });
   it('#hasId - fail - string, wrong type', function() {
      (function() {
         var objWithInvalidId = {_id: 1};
         testUtils.hasId(objWithInvalidId);
      }).should.throw(/expected .* to be a string/);
   });

   it('#hasId - fail - empty id', function() {
      (function() {
         var objWithInvalidId = {_id: ''};
         testUtils.hasId(objWithInvalidId);
      }).should.throw(/to match/);
   });

   it('#isId - pass - string, right length', function() {
      testUtils.isId('000000000000000000000000');
   });

   it('#isId - fail - not string, object', function() {
      (function() {
         testUtils.isId({x: 'a'});
      }).should.throw(/expected .* to be a string/);
   });
   it('#isId - fail - not string, array', function() {
      (function() {
         testUtils.isId([]);
      }).should.throw(/expected .* to be a string/);
   });
   it('#isId - fail - not string, null', function() {
      (function() {
         testUtils.isId(null);
      }).should.throw(/null id/);
   });
   it('#isId - fail - not string, undefined', function() {
      (function() {
         testUtils.isId(undefined);
      }).should.throw(/null id/);
   });
   it('#isId - fail - not string, no args', function() {
      (function() {
         testUtils.isId();
      }).should.throw(/null id/);
   });
});

describe('#looksLike', function() {
   it('##minimal equality', function() {
      testUtils.mongooseLooksRight({}, {});
      testUtils.mongooseLooksRight({a: 1}, {a: 1});
   });

   it('minimal inequality', function() {
      (function() {
         testUtils.mongooseLooksRight({a: 1}, {});
      }.should.throw());
      (function() {
         testUtils.mongooseLooksRight({a: 1}, {a: 2});
      }.should.throw());
      (function() {
         testUtils.mongooseLooksRight({a: 1}, {b: 1});
      }.should.throw());
      (function() {
         testUtils.mongooseLooksRight(null, {b: 1});
      }.should.throw());
      (function() {
         testUtils.mongooseLooksRight({a: 1}, null);
      }.should.throw());
      (function() {
         testUtils.mongooseLooksRight({_id: 'fff'}, {});
      }.should.throw());
   });

   it('an empty card list is also null', function() {
      testUtils.mongooseLooksRight({a: null}, {a: null});
   });

   it('__v is ignored at both ends', function() {
      testUtils.mongooseLooksRight({__v: '100'}, {__v: 200});
      testUtils.mongooseLooksRight({}, {__v: 200});
      testUtils.mongooseLooksRight({__v: '100'}, {});
   });

   it('__v is ignored in subobjects', function() {
      testUtils.mongooseLooksRight(
          {a: {__v: '100'}},
          {a: {__v: 200}});
      testUtils.mongooseLooksRight(
          {a: {}},
          {a: {__v: 200}});
      testUtils.mongooseLooksRight(
          {a: {__v: '100'}},
          {a: {}});
   });

   it('if there is an expected._id, it must exactly match the actual._id', function() {
      testUtils.mongooseLooksRight({}, {_id: testUtils.validObjId});
      testUtils.mongooseLooksRight({_id: testUtils.validObjId}, {_id: testUtils.validObjId});
      (function() {
         testUtils.mongooseLooksRight({_id: testUtils.validObjId}, {});
      }.should.throw());
      (function() {
         testUtils.mongooseLooksRight({_id: '12345'}, {_id: testUtils.validObjId});
      }.should.throw());
   });

   it('if there is an actual._id, it must be a valid id', function() {
      testUtils.mongooseLooksRight({}, {_id: testUtils.validObjId});
      (function() {
         testUtils.mongooseLooksRight({}, {_id: 'invalid id'});
      }.should.throw());

   });

   it('test with realistic data', function() {
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
      testUtils.mongooseLooksRight(var1, var2);
      testUtils.mongooseLooksRight(var2, var1);

   });

});


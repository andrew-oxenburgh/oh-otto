'use strict';

module.exports = (function() {
   var should = require('should');
   var _ = require('lodash');
   var store = require('../src/server/store');

   var diff = require('@andrew.oxenburgh/find-largest-icon').diff;

   var assert = require('assert');

   var isId = function(obj) {
      if (obj === null || typeof obj === 'undefined') {
         should.fail('null id', obj);
         return;
      }
      obj.should.be.a.String();
      obj.should.match(objIdPattern);
      return;
   };

   var hasId = function(obj) {
      if (!obj || obj._id === null || typeof obj._id === 'undefined') {
         should.fail('no _id', obj);
         return;
      }
      isId(obj._id);
      return;
   };

   var objIdPattern = /[a-z0-9]{24}/;

   var validObjId = '000000000000000000000000';

   var boardTemplate_tmp = {
      name: 'board1',
      background: 'red'
   };

   var boardTemplate = function() {
      return _.cloneDeep(boardTemplate_tmp);
   };

   var addUserAndrew = store.user.add.bind(this, {udoc: {name: 'andrew'}});

   var checkErrorMessage = function(res, expectedMessage, expectedStatus) {
      should(res).not.be.Null(res);
      should(res.error).not.be.Null(res);
      res.error.message.should.equal(expectedMessage);
      res.error.status.should.equal(expectedStatus);
   };

   /**
    * Checks that the expected is a lot like the actual, with
    * the following caveats.
    * <ul>
    *  <li> __v is ignored. mongoose only
    *  <li> if there is an expected._id, it must exactly match actual._id.
    *  <li> if there is an actual._id, it must be a valid mongoose id.
    * </ul>
    *
    * @function
    * @param {Object} expected
    * @param {Object} actual
    * @throws {AssertionError}
    */

   var looksLike = function(expected, actual) {
      assert(expected);
      assert(actual);
      if (typeof actual._id !== 'undefined') {
         isId(actual._id);
      }
      var d = diff(actual, expected, ['__v']);
      if (d === false) {
         return;
      }
      if (d.__v) {
         delete d.__v;
      }

      if (d._id && typeof expected._id === 'undefined') {
         delete d._id;
      }

      if (d.cards && !d.cards.from.toString() && !d.cards.to) {
         delete d.cards;
      }

      _.keys(d).length.should.equal(0,
          JSON.stringify(d, null, 2));
   };

   var expectArrayContainsPropsWithName = function(usrBrds, propName, expectedArray) {
      _(usrBrds)
          .map(propName)
          .orderBy(propName)
          .value().join(',')
          .should.equal(expectedArray.join(','));
   };

   return {
      isId: isId,
      hasId: hasId,
      checkErrorMessage: checkErrorMessage,
      addUserAndrew: addUserAndrew,
      boardTemplate: boardTemplate,
      objIdPattern: objIdPattern,
      validObjId: validObjId,
      mongooseLooksRight: looksLike,
      expectArrayContainsPropsWithName: expectArrayContainsPropsWithName
   };

})();


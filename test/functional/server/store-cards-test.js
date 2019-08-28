'use strict';

/* globals describe, it, addUserAndrew, boardTemplate, objIdPattern, isId, hasId */

var should = require('should');
var Promise = require('bluebird');
var _ = require('lodash');
var store = require('../../../src/server/store');

var testUtils = require('../../utils');
var isId = testUtils.isId;
var hasId = testUtils.hasId;
var objIdPattern = testUtils.objIdPattern;
var addUserAndrew = testUtils.addUserAndrew;
var checkErrorMessage = testUtils.checkErrorMessage;
var boardTemplate = testUtils.boardTemplate;

describe('#store.cards', function() {
   var options = {};
   beforeEach(function(done) {
      options = {};
      store.test.knockdown()
            .then(function() {
               return addUserAndrew.call();
            })
            .then(function(uid) {
               isId(uid);
               options.uid = uid;
               return store.board.add({uid: options.uid, bdoc: {name: 'board with user'}});
            })
            .then(function(bid) {
               isId(bid);
               options.bid = bid;
               done();
            });
      // added user and board
   });

   it('#cardRead - nonsense parameters', function(done) {
      var p1 = store.card.read({});
      var p2 = store.card.read('not an object');
      var p3 = store.card.read({uid: 'lhljksdflkjfdlksjlds', bid: 'lkjsdlfkjldsfkjkljsdf'});
      Promise.all([p1, p2, p3])
            .then(function(res) {
               _.each(res, function(r) {
                  checkErrorMessage(r, 'unauthorised', 403);
               });
               done();
            });
   });

   it('#cardUpdate - save and update a card', function(done) {
      var result = {};
      options.cdoc = {content: 'initial'};
      store.card.add(options)
            .then(function(cid) {
               isId(cid);
               options.cid = cid;
               result.cid = cid;
               options.cdoc = {content: 'new content'};
               return store.card.update(options);
            })
            .then(function(cid) {
               result.cid.should.equal(cid);
               return store.card.read(options);
            })
            .then(function(cdoc) {
               should(cdoc).not.be.Null();
               testUtils.mongooseLooksRight(options.cdoc, cdoc);
               done();
            });
   });

   it('#cardRemove - save and remove a card', function(done) {
      var result = {};
      options.cdoc = {content: 'initial'};
      store.card.add(options)
            .then(function(cid) {
               isId(cid);
               options.cid = cid;
               result.cid = cid;
               return store.card.remove(options);
            })
            .then(function(cid) {
               result.cid.should.equal(cid);
               return store.card.read(options);
            })
            .then(function(cdoc) {
               should(cdoc).be.Null();
               done();
            });
   });

   it('#cardSave - save 1 card on a board and read it back', function(done) {
      options.cdoc = {
         content: 'here be me',
         extent: {
            top: 1,
            bottom: 2,
            left: 3,
            right: 4
         }
      };
      var iniCid;
      store.card.add(options)
            .then(function(cid) {
               isId(cid);
               options.cid = cid;
               return store.card.read(options);
            })
            .then(function(savedCard) {
               // saved card
               hasId(savedCard);
               testUtils.mongooseLooksRight(options.cdoc, savedCard);

               options.cdoc.content = 'there be you';

               iniCid = options.cid = savedCard._id;
               return store.card.add(options);
            })
            .then(function(cid) {
               isId(cid);
               return store.card.read(options);
            })
            .then(function(updatedCard) {
               hasId(updatedCard);
               testUtils.mongooseLooksRight(options.cdoc, updatedCard);
            })
            .then(function() {
               return store.board.read({uid: options.uid, bid: options.bid});
            })
            .then(function(bdoc) {
               testUtils.mongooseLooksRight(
                    {
                       _id: options.bid,
                       name: 'board with user',
                       cards: [{
                          _id: iniCid,
                          content: 'there be you',
                          extent: {
                             top: 1,
                             bottom: 2,
                             left: 3,
                             right: 4
                          }
                       }]
                    }, bdoc);
               done();
            });
   });
});

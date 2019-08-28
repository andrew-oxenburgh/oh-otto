'use strict';

// jscs:disable maximumLineLength

/* globals describe, it, addUserAndrew, boardTemplate, objIdPattern, isId, hasId, checkErrorMessage */

var should = require('should');
var HttpStatus = require('http-status-codes');
var debug = require('debug')('persistence-test');
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

describe('#store.boards', function() {

   beforeEach(function(done) {
      store.test.knockdown()
            .then(function() {
               done();
            });
   });

   it('#boardSave - save and read from same user', function(done) {
      var expBrd = boardTemplate();
      var result = {};
      addUserAndrew.call()
            .then(function(uid) {
               isId(uid);
               result.ownerId = uid;
               return store.board.add({uid: uid, bdoc: expBrd});
            })
            .then(function(bid) {
               isId(bid);
               return store.board.read({uid: result.ownerId, bid: bid});
            })
            .then(function(res) {
               testUtils.mongooseLooksRight(expBrd, res);
               done();
            });
   });

   it('#boardSave - save and resave board', function(done) {
      var initName = 'old name';
      var initBackground = 'violet';
      var updatedName = 'new name';
      var updatedBackground = 'urple';

      var initBrd = boardTemplate();
      initBrd.name = initName;
      initBrd.background = initBackground;

      var updatedBrd = boardTemplate();
      updatedBrd.name = updatedName;
      updatedBrd.background = updatedBackground;

      var result = {};
      addUserAndrew.call()
          //owner created
            .then(function(uid) {
               result.uid = uid;
               isId(uid);
               return store.board.add({uid: result.uid, bdoc: initBrd});
               // board created
            })
            .then(function(bid) {
               result.bid = bid;
               isId(bid);
               return store.board.read({uid: result.uid, bid: result.bid});
               // check read board
            })
            .then(function(board) {
               testUtils.mongooseLooksRight(initBrd, board);
               return store.board.update({uid: result.uid, bdoc: updatedBrd, bid: result.bid});
               // board updated
            })
            .then(function(bid) {
               isId(bid);
               result.bid.should.equal(bid);
               // read board
               return store.board.read({uid: result.uid, bid: result.bid});
            })
            .then(function(board) {
               // check updated board
               hasId(board);
               board.name.should.equal(updatedName, board);
               board.background.should.equal(updatedBackground, board);
               done();
            });
   });

   it('#boardSave - no save and read from different users', function(done) {
      var expBrd = boardTemplate();
      var result = {};
      addUserAndrew.call()
            .then(function(uid) {
               isId(uid);
               result.ownerId = uid;
               return store.user.add({udoc: {name: 'steven'}});
            })
            .then(function(uid) {
               isId(uid);
               result.nonOwnerId = uid;
               return store.board.add({uid: result.ownerId, bdoc: expBrd});
            })
            .then(function(bid) {
               isId(bid);
               return Promise.all(
                   [
                       store.board.read({uid: result.nonOwnerId, bid: bid}),
                       store.board.read({uid: result.ownerId, bid: bid})
                   ]);
            })
            .then(function(res) {
               var nonOwnerRes = res[0];
               var ownerRes = res[1];

               testUtils.mongooseLooksRight(expBrd, ownerRes);
               // testUtils.looksLike({error: {message: 'unauthorised', status: 403}}, nonOwnerRes);
               done();
            }
        );
   });

   it('#boardSave - no save and resave from different users', function(done) {
      var expBrd = boardTemplate();
      var newBrd = {
         name: 'new',
         background: 'yellow'
      };
      var result = {};
      addUserAndrew.call()
          // create user andrew
            .then(function(uid) {
               isId(uid);
               result.ownerId = uid;
               uid.should.be.a.String();
               // create user steven
               return store.user.add({udoc: {name: 'steven'}});
            })
            .then(function(uid) {
               isId(uid);
               result.nonOwnerId = uid;
               uid.should.be.a.String();
               // save board to andrew
               return store.board.add({uid: result.ownerId, bdoc: expBrd});
            })
            .then(function(bid) {
               isId(bid);
               result.bid = bid;
               bid.should.be.a.String();
               bid.should.match(objIdPattern);
               return Promise.all(
                   [
                       // try and save from steven
                       store.board.update({uid: result.nonOwnerId, bdoc: newBrd, bid: result.bid}),
                       // save from andrew
                       store.board.update({uid: result.ownerId, bdoc: newBrd, bid: result.bid})
                   ]);
            })
            .then(function(uid) {
               var nonOwnerRes = uid[0];
               nonOwnerRes.error.message.should.equal('unauthorised');

               var ownerRes = uid[1];
               ownerRes.should.equal(result.bid);
               isId(ownerRes);

               done();
            }
        );
   });

   it('#boardSave - save 2 boards and read 2 boards', function(done) {
      var expBrd1 = boardTemplate();
      var expBrd2 = boardTemplate();

      expBrd1.name = 'board 1';
      expBrd2.name = 'board 2';

      var result = {};

      addUserAndrew.call()
            .then(function(uid) {
               result.ownerId = uid;
               uid.should.be.a.String();
               return Promise.all([
                   store.board.add({uid: uid, bdoc: expBrd1}),
                   store.board.add({uid: uid, bdoc: expBrd2})]);
            })
            .then(function(res) {
               isId(res[0]);
               isId(res[1]);
               var read1 = store.board.read({uid: result.ownerId, bid: res[0]});
               var read2 = store.board.read({uid: result.ownerId, bid: res[1]});
               return Promise.all([read1, read2]);
            }).then(
            function(res) {
               var rd1 = res[0];
               var rd2 = res[1];

               hasId(rd1);
               hasId(rd2);

               rd1.name.should.equal(expBrd1.name);
               rd2.name.should.equal(expBrd2.name);
               done();
            });
   });

   it('#boardRemove - owner can remove a board - should be removed form owners list of boards', function(done) {
      var options = {udoc: {name: 'andrew'}};
      addUserAndrew.call()
            .then(function(uid) {
               options.uid = uid;
               isId(uid);
               options.bid = {name: 'name'};
               return store.board.add(options);
            })
            .then(function(bid) {
               options.bid = bid;
               isId(bid);
               return store.user.read(options);
            })
            .then(function(udoc) {
               should(udoc).not.be.Null();
               udoc.boards.should.containEql(options.bid);
               hasId(udoc);
               return store.board.remove(options);
            })
            .then(function(res) {
               isId(res);
               options.bid.should.equal(res);
               return store.user.read(options);
            })
            .then(function(udoc) {
               should(udoc).not.be.Null();
               udoc.boards.should.not.containEql(options.bid);
               hasId(udoc);
               return store.board.remove(options);
            })
            .then(function(bid) {
               checkErrorMessage(bid, 'unauthorised', 403);
               done();
            })
        ;
   });

   it('#boardRemove - non owner cant remove a board', function(done) {
      var result = {};
      addUserAndrew.call()
            .then(function(uid) {
               result.ownerId = uid;
               isId(uid);
               return store.user.add({udoc: {name: 'steven'}});
            })
            .then(function(uid) {
               result.nonOwnerId = uid;
               isId(uid);
               return store.board.add({uid: result.ownerId, bdoc: {name: 'name'}});
            })
            .then(function(bid) {
               result.bid = bid;
               isId(bid);
               return store.board.remove({uid: result.nonOwnerId, bid: bid});
            })
            .then(function(res) {
               // non owner cant remove board
               checkErrorMessage(res, 'unauthorised', 403);
               return store.board.remove({uid: result.ownerId, bid: result.bid});
            })
            .then(function(bid) {
               // ownner can remove
               isId(bid);
               result.bid.should.equal(bid);
               done();
            })
        ;
   });
});

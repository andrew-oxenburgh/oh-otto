'use strict';

/* globals describe, it */

var should = require('should');
var HttpStatus = require('http-status-codes');
var debug = require('debug')('persistence-test');
var Promise = require('bluebird');
var _ = require('lodash');
var store = require('../../../src/server/store');

describe('#store.*', function() {
   beforeEach(function(done) {
      store.test.knockdown()
            .then(function() {
               done();
            });
   });

   it('rrrr', function(done) {
      store.user.add({udoc: {name: 'steven'}})
            .then(function(uid) {
               done();
            });
   });

   it('test 1', function(done) {
      var result = {};
      store.user
          .add({udoc: {name: 'andrew'}})
          // added user
            .then(function(uid) {
               result.uid = uid;
               return store.board.add({uid: result.uid, bdoc: {name: 'aggy'}});
            })
            // added board
            .then(function(bid) {
               result.bid = bid;
               return store.user.board({uid: result.uid});
            })
            // boards are there
            .then(function(brds) {
               result.board = brds;
               return store.board.read({uid: result.uid, bid: brds[0]});
            })
            // board looks right
            .then(function(brd) {
               brd.name.should.equal('aggy');
               brd._id.should.equal(result.board[0]._id);
               return store.card.add({uid: result.uid, bid: result.bid, cdoc: {content: 'card1'}});
            })
            // saved a card
            .then(function(cid) {
               result.cid1 = cid;
               return store.card.add({uid: result.uid, bid: result.bid, cdoc: {content: 'card2'}});
            })
            .then(function(cid) {
               result.cid2 = cid;
               return store.card.add({uid: result.uid, bid: result.bid, cdoc: {content: 'card3'}});
            })
            .then(function(cid) {
               result.cid3 = cid;
               return store.board.read({uid: result.uid, bid: result.bid});
            })
            .then(function(board) {
               should.exist(board);
               should.exist(board.cards);
               board.cards.length.should.equal(3);

               var res = _.map(board.cards, 'content');
               res = _.union(res);
               res.should.deepEqual(['card1', 'card2', 'card3']);
            })
            .then(function() {
               done();
            })
        ;
   });
});

'use strict';

var should = require('should');

var proxyquire = require('proxyquire').noCallThru();
var MockExpressRequest = require('mock-express-request');
var MockExpressResponse = require('mock-express-response');
var mongoMock = require('mongo-mock');
var HttpStatus = require('http-status-codes');
var debug = require('debug')('persistence-test');
var Promise = require('node-promise');
var _ = require('lodash');
var persistence;

describe('persistence - ', function() {
   var req;
   var res;

   before(function(done) {
      mongoMock.max_delay = 0;
      persistence = proxyquire('../../../src/server/persistence', {'mongodb': mongoMock});
      persistence.init(function() {
        });
      done();
   });

   beforeEach(function(done) {
      res = new MockExpressResponse({});
      req = new MockExpressRequest({
         //url: '/board/1234',
         //method: 'POST',
         cookies: {user_id: 'andrew', userProfile: JSON.stringify({user_id: 'andrew'})},
         params: {name: '1234'},
         body: 'thing'
      });

      req.cookies = {user_id: 'andrew', userProfile: JSON.stringify({user_id: 'andrew'})};

      if (persistence && persistence.usersCollection() && persistence.boardsCollection()) {
         persistence.usersCollection().remove();
         persistence.boardsCollection().remove();
      }
      done();
   });

   var responseShouldContain = function(expectedBoard) {
      var actualBoard;

      should.exist(req);
      should.exist(res);

      res.statusCode.should.equal(HttpStatus.OK);

      actualBoard = res._getJSON();
      should.exist(actualBoard);
      actualBoard.should.be.ok();
      actualBoard.should.deepEqual(expectedBoard);
   };

   describe('read users current board', function() {
      it('if no board in profile, should return default board', function(done) {
         var runTest = function() {
            persistence.readCurrentBoardForUser(req, res).then(function() {
               responseShouldContain(persistence.defaultBoard());
               done();
            });
         };

         var profileWithoutBoards = _.cloneDeep(userProfile).boards = [];
         persistence.usersCollection().insert(profileWithoutBoards, runTest);
      });

      it(' - read board saved in user profile', function(done) {
         var runTest = function() {
            persistence.readCurrentBoardForUser(req, res).then(function() {
               responseShouldContain(board);
               done();
            }
        );
         };
         persistence.usersCollection().remove({}, {}, function(err, res) {
            persistence.usersCollection().insert(userProfile, runTest);
         });
      });
   });

   describe('write a board - ', function() {
      it('no user profile - fail', function(done) {
         delete req.cookies.userProfile;
         persistence.writeNamedBoardForUser(req, res);
         res.statusCode.should.equal(HttpStatus.UNAUTHORIZED);
         done();
      });

      it('no user id - fail', function(done) {
         req.cookies.userProfile = '{}';
         persistence.writeNamedBoardForUser(req, res).then(
                function() {
                   res.statusCode.should.equal(HttpStatus.UNAUTHORIZED);
                   persistence.usersCollection().findOne({_id: 'user_id'}, function(err, doc) {
                      should.not.exist(err);
                      should.not.exist(doc);
                      done();
                   });
                });
      });

      it('no body - fail', function(done) {
         delete req.body;
         persistence.writeNamedBoardForUser(req, res);
         res.statusCode.should.equal(HttpStatus.BAD_REQUEST);
         done();
      });

      it('user id, user profile, body - pass', function(done) {
         persistence.usersCollection().save = persistence.usersCollection().insert;

         persistence.writeNamedBoardForUser(req, res).then(
                function() {
                   res.statusCode.should.equal(HttpStatus.CREATED);
                   persistence.usersCollection().findOne({_id: 'andrew'}, function(err, doc) {

                      should.not.exist(err);
                      should.exist(doc);
                      doc.should.be.ok();

                      doc.should.not.equal(null);
                      doc.boards['1234'].should.equal('thing');
                      done();
                   });
                });
      });
   });
});
// todo:retreive
// todo:break up into parts

var board = {
   '_id': '1234',
   'name': 'board 1',
   'background': 'color-blanchedalmond',
   'cards': [
        {
           'name': 'card-82856',
           'content': 'title\n\ncontent',
           'extent': {
              'left': 35,
              'top': 201,
              'height': 128,
              'width': 240
           }, 'style': {
              'name': 'plain',
              'css': ''
           }
        }
    ],
   'extent': {
      'left': 3,
      'top': 3,
      'height': 601,
      'width': 801
   },
   'zoomedBy': 1
};

var userProfile = {
   '_id': 'andrew',
   'currentBoard': 'board1',
   'boards': {
      'board1': board
   }
};

describe('find duplicate', function() {

   before(function() {
      persistence = proxyquire('../../../src/server/persistence', {'mongodb': mongoMock});
      persistence.init(function() {
        });
   });

   var duplicated = function(content, cards) {
      isThereADuplicate(content, cards, true);
   };
   var notDuplicated = function(content, cards) {
      isThereADuplicate(content, cards, false);
   };
   var isThereADuplicate = function(content, cards, expected) {
      var found = persistence.duplicated(content, cards);
      found.should.equal(expected);
   };
   it('find content', function() {
      duplicated('thing', [{content: 'thing'}]);
      duplicated('r', [{content: 'r'}]);
      duplicated('r', [{content: 'r'}, {}]);
      duplicated('r', [{}, {content: 'r'}, {}]);
      duplicated('r', [{content: 'j'}, {content: 'r'}, {content: 'l'}]);
      duplicated('r', [{content: 'j'}, {content: 'l'}, {content: 'r'}]);
   });
   it('dont find content', function() {
      notDuplicated('w', [{content: 'x'}]);
      notDuplicated('w', [{content: 'x'}, {}]);
      notDuplicated('w', [{}, {content: 'x'}, {}]);
      notDuplicated('w', [{content: 'a'}, {content: 'b'}, {content: 'c'}]);
      notDuplicated('w', [{content: 'a'}, {content: 'b'}, {content: 'c'}]);
   });
});

describe('find place to put new card', function() {

   before(function() {
      persistence = proxyquire('../../../src/server/persistence', {'mongodb': mongoMock});
      persistence.init(function() {
        });
   });
   var newCardPosition = function(filledSpots, expectedExtent) {
      var user = {boards: {default: {cards: []}}};

      _.each(filledSpots, function(spot) {
         user.boards.default.cards.push({extent: spot});
      });

      var position = persistence.newContentPosition(user);
      should.exist(position);
      should.exist(position.top);
      should.exist(position.left);
      var errMsg = 'got - ' + JSON.stringify(position) + '\n\nexpected - ' + JSON.stringify(expectedExtent);
      position.left.should.equal(expectedExtent.left, errMsg);
      position.top.should.equal(expectedExtent.top, errMsg);
   };

   it('0,0 is empty. should be filled first', function() {
      newCardPosition([{top: 0, left: 0}, {}], {top: 1, left: 0});
      newCardPosition([{top: 1, left: 0}], {top: 0, left: 0});
      newCardPosition([{top: 1, left: 1}], {top: 0, left: 0});
   });

   it('first tier numbers', function() {
      newCardPosition([{top: 0, left: 0}, {top: 1, left: 0}], {top: 0, left: 1});
      newCardPosition([{top: 0, left: 0}, {top: 0, left: 1}], {top: 1, left: 0});
      newCardPosition([{top: 0, left: 0}, {top: 1, left: 0}, {top: 0, left: 1}], {top: 1, left: 1});
      newCardPosition([{top: 0, left: 0}, {top: 1, left: 0}, {top: 0, left: 1}, {top: 2, left: 0}], {top: 1, left: 1});
      newCardPosition([{top: 1, left: 0}, {top: 0, left: 1}], {top: 0, left: 0});
   });
});

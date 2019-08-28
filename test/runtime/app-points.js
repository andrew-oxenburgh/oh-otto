'use strict';

var request = require('request');
var should = require('should');
require('should-http');
var _ = require('lodash');

var Promise = require('bluebird');
var assert = require('assert');

var util = require('../utils');
request = Promise.promisifyAll(request);

var shouldBe200andValidId = function(res) {
   res.statusCode.should.equal(200, res);
   util.isId(res.body);
};

var shouldBe200andJson = function(res) {
   res.should.be.json();
   res.should.have.status(200);
};

var existingUserError = function(res) {
   res.should.be.json();
   res.should.have.status(400);
   res.body.message.should.equal('user with that name exists');
   res.body.status.should.equal(400);
};

var POST_USER_PREFIX = 'http://localhost:5000/v2/user';
var POST_BOARD_PREFIX = 'http://localhost:5000/v2/board';
var POST_CARD_PREFIX = 'http://localhost:5000/v2/board';
var GET_USERS_URL = 'http://localhost:5000/v2/users';

var getUserUrl = function(uid) {
   return POST_USER_PREFIX + '/' + uid;
};

var getUserBoardsUrl = function(uid) {
   return 'http://localhost:5000/v2/user/boards/' + uid;
};

var postBoardUrl = function(uid) {
   return 'http://localhost:5000/v2/board/' + uid;
};

var postCardUrl = function(uid, bid) {
   var ret = 'http://localhost:5000/v2/board';
   ret += '/' + uid;
   ret += '/' + bid;
   return ret;
};

var getBoardUrl = function(uid, bid) {
   var ret = 'http://localhost:5000/v2/board';
   ret += '/' + uid;
   ret += '/' + bid;
   return ret;
};

var matchesCreatedUser = function(res, userName, uid) {
   res.should.have.status(200);
   var user = res.body;
   user._id.should.equal(uid);
   user.name.should.equal(userName);
   util.hasId(user);
   user.board.background.should.equal('smokewhite');
};

var uniqueName = function() {
   return _.uniqueId(new Date().toTimeString());
};

describe('', function() {
   it('hit all webapp points and test results', function(done) {
      var userName = uniqueName();
      var uid;
      var bid;
      var cid;

      var postOptions = {
         uri: POST_USER_PREFIX,
         json: true
      };

      var getOptions = {
         json: true
      };

      var reqPost = request.postAsync.bind(request, postOptions);
      var reqGet = request.getAsync.bind(request, getOptions);
      postOptions.body = {
         name: userName
      };
      reqPost()
            .then(function(res) {
               uid = res.body;
               shouldBe200andValidId(res);
            })
            .then(function() {
               return reqPost();
            })
            .then(function(res) {
               existingUserError(res);
            })
            .then(function() {
               postOptions.body.name = uniqueName();
               return reqPost();
            })
            .then(function() {
               getOptions.uri = getUserUrl(uid);
               return reqGet();
            })
            .then(function(res) {
               res.should.be.json();
               matchesCreatedUser(res, userName, uid);
            })
            .then(function(res) {
               postOptions.uri = postBoardUrl(uid);
               postOptions.body = {name: 'board1'};
               return reqPost();
            })
            .then(function(res) {
               postOptions.uri = postBoardUrl(uid);
               postOptions.body = {name: 'board2'};
               return reqPost();
            })
            .then(function(res) {
               shouldBe200andValidId(res);
               bid = res.body;
            })
            .then(function() {
               postOptions.uri = postCardUrl(uid, bid);
               postOptions.body = {content: 'i am what i am'};
               return reqPost();
            })
            .then(function(res) {
               shouldBe200andValidId(res);
               cid = res.body;
            })
            .then(function() {
               getOptions.uri = getUserBoardsUrl(uid);
               return reqGet();
            })
            .then(function(res) {
               shouldBe200andJson(res);
               var arrayOfBoards = res.body;
               util.expectArrayContainsPropsWithName(arrayOfBoards, 'name', ['board1', 'board2']);
               return;
            })
            .then(function() {
               getOptions.uri = getBoardUrl(uid, bid);
               return reqGet();
            })
            .then(function(res) {
               shouldBe200andJson(res);
               var expectedBoard = {
                  _id: bid,
                  name: 'board2',
                  cards: [{
                     _id: cid,
                     content: 'i am what i am'
                  }]
               };

               util.mongooseLooksRight(expectedBoard, res.body);
               done();
            });
   });
});

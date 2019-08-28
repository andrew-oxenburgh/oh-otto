'use strict';

// jscs:disable maximumLineLength

/* globals describe, it, addUserAndrew, boardTemplate, objIdPattern,
isId, hasId, checkErrorMessage, expectArrayContainsPropsWitrhName */

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

describe('#beast mode', function() {

   beforeEach(function(done) {
      store.test.knockdown()
            .then(function() {
               done();
            });
   });

   it('#userFind - junk args should all return null', function(done) {
      Promise.all([
              store.user.read({udoc: {name: '1'}}),
              store.user.read({udoc: {name: 'sdfsdfsdf'}}),
          ])
            .then(function(res) {
               var i = 0;
               for (; i < res.length; i++) {
                  should(res[i]).be.Null(res[i]);
               }
               done();
            });
   });

   it('#userAdd - invalid user names', function(done) {
      Promise.all([
              store.user.add({udoc: {name: '1'}}),
              store.user.add({udoc: {name: '12'}}),
              store.user.add({udoc: {name: '123'}}),
              store.user.add({udoc: {name: '1234'}})
          ])
            .then(function(res) {
               var i = 0;
               res.length.should.equal(4);
               for (; i < res.length; i++) {
                  res[i].error.message.should.equal('user name invalid');
                  res[i].error.status.should.equal(400);
               }
               done();
            });
   });

   it('#userAdd - invalid user names', function(done) {
      Promise.all([
              store.user.add({}),
              store.user.add({udoc: {}}),
              store.user.add({udoc: {kkk: ''}})
          ])
            .then(function(res) {
               _.each(res, function(r) {
                  checkErrorMessage(r, 'unauthorised', 403);
               });
               res.length.should.equal(3);
               done();
            });
   });

   it('#userRemove - can remove a user', function(done) {
      var result = {};
      addUserAndrew.call()
            .then(function(uid) {
               isId(uid);
               result.uid = uid;
               return store.user.remove({uid: uid});
            })
            .then(function(uid) {
               isId(uid);
               result.uid.should.equal(uid);
               return store.user.read({udoc: {name: 'andrew'}});
            })
            .then(function(udoc) {
               should(udoc).is.Null();
               return store.user.about({uid: result.uid});
            })
            .then(function(res) {
               checkErrorMessage(res, 'unauthorised', 403);
               done();
            });
   });

   it('#userUpdate - can change a users name', function(done) {
      var result = {};
      addUserAndrew.call()
            .then(function(uid) {
               isId(uid);
               result.uid = uid;
               return store.user.update({uid: uid, udoc: {name: 'phil'}});
            })
            .then(function(uid) {
               isId(uid);
               result.uid.should.equal(uid);
               return store.user.read({udoc: {name: 'phil'}});
            })
            .then(function(udoc) {
               hasId(udoc);
               udoc._id.should.equal(result.uid);
               'phil'.should.equal(udoc.name);
               done();
            });
   });

   it('#userFind - requesting an unknown user returns null', function(done) {
      store.user.read({udoc: {name: 'unknown'}})
            .then(function(brds) {
               should(brds).be.Null();
               done();
            });
   });

   it('#userAdd - add a new user - returns an id', function(done) {
      addUserAndrew.call()
            .then(function(uid) {
               isId(uid);
               done();
            });
   });

   it('#userAdd - user name should be unique - return with error', function(done) {
      addUserAndrew.call()
            .then(function(uid) {
               isId(uid);
               should(uid).match(objIdPattern);
               return addUserAndrew.call();
            })
            .then(function(res) {
               should(res).not.be.Null();
               res.error.message.should.equal('user with that name exists', res);
               res.error.status.should.equal(400, res);
               done();
            });
   });

   it('#userFind - find an existing user id by name', function(done) {
      var result = {};
      addUserAndrew.call()
            .then(function(uid) {
               isId(uid);
               result.uid = uid;
               return store.user.read({udoc: {name: 'andrew'}});
            })
            .then(function(user) {
               hasId(user);
               user.name.should.equal('andrew');
               result.uid.should.equal(user._id);
               done();
            });

   });

   it('#usersCount - counts multiple users', function(done) {
      var prm1 = store.user.add({udoc: {name: 'andrew'}});
      var prm2 = store.user.add({udoc: {name: 'steven'}});
      Promise.all([prm1, prm2]).then(function() {
         return store.user.count();
      }).then(function(res) {
         res.should.equal(2);
         done();
      });
   });

   it('#usersCount - counts no users', function(done) {
      store.user.count()
            .then(function(userCount) {
               userCount.should.equal(0);
               done();
            });
   });

   it('#userAbout - user with bad id', function(done) {
      store.user.about({uid: 'bad id'})
            .then(function(res) {
               var expectedMessage = 'unauthorised';
               var expectedStatus = 403;
               checkErrorMessage(res, expectedMessage, expectedStatus);
               done();
            });
   });

   it('#userAbout - user with good id, but non-existent', function(done) {
      store.user.about({uid: '56bd10565c2910b2804e9f55'})
            .then(function(res) {
               var expectedMessage = 'unauthorised';
               var expectedStatus = 403;
               checkErrorMessage(res, expectedMessage, expectedStatus);
               done();
            });
   });

   it('#userAbout - existing user - no boards - returns default board', function(done) {
      store.user.add({udoc: {name: 'andrew'}})
            .then(function(uid) {
               return store.user.about({uid: uid});
            })
            .then(function(userInfo) {
               hasId(userInfo);
               userInfo.name.should.equal('andrew');
               userInfo.board.name.should.equal('default board');
               done();
            });
   });

   it('#boardRead - get given board for given user', function(done) {
      var result = {};
      addUserAndrew.call().then(function(uid) {
         result.andrewId = uid;
         uid.should.be.a.String();
         return store.user.add({udoc: {name: 'steven'}});
      })
            .then(function(uid) {
               uid.should.be.a.String();
               result.stevenId = uid;
               return store.board.add({uid: result.andrewId, bdoc: {name: 'board with user'}});
            })
            .then(function(bid) {
               bid.should.be.a.String();
               return store.board.read({uid: result.andrewId, bid: bid});
            })
            .then(function(board) {
               board._id.should.be.a.String();
               board.name.should.equal('board with user');
               done();
            });
   });

   it('#userBoards - no boards returns empty array', function(done) {
      addUserAndrew.call()
            .then(function(uid) {
               return store.user.board({uid: uid});
            })
            .then(function(boardsForUser) {
               boardsForUser.should.be.an.Array();
               boardsForUser.length.should.equal(0);
               done();
            });
   });

   it('#userBoards - user with 2 boards', function(done) {
      var result = {ownerId: '', board: []};
      addUserAndrew.call().then(function(uid) {
         result.ownerId = uid;
         uid.should.be.a.String();
         return store.board.add({uid: uid, bdoc: {name: 'board 1'}});
      })
            .then(function(brd1) {
               brd1.should.be.a.String();
               result.board.push(brd1);
               return store.board.add({uid: result.ownerId, bdoc: {name: 'board 2'}});
            })
            .then(function(brd2) {
               brd2.should.be.a.String();
               result.board.push(brd2);
               return store.user.board({uid: result.ownerId});
            })
            .then(function(usrBrds) {
               hasId(usrBrds[0]);
               hasId(usrBrds[1]);
               usrBrds.should.be.an.Array();
               usrBrds.length.should.equal(2);
               testUtils.expectArrayContainsPropsWithName(usrBrds, 'name', ['board 1', 'board 2']);
               testUtils.expectArrayContainsPropsWithName(
                   usrBrds,
                   '_id',
                   [usrBrds[0]._id, usrBrds[1]._id]);
               done();
            });
   });
});

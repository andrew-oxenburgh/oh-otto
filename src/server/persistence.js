'use strict';

var MongoClient = require('mongodb').MongoClient;
var Promise = require('node-promise').Promise;
var debug = require('debug')('oh-otto:persistence');
var _ = require('lodash');

var db;

var USERS_COLLECTION = 'users';
var BOARDS_COLLECTION = 'boards';

var usersCollection;
var boardsCollection;

var url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/myproject';

var DEFAULT_BOARD = {
   background: 'color-whitesmoke',
   cards: [{
      name: 'some name',
      content: 'stored in the cloud',
      extent: {
         left: 50,
         top: 50,
         height: 300,
         width: 250
      },
      style: {
         name: 'plain',
         css: ''
      }
   }],
   extent: {
      width: 5000,
      height: 5000
   },
   name: 'default board'
};

var readCurrentBoardForUser = function(req, res) {
   var promise = new Promise();

   if (!req.cookies.userProfile) {
      promise.reject(new Error('no userProfile cookie'));
      return promise;
   }

   var uid = JSON.parse(req.cookies.userProfile).user_id;

   usersCollection.findOne({_id: uid}, function(err, doc) {
      if (err || doc === null || doc === undefined) {
         res.json(DEFAULT_BOARD).end();
      } else {
         var currBrd;
         if (!doc.boards) {
            currBrd = DEFAULT_BOARD;
         } else {
            currBrd = doc.boards[doc.currentBoard || 'default'] || DEFAULT_BOARD;
         }
         res.json(currBrd).end();
      }
      promise.resolve();
   });
   return promise;
};

var readNamedBoardForUser = function(req, res) {

   var promise = new Promise();

   var boardName = req.params.name;

   // find user-id
   var uid;

   if (req.cookies.userProfile === undefined) {
      res.cookie('userProfile', undefined).cookie('userToken', undefined).status(401).end();
      promise.resolve();
      return promise;
   } else {
      try {
         uid = JSON.parse(req.cookies.userProfile).user_id;
      } catch (e) {
         res.cookie('userProfile', undefined).cookie('userToken', undefined).redirect();
         promise.resolve();
         return promise;
      }
   }

   usersCollection.findOne({_id: uid}, function(err, doc) {
      if (err || doc === null || doc === undefined || !doc.boards[boardName]) {
         res.json({
            'cards': [{
               'name': 'card-62853',
               'content': '# new board\nstored on the cloud',
               'extent': {
                  'left': 50,
                  'top': 50,
                  'height': 300,
                  'width': 250
               },
               'style': {
                  'name': 'plain',
                  'css': ''
               }
            }]
         }).end();
      } else {
         res.send(doc.boards[boardName]).end();
      }
      promise.resolve();
   });
   return promise;
};

var duplicated = function(content, cards) {
   var ret = !!_.find(cards, function(o) {
      return o.content === content;
   });
   return ret;
};

/*
 When a card is added via bookmark, it only has content, no position.
 Here we decide where it goes. It tries to occupy the free space closest to the origin.
 It does this by summing the top and left values, and choosing the lowest weight, and
 */
var newContentPosition = function(user) {
   var cols = [];
   var i;
   var j;
   var k;
   for (i = 0; i < 10; i++) {
      cols[i] = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
   }
   var cards = user.boards.default.cards;
   _.each(cards, function(card) {
      if (card && card.extent) {
         var top = parseInt(card.extent.top);
         var left = parseInt(card.extent.left);
         if (Number.isInteger(top) && Number.isInteger(left)) {
            cols[left][top] = 'filled';
         }
      }
   });

   var spares = [];

   for (j = 0; j < 10; j++) {
      for (k = 0; k < 10; k++) {
         if (cols[j][k] === undefined) {
            spares.push({
               weight1: (j + k),
               weight2: (j * k),
               weight3: (Math.max(j, k)),
               extent: {left: j, top: k}
            });
         }
      }
   }

   var orderedByWeight = _.orderBy(spares, ['weight3', 'weight1', 'weight2'], ['asc', 'asc', 'desc']);
   var spot = orderedByWeight[0];
   return spot.extent;
};

var addCard = function(uid, content) {
   usersCollection.findOne({_id: uid}, function(err, user) {
      if (err) {
         throw err;
      }

      if (!user) {
         user = {_id: uid};
      }
      if (!user.boards) {
         user.boards = {'default': DEFAULT_BOARD};
      }

      var cards = user.boards['default'].cards;

      if (duplicated(content, cards)) {
         return;
      } else {
         // add card to list of cards
         var extent = newContentPosition(user);
         // debug('added card - ', content);
         // debug('added card to - ', extent);
         var newCard = {content: content, extent: extent};
         // debug('new card', JSON.stringify(newCard, null, 2));
         user.boards['default'].cards.push(newCard);
      }

      usersCollection.save(user, function(err, doc) {
         if (err) {
            debug('can\t save board - %s', err);
         } else {
            debug('saved doc - %s', doc);
         }
      });
   });
};

var writeNamedBoardForUser = function(req, res) {
   var promise = new Promise();
   var boardName = req.params.name;

   if (!boardName) {
      res.status(404).end();
      promise.resolve();
      return promise;
   }

   if (req.cookies.userProfile === undefined) {
      res.status(401);
      promise.resolve();
      return promise;
   }

   var uid = JSON.parse(req.cookies.userProfile).user_id;
   if (!uid) {
      res.status(401);
      promise.resolve();
      return promise;
   }

   var board = req.body;

   if (!board) {
      res.status(400);
      promise.resolve();
      return promise;
   }

   usersCollection.findOne({_id: uid}, function(err, user) {
      if (err) {
         throw err;
      }

      if (!user) {
         user = {_id: uid};
      }
      if (!user.boards) {
         user.boards = {};
      }
      user.boards[boardName] = board;
      var refreshBoard = refreshFn.bind(null, board);

      usersCollection.save(user, function(err, doc) {
         if (err) {
            debug('can\t save board - %s', err);
            debug('can\t save board - %s', doc);
            res.status(400).end();
         } else {
            debug('saved doc - %s', doc);
            res.status(201).end();
         }
         promise.resolve();
         debug(' writeNamedBoardForUser > resolved');
         refreshBoard();
         res.status(201).end();
      });
   });

   return promise;
};

var allBoardsForUser = function(req, resp) {
   var userProf = req.cookies.userProfile;
   if (!userProf) {
      resp.status(401).send().end();
      return;
   }
   var uid = JSON.parse(userProf).user_id;
   if (uid === undefined) {
      res.json(data.default).end();
      return;
   }

   usersCollection.findOne({_id: uid}, function(err, user) {
      if (err) {
         throw err;
      }
      if (!user) {
         return;
      }
      var boards = [];
      for (var board in user.boards) {
         boards.push(board);
      }
      resp.send(boards).end();
   });
};

function mongoConnected(err, database) {
   if (err) {
      debug('error connecting to db', err);
      throw err;
   }
   db = database;
   usersCollection = db.collection(USERS_COLLECTION);
   boardsCollection = db.collection(BOARDS_COLLECTION);
   debug('mongodb connected to ', database.databaseName);
}

MongoClient.connect(url, {}, mongoConnected);

var refreshFn;

module.exports = {
   init: function(fn) {
      refreshFn = fn;
      return this;
   },
   writeNamedBoardForUser: writeNamedBoardForUser,
   allBoardsForUser: allBoardsForUser,
   readNamedBoardForUser: readNamedBoardForUser,
   readCurrentBoardForUser: readCurrentBoardForUser,
   addCard: addCard,
   usersCollection: function() {
      return usersCollection;
   },
   boardsCollection: function() {
      return boardsCollection;
   },
   defaultBoard: function() {
      return DEFAULT_BOARD;
   },
   duplicated: duplicated,
   newContentPosition: newContentPosition
};

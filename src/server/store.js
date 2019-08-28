'use strict';

var mongoose = require('mongoose');
var Promise = require('bluebird');
var assert = require('assert');
var _ = require('lodash');
var debug = require('debug')('oh-otto:store');

mongoose.Promise = Promise;

var errorUnauthorised = {
   error: {
      message: 'unauthorised',
      status: 403
   }
};

var errorGeneric = {
   error: {
      message: 'error',
      status: 500
   }
};

var errorUserName = {
   error: {
      message: 'user name invalid',
      status: 400
   }
};

var boardUpdate = function(options) {
   assert(options);
   var uid = options.uid;
   var bdoc = options.bdoc;
   var bid = options.bid;
   var result = {};

   return User.findOne({_id: uid, boards: bid}, '_id')
        .then(function(doc) {
           if (!doc || doc.errors || doc === []) {
              return errorUnauthorised;
           }
           return Board.update({_id: bid}, bdoc);
        }).then(function(res) {
           if (res.error) {
              return res;
           } else {
              return bid;
           }
        }).error(function() {
           return errorGeneric;
        });
};

var boardAdd = function(options) {
   assert(options);
   var uid = options.uid;
   var bdoc = options.bdoc;
   var result = {};

   return new Board(bdoc)
       .save()
        .then(function(board) {
           result.board = board;
           return User.findById(uid);
        })
        .then(function(userDoc) {
           if (!userDoc) {
              return Promise.reject('cant find user' + uid);
           }
           result.user = userDoc;
           userDoc.boards.addToSet(result.board._id.toString());
           return userDoc.save();
        })
        .then(function() {
           var bid = result.board._id.toString();
           return bid;
        })
        .error(function(err) {
           return {
              error: err
           };
        });
};

var boardRemove = function(options) {
   assert(options);
   var uid = options.uid;
   var bid = options.bid;
   assert(uid);
   assert(bid);
   return Promise.all([Board.findOne({_id: bid}), User.findOne({_id: uid, boards: bid})])
        .then(function(res) {
           var board = res[0];
           var user = res[1];
           if (!board || !user) {
              return Promise.reject(errorUnauthorised);
           }
           user.boards.remove(bid);
           return user.save();
        }).then(function() {
           return bid.toString();
        })
        .error(function(err) {
           return errorUnauthorised;
        })
        .catch(function(err) {
           return errorUnauthorised;
        });
};

var boardRead = function(options) {
   assert(options);
   var uid = options.uid;
   var bid = options.bid;
   // board must exist in list of boards fdor that owner
   var result = {};
   return User.findOne({_id: uid, boards: bid})
        .then(function(doc) {
           if (!doc || doc.errors) {
              return errorUnauthorised;
           }
           return Board.findOne({_id: bid});
        })
        .then(function(board) {
           if (board.toObject) {
              board = board.toObject();
              board._id = board._id.toString();
              delete board.__v;
           }
           result.board = board;
           return Card.find({_id: {$in: board.cards}});
        })
        .then(function(cards) {
           var retCards = [];
           _(cards).forEach(function(card) {
              var newCard = card.toObject();
              newCard._id = newCard._id.toString();
              delete newCard.__v;
              retCards.push(newCard);
           });
           result.board.cards = retCards;
           return result.board;
        })
        .error(function() {
           return errorGeneric;
        });
};

var userAdd = function(options) {
   if (!options || !options.udoc || !options.udoc.name) {
      debug('userAdd: error in options:"', options, '"');
      return Promise.resolve(errorUnauthorised);
   }
   var udoc = options.udoc;
   var uname = udoc.name;
   if (!usernameValidator(uname)) {
      return Promise.resolve(errorUserName);
   }

   return User.find({name: uname}).count()
        .then(function(found) {
           if (found > 0) {
              return {
                 error: {
                    message: 'user with that name exists',
                    status: 400
                 }
              };
           } else {
              var newuser = new User(udoc);
              return newuser.save()
                    .then(function(res) {
                       var uid = res._id.toString();
                       return uid;
                    });
           }
        }).error(function(err) {
           debug('err', err);
           return errorGeneric;
        });
};

var userRemove = function(options) {
   assert(options);
   var uid = options.uid;
   assert(uid);
   return User.remove({_id: uid})
        .then(function(res) {
           return uid;
        });
};

var userUpdate = function(options) {
   assert(options);
   var uname = options.udoc.name;
   var uid = options.uid;
   assert(uname);
   assert(uid);
   return User.findOne({_id: uid})
        .then(function(udoc) {
           udoc.name = uname;
           return udoc.save();
        })
        .then(function(udoc) {
           udoc = udoc.toObject();
           var res = udoc._id.toString();
           return res;
        })
        .error(function(err) {
           return errorUnauthorised;
        });
};

var userRead = function(options) {
   assert(options);
   var uname = options.udoc.name;
   assert(uname);
   return User.findOne({name: uname})
        .then(function(user) {
           if (!user) {
              return null;
           }
           user = user.toObject();
           user._id = user._id.toString();
           return user;
        });
};

var userCount = function() {
   return User.count().then(function(res) {
      return res;
   });
};

var userAbout = function(options) {
   assert(options);
   var uid = options.uid;
   assert(uid);
   var abtUsr = {};
   return User.findById(uid).then(
        function(user) {
           if (!user) {
              return errorUnauthorised;
           }
           var defBrd = user.defaultBoard;
           abtUsr._id = user._id.toString();
           if (defBrd) {
              boardRead({uid: defBrd}).then(function(board) {
                 abtUsr.name = user.name;
                 abtUsr.board = board;
                 return abtUsr;
              });
           } else if (user.boards && user.boards.length > 0) {
              abtUsr.name = user.name;
              return Board.findOne(user.boards[0]).then(function(board) {
                 abtUsr.board = board.toObject();
                 abtUsr.board._id = abtUsr.board._id.toString();
                 return abtUsr;
              });
           } else {
              abtUsr.name = user.name;
              abtUsr.board = DEFAULT_BOARD;
              return abtUsr;
           }
        }
    ).catch(function(err) {
       return errorUnauthorised;
    });
};

var userBoards = function(options) {
   assert(options);
   var uid = options.uid;
   assert(uid);
   return User.findById(uid, 'boards')
        .then(function(brds) {
           var boards = brds.boards;
           if (!boards.length) {
              return [];
           }
           return Board.find({_id: {$in: boards}});
        })
        .then(function(boards) {
           var ret = [];
           _(boards).each(function(board) {
              ret.push({
                 _id: board._id.toString(),
                 name: board.name
              });
           });
           return ret;
        })
        .error(function(err) {
           return [];
        });
};

var cardAdd = function(options) {
   assert(options);
   assert(options.uid);
   assert(options.bid);
   assert(options.cdoc);

   var card = new Card(options.cdoc);

   return User.find({_id: options.uid, boards: options.bid})
        .then(function(doc) {
           // got user
           if (!doc || doc.errors || doc === []) {
              return errorUnauthorised;
           }
           if (options.cid) {
              return Card.update({_id: options.cid}, options.cdoc);
           } else {
              return card.save();
           }
        }).then(function(card) {
           // saved or updated card
           if (card._id) {
              options.cid = card._id.toString();
           }
           return Board.findById(options.bid);
        })
        .then(function(board) {
           // found card
           assert(board);
           board.cards || (board.cards = []);
           board.cards.addToSet(options.cid.toString());
           return board.save();
           // and save board
        })
        .then(function(board) {
           return options.cid;
        });
};

var cardRead = function(options) {
   if (!options) {
      return Promise.resolve(errorUnauthorised);
   }

   var uid = options.uid;
   var bid = options.bid;
   var cid = options.cid;

   if (!uid || !bid || !cid) {
      return Promise.resolve(errorUnauthorised);
   }

   return User.findOne({_id: uid, boards: bid})
        .then(function(doc) {
           if (!doc || doc.errors || doc === []) {
              return errorUnauthorised;
           }
           return Card.findById(cid);
        }).then(function(doc) {
           if (!doc || doc.error) {
              return doc && doc.error;
           }
           assert(doc);
           doc = doc.toObject();
           doc._id = doc._id.toString();
           return doc;
        })
        .catch(function(err) {
           return errorUnauthorised;
        });
};

var cardUpdate = function(options) {
   assert(options);
   var uid = options.uid;
   var bid = options.bid;
   var cid = options.cid;
   var cdoc = options.cdoc;
   assert(uid);
   assert(bid);
   assert(cid);
   assert(cdoc);
   var cardPrm = Card.findById(cid);
   var brdPrm = Board.findOne({_id: bid, cards: cid});
   var usrPrm = User.findOne({_id: uid, boards: bid});
   return Promise.all([cardPrm, brdPrm, usrPrm])
        .then(function(res) {
           var card = res[0];
           var brd = res[1];
           var user = res[2];
           assert(card._id == cid);
           assert(brd._id == bid);
           assert(user._id == uid);

           card.content = cdoc.content;
           return card.save();
        })
        .then(function(card) {
           card = card.toObject();
           return card._id.toString();
        });
};

var cardRemove = function(options) {
   assert(options);
   var uid = options.uid;
   var bid = options.bid;
   var cid = options.cid;
   assert(uid);
   assert(bid);
   assert(cid);
   var cardPrm = Card.findById(cid);
   var brdPrm = Board.findOne({_id: bid, cards: cid});
   var usrPrm = User.findOne({_id: uid, boards: bid});
   return Promise.all([cardPrm, brdPrm, usrPrm])
        .then(function(res) {
           var card = res[0];
           var brd = res[1];
           var user = res[2];
           assert(card._id == cid);
           assert(brd._id == bid);
           assert(user._id == uid);
           return Card.remove(cid);
        })
        .then(function(card) {
           return cid;
        });
};

// ADMINY STUFF

var DEFAULT_BOARD = {
   name: 'default board',
   background: 'smokewhite'
};

var User = mongoose.model(
    'User',
    {
       name: String,
       loggedOn: Boolean,
       boards: [
           String
       ]
    }
);

var Board = mongoose.model(
    'Board',
    {
       name: String,
       background: String,
       cards: [String]
    });

var Card = mongoose.model(
    'Card',
    {
       content: String,
       extent: {
          top: Number,
          left: Number,
          bottom: Number,
          right: Number
       }
    }
);

var knockdown = function() {
   return Promise.all([
       User.remove({}),
       Board.remove({}),
       Card.remove({})
   ]).all();
};

var url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/oh-otto-alpha';

mongoose.connect(url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
});

var usernameValidator = (name)=> {
   return !!name.match(/^[a-zA-Z][@\.a-zA-Z0-9]{5,}$/);
};

// todo: delete board
// todo: delete card
// todo: update card

module.exports = {
   user: {
      add: userAdd,
      read: userRead,
      update: userUpdate,
      remove: userRemove,
      board: userBoards,
      count: userCount,
      about: userAbout
   },
   board: {
      add: boardAdd,
      read: boardRead,
      update: boardUpdate,
      remove: boardRemove
   },
   card: {
      add: cardAdd,
      read: cardRead,
      update: cardUpdate,
      remove: cardRemove
   },
   test: {
      knockdown: knockdown,
      board: Board,
      user: User,
      card: Card,
      usernameValidator: usernameValidator
   }
};

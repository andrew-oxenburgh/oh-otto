var store = require('./store');
var debug = require('debug')('oh-otto:webapp');
var assert = require('assert');

var userAdd = function(req, res) {
   return post(req, res, 'userAdd', store.user.add.bind());
};

var userBoards = function(req, res) {
   return query(req, res, 'userBoards', store.user.board.bind());
};

var boardAdd = function(req, res) {
   return post(req, res, 'boardAdd', store.board.add.bind());
};

var cardAdd = function(req, res) {
   return post(req, res, 'cardAdd', store.card.add.bind());
};

var boardRead = function(req, res) {
   return query(req, res, 'boardRead', store.board.read.bind());
};

var userAbout = function(req, res) {
   return query(req, res, 'userAbout', store.user.about.bind());
};

var userRead = function(req, res) {
   return query(req, res, 'userRead', store.user.read.bind());
};

var cardRead = function(req, res) {
   return query(req, res, 'cardRead', store.card.read.bind());
};

var query = function(req, res, msg, fn) {
   var options = createOptions(req, msg);
   debug(msg, options);
   return fn(options)
        .then(function(result) {
           assert(result);
           if (typeof result === 'object') {
              if (result.error) {
                 debug('error ' + msg + ':', result);
                 return res
                     .status(result.error.status)
                     .json(result.error.message)
                     .end();
              } else {
                 debug('success', msg + ':', result);
                 return res
                     .json(result)
                     .end();
              }
           } else {
              debug('error', msg + ':', result);
              return res
                  .status(400)
                  .send('unknown error')
                  .end();

           }
        });
};

var post = function(req, res, msg, fn) {
   var options = createOptions(req, msg);
   debug(msg, options);
   return fn(options)
        .then(function(addRes) {
           assert(addRes);
           if (typeof addRes === 'object') {
              debug('error' + msg + ':', addRes);
              return res
                  .status(addRes.error.status)
                  .json(addRes.error)
                  .end();
           }
           debug(msg + ':', addRes);
           return res
               .send(addRes)
               .end();
        });
};

var createOptions = function(req, msg) {
   // params
   var ret = {
      uid: req.params.uid || '',
      bid: req.params.bid || '',
      cid: req.params.cid || ''
   };
   // put doc in right place
   if (msg.match(/user/)) {
      ret.udoc = req.body;
   } else if (msg.match(/board/)) {
      ret.bdoc = req.body;
   } else if (msg.match(/card/)) {
      ret.cdoc = req.body;
   }
   return ret;
};

module.exports = function(app) {
   app.post('/v2/user', userAdd);
   app.post('/v2/board/:uid', boardAdd);
   app.post('/v2/board/:uid/:bid', cardAdd);

   app.get('/v2/user/:uid', userAbout);
   app.get('/v2/user/about/:uid', userRead);
   app.get('/v2/user/boards/:uid', userBoards);
   app.get('/v2/board/:uid/:bid', boardRead);
   app.get('/v2/card/:uid/:bid/:cid', cardRead);
};


'use strict';

var debug = require('debug')('oh-otto:r:r-bookmark');
var addCard;
var refresh;

var bookmark = function(req, res) {
   var bm = req.params.bookmark;
   debug('bookmark', bm);

   if (req.cookies.userProfile === undefined) {
      res.status(401).end();
   }

   var uid = JSON.parse(req.cookies.userProfile).user_id;
   if (!uid) {
      res.status(401).end();
   }
   addCard(uid, bm);
   refresh();

   res.send('').end();
};

module.exports = function(app, _addCard, _refresh) {
   addCard = _addCard;
   refresh = _refresh;
   app.post('/a/bookmark/:bookmark', bookmark);
   app.get('/a/bookmark/:bookmark', bookmark);
};


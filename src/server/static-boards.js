var STATIC_BOARDS = './public/static/public-boards/';

var fs = require('fs');
var debug = require('debug')('oh-otto:static-boards');

var listStaticBoards = function(req, resp) {
   fs.readdir(STATIC_BOARDS, function(err, files) {
      if (err) {
         debug(err);
         return;
      }
      resp.send(files).end();
   });
};

var getStaticBoard = function(req, resp) {
   var boardName = req.params.board;
   var path = STATIC_BOARDS + boardName;
   var endswithJson = /\.json$/.test(path);
   path = endswithJson ? path : (path + '.json');
   fs.readFile(path, function(err, data) {
      if (err) {
         if (err.code == 'ENOENT') {
            data = {
               cards: [{content: '\'' + path + '\' is an unknown board'}]
            };
         } else {
            return;
         }
      }
      resp.set('Content-Type', 'application/json');
      resp.send(data).end();
   });
};

module.exports = {
   getStaticBoard: getStaticBoard,
   listStaticBoards: listStaticBoards
};

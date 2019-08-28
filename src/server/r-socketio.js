'use strict';

var debug = require('debug')('oh-otto:r:socketio');

var io;
module.exports = {
   init: function(server) {
      io = require('socket.io').listen(server);
      io.on('connection', function() {
         io.emit('news');
         debug('connection made');
      });
      debug('init\'d socketio');
      return this;
   },
   refresh: function(data) {
      io.emit('refresh', data);
   }
};


'use strict';

var favicon = require('serve-favicon');

module.exports = function(app) {
   app.use(favicon(__dirname + '/../../public/icons/Dcsh32.png'));
};


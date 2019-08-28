var debug = require('debug')('oh-otto:requiresLogin');

module.exports.redirectIfUnauthed = function(req, res, next) {
   if (!req.isAuthenticated()) {
      debug('seems to be unauthed');
      // res.clearCookie('userProfile');
      // res.clearCookie('userToken');
   }
   next();
};

module.exports.failIfUnauthed = function(req, res, next) {
   if (!req.isAuthenticated()) {
      return res.status(403).end();
   }
   next();
};


'use strict';

module.exports = function(app, express) {
   app.use('/chrome-info', express.static('public/third-party/chrome-info'));
   app.use(express.static('public/third-party/google-info'));
};

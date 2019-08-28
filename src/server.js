'use strict';

// third party requires
const debug = require('debug')('oh-otto:server');
const express = require('express');
var fs = require('fs');
var compression = require('compression');
var path = require('path');
var mime = require('mime');
var marked = require('marked');
var app = express();
var http = require('http').createServer(app);
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var redirectIfUnauthed = require('./requiresLogin').redirectIfUnauthed;
var bodyParser = require('body-parser');
app.use(bodyParser.json(), bodyParser.text());

var helmet = require('helmet');

var sixtyDaysInSeconds = 5184000;
app.use(helmet.hsts({
   maxAge: sixtyDaysInSeconds,
   force: true
}));

// custom requires
require('./server/setup-passport');
var evernoteRoutes = require('./server/evernote-auth');
var socket = require('./server/r-socketio').init(http);
var persistence = require('./server/persistence').init(socket.refresh);
var mbed = require('./server/mbed');
var staticBoards = require('./server/static-boards');
require('./server/r-favicon')(app);
var webapp = require('./server/webapp')(app);
require('./server/open-graph')(app);
require('./server/r-articulate')(app);
require('./server/r-metadata')(app);
require('./server/r-third-party')(app, express);

var port = process.env.PORT || 5000;

app.set('port', port);

app.use(compression());
app.use(helmet());
app.use(helmet.frameguard({action: 'deny'}));

app.use(express.static(__dirname + '/../public'));
app.use(express.static(__dirname + '/../public/build'));

function redirectToHttps(res, req) {
   return res.redirect(['https://', req.get('Host'), req.url].join(''));
}

var isProduction = process.env.ENVIRONMENT == 'prd';
var isDevelopment = !isProduction;

app.use('*', function(req, res, next) {
   var isProdAndNotHttps = isProduction && req.headers['x-forwarded-proto'] != 'https';
   if (isProdAndNotHttps) {
      return redirectToHttps(res, req);
   } else {
      next();
   }
});

app.use(morgan('combined', {
      // skip: function(req, res) {
      //   // log if error, or not redirected
      //   return false;
      // }
   })
);

// views is directory for all template files
app.set('views', __dirname + '/../public/views');
app.set('view engine', 'ejs');

app.get('/', redirectIfUnauthed, function(request, response) {
   response
      .render('pages/oh-otto', {
         user: request.user,
         boardId: 'default'
      });
});

app.get('/board/:boardId', function(request, response) {
   response.render('pages/oh-otto', {boardId: request.params.boardId || 'default'});
});

app.get('/auth', redirectIfUnauthed, function(request, response) {
   response.locals.user = request.user;
   response.render('pages/oh-otto', {
      user: request.user,
      thiungy: 'kjhsdfkhdsf',
      auth: true
   });
});

app.get('/', function(request, response) {
   if (request.isAuthenticated()) {
      return response.redirect('/auth');
   } else {
      return response.redirect('/');
   }
});

app.use(cookieParser());
app.use(session({
   secret: process.env.AUTH0_CLIENT_SECRET,
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

var login = function() {
   return passport.authenticate('auth0', {
      failureRedirect: '/fails',
      successRedirect: '/sucess'
   });
};

var loggedOn = function(req, res) {
   if (!req.user) {
      return res.redirect('/');
   }
   req.path = '/auth';
   res.render('pages/oh-otto', {user: req.user.nickname});
};

app.get('/callback', login, loggedOn);

app.get('/ev_oauth_callback', evernoteRoutes.ev_oauth_callback);
app.get('/ev_oauth', evernoteRoutes.ev_oauth);
app.get('/evernote/note/:guid', evernoteRoutes.ev_note);

app.get('/samples/instructions', function(req, res) {
   res.type('application/json').status(200).render('../public/static/instructions.ejs');
});

app.get('/change-log.html', function(req, res) {
   var path = __dirname + '/../public/log.md';
   var file = fs.readFileSync(path, 'utf8');
   res.send(marked(file));
});

app.get('/test-script.html', function(req, res) {
   var path = __dirname + '/../doc/test-script.md';
   var file = fs.readFileSync(path, 'utf8');
   res.send(marked(file));
});

app.get('/providers', mbed.showProviders);
app.post('/board/w/:name', persistence.writeNamedBoardForUser);
app.get('/board/r/:name', persistence.readNamedBoardForUser);
app.get('/boards', persistence.allBoardsForUser);
app.get('/a/oembed', mbed.oembed);

app.get('/static-boards', staticBoards.listStaticBoards);
app.get('/static-board/:board', staticBoards.getStaticBoard);

require('./server/r-bookmark')(app, persistence.addCard, socket.refresh);

app.use(logErrors);
function logErrors(err, req, res, next) {
   debug('error', err.stack);
   res.sendStatus(404);
   next(err);
}

if (process.env.ENVIRONMENT != 'prd') {
   debug('WARNING: debug available');
   app.get('/debug', function(req, resp) {
      resp.set('Content-Type', 'application/json');
      resp.send(req.session).end();
   });
}

/**************/
/**************/
/**************/
/**************/
/**************/

http.listen(app.get('port'), imListening);
exports.port = port;
exports.app = app;

debug('starting up');

function imListening() {
   console.log('running');
   debug('Node app is running on port', app.get('port'));
   debug('versions:', process.versions);
}

debug(app);

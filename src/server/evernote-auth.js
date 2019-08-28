'use strict';

var Evernote = require('evernote').Evernote;
var marked = require('marked');
var xpath = require('xpath');
var Dom = require('xmldom').DOMParser;
var debug = require('debug')('oh-otto:evernote-auth');

var callbackUrl = process.env.EV_CALLBACK_URL;

// OAuth
exports.ev_oauth = function(req, res) {

   var client = new Evernote.Client({
      consumerKey: process.env.EV_KEY,
      consumerSecret: process.env.EV_SECRET,
      sandbox: true
   });

   client.getRequestToken(callbackUrl, function(error, oauthToken, oauthTokenSecret, results) {
      if (error) {
         req.session.error = JSON.stringify(error);
         res.send(error.data);
      } else {
         // store the tokens in the session
         req.session.oauthToken = oauthToken;
         req.session.oauthTokenSecret = oauthTokenSecret;

         // redirect the user to authorize the token
         res.redirect(client.getAuthorizeUrl(oauthToken));
      }
   });

};

// OAuth callback
exports.ev_oauth_callback = function(req, res) {
   var client = new Evernote.Client({
      consumerKey: process.env.EV_KEY,
      consumerSecret: process.env.EV_SECRET,
      sandbox: true
   });

   client.getAccessToken(
       req.session.oauthToken,
       req.session.oauthTokenSecret,
       req.params.oauth_verifier,
        function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
           if (error) {
              debug(error);
              res.redirect('/');
           } else {
              res.cookie('evernote_token', oauthAccessToken);
              // store the access token in the session
              req.session.edamOauthAccessToken = oauthAccessToken;
              req.session.edamOauthAccessTtokenSecret = oauthAccessTokenSecret;
              req.session.edamShard = results.edam_shard;
              req.session.edamUserId = results.edam_userId;
              req.session.edamExpires = results.edam_expires;
              req.session.edamNoteStoreUrl = results.edam_noteStoreUrl;
              req.session.edamWebApiUrlPrefix = results.edam_webApiUrlPrefix;
              res.redirect('/');
           }
        });
};

exports.ev_note = function(req, resp) {
   var client = new Evernote.Client({
      token: req.cookies.evernote_token,
      sandbox: true
   });

   client.getNoteStore().getNote(req.cookies.evernote_token, req.params.guid,
      true, false, false, false, function(err, note) {
         if (err) {
            log(err);
            resp.status(404).send(err).end();
            return;
         }
         var newCntnt = xpath.select('//en-note',
             new Dom().parseFromString(note.content)
         ).toString();

         note.content = newCntnt;

         resp.set('Content-Type', 'application/json');
         resp.send(note).end();
      });
};

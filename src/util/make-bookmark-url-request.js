'use strict';

var bluebird = require('bluebird');
var request = bluebird.promisify(require('request'));
var debug = require('debug')('oh-otto:util:make-bookmark-url-request');

var USER_AGENT = process.env.USER_AGENT;

var makeBookmarkUrlRequest = function(_url) {
   var url = mustHaveProtocol(_url);
   debug(url);
   return request({

      proxy: process.env.PROXY,
      url: url,
      maxRedirects: 10,
      removeRefererHeader: true,
      followAllRedirects: true,
      method: 'GET',
      jar: request.jar(),
      headers: {
         'user-agent': USER_AGENT,
         pragma: 'no-cache',
         referer: 'http://oh-otto.nz/',
         accept: 'text/html,application/xhtml+xml,application/xml;q=0.9',
         'accept-language': 'en-GB,en;q=0.8,en-US;q=0.6'
      }
   });
};

var mustHaveProtocol = function(url) {
   if (url.match(/\w:\/\//)) {
      return url;
   }
   return 'http://' + url;
};

module.exports = {
   makeBookmarkUrlRequest: makeBookmarkUrlRequest
};

'use strict';

var makeRequest = require('../util/make-bookmark-url-request').makeBookmarkUrlRequest;
var articulate = require('@andrew.oxenburgh/articulate')(makeRequest);

var utils = articulate.utils;
var urlToMetadata = articulate.urlToMeta.metadata;
var _ = require('lodash');
var debug = require('debug')('oh-otto:r:r-metadata');

var handleInitial = function(data, url) {
   var res = '<html>' +
      '<head>' +
      '<link rel="stylesheet" type="text/css" href="/metadata.css">' +
      '</head>' +
      '<body><table>';

   // title
   if (data.title) {
      res += '<tr><td colspan="3" class="title">' + data.title + '</td></tr>';
   }

   // domain
   res += '<tr><td colspan="3" class="domain">' + utils.findDomainName(data.url) + '</td></tr>';

   // url
   res += '<tr><td colspan="3" class="url">' + data.url + '</td></tr>';

   // url
   res += '<tr>' ;
   res +=   '<td>' + createAnchor('as json', '?format=json&url=' + url) + '</td>';
   // url
   res += '<td>' + createAnchor('site', url) + '</td>';

   // bookmark
   res += '<td>' + createAnchor('bookmark me', '/bookmark/' + esc(url)) + '</td>';
   res += '</tr>';

   res += '</table>\n';
   return res;
};

function esc(str) {
   return str
      .replace(/&/g, '&amp;')
      .replace(/\?/g, '%3F')
      .replace(/>/g, '&gt;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;')
      .replace(/\//g, '%2F')
      .replace(/\:/g, '%3A')
      ;
}

var metadata = function(req, res) {
   var url = req.query.url;
   debug('format = ', req.query.format);
   var format = req.query.format || 'html';
   debug('articulate', url);
   var prm = urlToMetadata(url);
   prm
      .then(function(data) {
         if (format.toLowerCase() === 'json') {
            return res.json(data).end();
         }
         var url = data.url;

         var html = handleInitial(data, url);

         html += handleBody(data.body.og, 'Open Graph', url);
         html += handleBody(data.body.twitter, 'Twitter', url);
         html += handleBody(data.body.rest, 'Rest', url);

         html += handleHeaders(data.headers);
         html += '</body></html>\n';

         return res.send(html).end();
      })
      .catch(function(err) {
         debug(err);
         return res.status(400).end();
      });
};

var createAnchor = function(_text, _href, url) {
   var text = _text || _href;
   var href = utils.findAbsPath(url, _href);

   return '<a target="_blank" href="' + href + '">' + text + '</a>';
};

var handleBody = function(body, title, url) {
   var res = '<table class="attrs"><th colspan="3">' + title + '</th>';
   _(body).forOwn(function(value, key) {
      // is there text?
      var text = value.text ? '<td class="title">' + value.text + '</td>' : '';

      // first row
      res += '<tr><td rowspan="' + (value.length) + '">' + value.type + '</td>' + text + '</tr>';

      _(value.attrs).sort('type').each(function(value, key) {
         if (key === 'href') {
            value = createAnchor(value, value, url);
         }
         res += '<tr><td></td><td class="attr-key">' + key + '</td><td href="attr-value">' + value + '</td></tr>';
      });
   });
   return res + '</table>';
};

var handleHeaders = function(headers) {
   var res = '<table class="headers">';
   res += '<tr><td class="header">headers</td></tr>';
   _(headers).forOwn(function(value, key) {
         res += '<tr><td class="header-key">' + key + '</td><td class="header-value">' + value + '</td></tr>';
      });
   return res + '</table>';
};

module.exports = function(app) {
   app.get('/a/metadata', metadata);
};

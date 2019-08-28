'use strict';

var Promise = require('node-promise').Promise;
var debug = require('debug')('oh-otto:mbed');
var request = require('request');
var providerData = require('../util/default-providers');
var _ = require('lodash');
var qryStyle;

//var defaultEmbedUrl = 'http://noembed.com/embed?url=';
var fallbackEmbedUrl = 'http://localhost-noembed.oo/embed?url=';

var USER_AGENT = 'oh-otto/0.1 (+http://oh-otto.nz)';
var MAX_WIDTH = 300;
var MAX_HEIGHT = 420;
var NOEMBED_URL_PREFIX = 'http://noembed.com/embed?format=json&maxwidth=' +
    MAX_WIDTH + '&maxheight=' + MAX_HEIGHT + '&url=';
var FAVICON_URL_PREFIX = 'http://www.google.com/s2/favicons?domain=';
var HTTP_S_REGEXP = /https?:\/\//i;

var providersCache = providerData.providers;

var oembed = function oembed(req, resp) {
   qryStyle = 'unembeddable';
   var promise = new Promise();
   var url = req.query.url;
   var embedUrl = req.query.embedUrl;

   if (!url && !embedUrl) {
      returnResponse(resp, 'no url provided', req.query);
      promise.resolve();
      return promise;
   }

   var eUri = calcUrl(embedUrl, url);
   if (!eUri) {
      // no uri available
      returnResponse(resp, url, req.query);
      promise.resolve();
      return promise;
   }

   var options = {
      uri: eUri,
      method: 'GET',
      headers: {
         'User-Agent': USER_AGENT
      }
   };

   requestEmbeddingInfo(url, options, resp, req, promise);

   // return promise for testing only
   return promise;
};

var requestEmbeddingInfo = function(url, options, resp, req, promise) {
   request(options, function(error, response, body) {
      if (error || !body) {
         returnResponse(resp, url, req.query, (body && JSON.parse(body)), options.eUri);
         promise.resolve('error');
         return promise;
      }
      returnResponse(resp, url, req.query, (body && JSON.parse(body)), options.eUri);
      var data = JSON.parse(body);
      promise.resolve(data);
   });
};

var calcUrl = function(embedUrl, url) {
   var eUri = false;
   if (embedUrl) {
      qryStyle = 'link provided in page';
      eUri = embedUrl;
   } else {

      var providerUrl = calcUrl_directToProviders(url);
      if (providerUrl) {
         qryStyle = 'provider';
         eUri = providerUrl;
      } else {
         if (isNoembeddable(url)) {
            qryStyle = 'noembed';
            eUri = NOEMBED_URL_PREFIX + url;
         }
      }
   }
   return eUri;
};

var faviconFromUrl = function(url) {
   var bits = /^(https?:\/\/)?([^\/]*)/.exec(url);

   var actDomain = bits[bits.length - 1];

   return FAVICON_URL_PREFIX + actDomain;
};

var calcUrl_directToProviders = function(url, inp) {
   url = url.replace('https:', 'http:');
   var providers = inp || providersCache;
   var queryUrl = false;

   _.forEach(providers, function(value) {
      var name = value.provider_name;
      var endpoints = value.endpoints;
      _.forEach(endpoints, function(ep) {
         var embedUrl = ep.url;
         var hasSchemes = !!ep.schemes;
         if (hasSchemes) {
            _.forEach(ep.schemes, function(schs) {
               var regex = new RegExp(schs.replace('*', '.*'));
               if (regex.test(url)) {
                  queryUrl = embedUrl;
               }
               return !queryUrl;
            }
        );
         } else {
            var regex = new RegExp(value.provider_url + '*', 'gi');
            if (regex.test(url.replace('*', '.*'))) {
               queryUrl = embedUrl;
            }
         }
         return !queryUrl;
      });
      return !queryUrl;
   });
   if (queryUrl) {
      queryUrl = queryUrl + '?maxwidth=300&maxheight=420&format=json&url=' + url;
      queryUrl = queryUrl.replace('{format}', 'json');
   }

   return queryUrl;
};

var isNoembeddable = function(url, noemeddableList) {
   var res = false;
   var providers = noemeddableList || providerData.noembeddableProviders;
   _.forEach(providers, function(value) {
      var patterns = value.patterns;
      _.forEach(patterns, function(pattern) {
         var regExp = new RegExp(pattern);
         if (regExp.test(url)) {
            res = true;
         }
         return !res;
      });
      return !res;
   });
   return res;
};

var showProviders = function(req, resp) {
   providersCache.updated = 'default';
   resp.json(providersCache).end();
};

var removeProtocol = function(url) {
   return url.replace(HTTP_S_REGEXP, '');
};

var returnResponse = function(resp, url, qry, data, eUri) {
   if (!data) {
      data = {
         'error': 'no matching providers found'
      };
   }
   data.untouched = _.cloneDeep(data);
   !data.url && (data.url = (url || ''));
   !data.description && (data.description = qry.desc || '');
   !data.title && (data.title = qry.title || (url && removeProtocol(url)));

   data.width = data.width || MAX_WIDTH;
   data.height = data.height || MAX_HEIGHT;

   data.hasDesc = qry.hasDesc;
   data.eUri = eUri;
   data.hasLink = qry.hasLink;
   data.qryStyle = qryStyle;
   data.favicon = faviconFromUrl(url);

   resp.status(200).json(data);
};

// EXPORTS

module.exports = {
   oembed: oembed,
   calcUrl_directToProviders: calcUrl_directToProviders,
   isNoembeddable: isNoembeddable,
   showProviders: showProviders,
   fallbackEmbedUrl: function(url) {
      fallbackEmbedUrl = url;
   }
};

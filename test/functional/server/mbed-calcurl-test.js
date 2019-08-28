'use strict';

var should = require('should');

var nock = require('nock');
var providers = require('../dummy-providers');
var _ = require('lodash');
var debug = require('debug')('mbed-test');
require('node-promise');
var mbed = require('../../../src/server/mbed');

describe('calc url', function() {

   var findQueryUrl_directToProviders = function(options) {
      var targetUrl = options.targetUrl;
      var queryUrl = options.queryUrl;
      var done = options.done;

      var res = mbed.calcUrl_directToProviders(targetUrl, providers.providers);

      if (queryUrl) {
         res.should.equal(queryUrl + '?maxwidth=300&maxheight=420&format=json&url=' + targetUrl);
      } else {
         res.should.equal(false);
      }
      done();
   };

   it('http. url to be sent to provider, without schema', function(done) {
      findQueryUrl_directToProviders({
         targetUrl: 'http://www.youtube.com/hkhkjhdsfkjh',
         queryUrl: 'http://unknown-host.oo/oembed',
         done: done
      });
   });

   it('http. url to be sent to provider, with schema', function(done) {
      findQueryUrl_directToProviders({
         targetUrl: 'http://ifttt.com/recipes/hhhhh',
         queryUrl: 'http://unknown-host.oo/oembed',
         done: done
      });
   });

   it('http. url to be sent to provider, with multiple schemas. 1st schema', function(done) {
      findQueryUrl_directToProviders({
         targetUrl: 'http://www.flickr.com/photos/aPhoto',
         queryUrl: 'http://unknown-host.oo/oembed',
         done: done
      });
   });

   it('http. url to be sent to provider, with multiple schemas. 2nd schema', function(done) {
      findQueryUrl_directToProviders({
         targetUrl: 'http://flic.kr/p/aPhoto',
         queryUrl: 'http://unknown-host.oo/oembed',
         done: done
      });
   });

   it('fix wildcard format', function(done) {
      findQueryUrl_directToProviders({
         targetUrl: 'http://www.funnyordie.com/videos/video',
         queryUrl: 'http://www.funnyordie.com/oembed.json',
         done: done
      });
   });

   it('unembeddable url - should return false', function(done) {
      findQueryUrl_directToProviders({
         targetUrl: 'kjhdsfkhkjhsdfkjhsfd',
         queryUrl: undefined,
         done: done
      });
   });
});

describe('calc url - ask noembed', function() {
   it('find a valid one - 1', function(done) {
      var res = mbed.isNoembeddable('http://xkcd.com/1234/', providers.noembed_providers);
      res.should.equal(true);
      done();
   });
   it('find a valid one - 2', function(done) {
      var res = mbed.isNoembeddable('http://xkcd.com/7/', providers.noembed_providers);
      res.should.equal(true);
      done();
   });
   it('find a valid one - second in list', function(done) {
      var res = mbed.isNoembeddable('https://soundcloud.com/7/8/', providers.noembed_providers);
      res.should.equal(true);
      done();
   });
   it('find a valid one - in list of patterns - 1st', function(done) {
      var res = mbed.isNoembeddable('https://flic.kr/p/7', providers.noembed_providers);
      res.should.equal(true);
      done();
   });
   it('find a valid one - in list of patterns - 2nd and last', function(done) {
      var res = mbed.isNoembeddable('https://www.flickr.com/p/7', providers.noembed_providers);
      res.should.equal(true);
      done();
   });
   it('find not find an invalid one - 2', function(done) {
      var res = mbed.isNoembeddable('http://noSuchUrl.com/7/', providers.noembed_providers);
      res.should.equal(false);
      done();
   });
});

'use strict';

// jscs:disable maximumLineLength

var should = require('should');

var MockExpressRequest = require('mock-express-request');
var MockExpressResponse = require('mock-express-response');
var HttpStatus = require('http-status-codes');
var nock = require('nock');
var _ = require('lodash');
var debug = require('debug')('mbed-test');
require('node-promise');
var mbed = require('../../../src/server/mbed');

describe('Given a url, try to make it embeddable - ', function() {
   var req;
   var res;

   before(function() {
      nock('.*').get('/.*').reply(600);
   });

   beforeEach(function() {
      req = new MockExpressRequest({
         //url: '/board/1234',
         //method: 'POST',
         cookies: {user_id: 'andrew', userProfile: JSON.stringify({user_id: 'andrew'})},
         query: {}
      });

      res = new MockExpressResponse({});

   });

   describe('we can pass the url in directly, from the head/alternate attribute on the actual page', function() {
      it('embed url provided, and it works', function(done) {
         var expectation = nock('http://thing.here')
             .get('/embed')
             .query(true)
                .reply(200, {
                   title: 'this is the title',
                   type: 'rich',
                   html: 'here is the body'
                });
         makeRequest({
            embedUrl: 'http://thing.here',
            url: 'https://xkcd.com/1629/',
            expectedTitle: 'this is the title',
            expectedBody: 'here is the body',
            expectedStatus: HttpStatus.OK,
            done: done
         });

         expectation.isDone();
      });

      it('only provide embed url, and it works', function(done) {
         var expectation = nock('https://vimeo.com/api/oembed.json?url=https%3A%2F%2Fvimeo.com%2F147365861')
             .get('/embed')
             .query(true)
                .reply(200, {
                   title: 'this is the title',
                   type: 'rich',
                   html: 'here is the body'
                });
         makeRequest({
            embedUrl: 'https://vimeo.com/api/oembed.json?url=https%3A%2F%2Fvimeo.com%2F147365861',
            url: undefined,
            expectedTitle: 'this is the title',
            expectedBody: 'here is the body',
            expectedStatus: HttpStatus.OK,
            done: done
         });

         expectation.isDone();
      });
   });

   describe('url is embeddable', function() {

      it('is not embeddable, and uses url as title', function(done) {
         var expectation = nock('https://noembed.com')
             .get('/embed')
             .query(true)
                .reply(200, {
                   title: 'this is the title',
                   type: 'rich',
                   html: 'here is the body'
                });
         makeRequest({
            url: 'https://xkcd.com/1629/',
            expectedTitle: 'xkcd.com/1629/',
            expectedBody: 'here is the body',
            expectedStatus: HttpStatus.OK,
            done: done
         });

         expectation.isDone();
      });
   });

   describe('handles utter junk', function() {
      it('junk url', function(done) {
         makeRequest({
            url: 'this is not a url',
            expectedTitle: 'this is not a url',
            expectedBody: 'this is not a url',
            expectedStatus: HttpStatus.OK,
            done: done
         });
      });
      it('undefined url should use expected title', function(done) {
         makeRequest({
            url: undefined,
            expectedTitle: 'this is not a url',
            expectedBody: 'this is not a url',
            expectedStatus: HttpStatus.OK,
            done: done
         });
      });
      it('empty query list should still pass somethingback', function(done) {
         makeRequest({
            embedUrl: undefined,
            url: undefined,
            expectedTitle: 'no url provided',
            expectedBody: 'no url provided',
            expectedStatus: HttpStatus.OK,
            done: done
         });
      });
   });

   describe('url may not embeddable. We still want to make it pretty.', function() {
      describe('use a title, from a param, or a manipulation of the url', function() {
         it('pass in a title parameter for use in the embedded frame', function(done) {
            makeRequest({
               url: 'http://unknown.com',
               expectedTitle: 'some unknown',
               expectedBody: 'some unknown',
               expectedStatus: HttpStatus.OK,
               done: done
            });
         });

         it('if title NOT available, use the url, http', function(done) {
            makeRequest({
               url: 'http://unknown.com',
               expectedTitle: 'unknown.com',
               expectedBody: 'unknown.com',
               expectedStatus: HttpStatus.OK,
               done: done
            });
         });

         it('if title NOT available, use the url, https', function(done) {
            makeRequest({
               url: 'https://unknown.com',
               expectedTitle: 'unknown.com',
               expectedBody: 'unknown.com',
               expectedStatus: HttpStatus.OK,
               done: done
            });
         });
      });
   });

   var makeRequest = function(parameters) {
      var url = parameters.url;
      var expectedTitle = parameters.expectedTitle;
      var expectedBody = parameters.expectedBody;
      var statusCode = parameters.expectedStatus;
      var done = parameters.done;
      var embedUrl = parameters.embedUrl;

      req.query.embedUrl = embedUrl;
      req.query.url = url;
      req.query.title = expectedTitle;

      mbed.oembed(req, res).then(function() {
         should.exist(req);
         should.exist(res);
         res.statusCode.should.equal(statusCode);
         var body = JSON.parse(res._getString());
         body.title.should.equal(expectedTitle);
         done();
      });
   };
});

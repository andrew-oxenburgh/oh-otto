'use strict';

require('should');

var art = require('../../../public/js/ob-articulate').ohOttoArticulate();

describe('isUrl() - do I contain an http/s protocol?', function() {

   it('MATCH -> captures protocols, case insensitive', function(done) {
      areMatches([
          'httPs://hello.com',
          'http://hello.com'
      ]);
      done();
   });

   it('NO MATCH -> non strings, and empty', function(done) {
      areNotMatches([
          1,
          0,
          '',
          null
      ]);
      art.isUrl('https://').should.equal(false);
      art.isUrl('http://').should.equal(false);

      done();
   });

   it('NO MATCH -> protocols only', function(done) {
      areNotMatches([
          'http://',
          'https://'
      ]);
      done();
   });

   it('NO MATCH -> contains a protocol, but not at beginning', function(done) {
      areNotMatches([
          'g   http://ffff',
          'h   https://kkkk'
      ]);
      done();
   });

   it('NO MATCH -> is a url, but no protocol', function(done) {
      areNotMatches(['cnn.com']);
      done();
   });

   it('NO MATCH -> contains new line', function(done) {
      areNotMatches([
          'http://kjhskdjfhkjhdsfkjh.com\nsome more',
          'line 1\nline 2'
      ]);
      done();
   });

   var areMatches = function(urls) {
      var i = 0;
      for (; i < urls.length; i++) {
         art.isUrl(urls[i]).should.equal(true, urls[i] + ' should be a match');
      }
   };

   var areNotMatches = function(urls) {
      var i = 0;
      for (; i < urls.length; i++) {
         art.isUrl(urls[i]).should.equal(false, urls[i] + ' false match');
      }
   };

});


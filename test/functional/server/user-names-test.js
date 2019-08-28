'use strict';

var store = require('../../../src/server/store');
require('should');

describe('user name rules', function() {

   it('should be more than 5 characters', function() {
      store.test.usernameValidator('a').should.be.False();
      store.test.usernameValidator('a2').should.be.False();
      store.test.usernameValidator('a23').should.be.False();
      store.test.usernameValidator('a234').should.be.False();
      store.test.usernameValidator('a2345').should.be.False();
      store.test.usernameValidator('a23456').should.be.True();
   });

   it('should accept letters, numbers, @ and "."', function() {
      store.test.usernameValidator('aaaaaa').should.be.True();
      store.test.usernameValidator('AAAAAA').should.be.True();
      store.test.usernameValidator('a23456').should.be.True();
      store.test.usernameValidator('a1234567').should.be.True();
      store.test.usernameValidator('aAbB1234@@@...').should.be.True();
   });

   it('must start with a letter', function() {
      store.test.usernameValidator('1aaaaaa').should.be.False();
      store.test.usernameValidator('1a23456').should.be.False();
      store.test.usernameValidator('1a1234567').should.be.False();
      store.test.usernameValidator('1aAbB1234@@@...').should.be.False();
   });

   it('should not accept other letters', function() {
      store.test.usernameValidator('andNo Spaces').should.be.False();
      store.test.usernameValidator('aaaaaa<').should.be.False();
   });

   it('should accept ascii only', function() {
      store.test.usernameValidator('aaaaaaÊ').should.be.False();
   });

   it('should accept an email address', function() {
      store.test.usernameValidator('here.is.an@email.com').should.be.True();
   });

});

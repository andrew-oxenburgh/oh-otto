'use strict';

var debug = require('debug')('oh-otto:r:r-articulate');
var assert = require('assert');

var makeRequest = require('../util/make-bookmark-url-request').makeBookmarkUrlRequest;
var art = require('@andrew.oxenburgh/articulate')(makeRequest);
var urlToJson = art.urlToOtto.articulate;
var assert = require('assert');

var articulate = function(req, res) {
   var url = req.query.url;
   debug('articulate', url);
   var prm = urlToJson(url);
   prm
        .then(function(data) {
           return res.json(data).end();
        })
        .catch(function(err) {
           return res.status(400).end();
        })
    ;
};

module.exports = function(app) {
   app.get('/a/articulate-url', articulate);
};

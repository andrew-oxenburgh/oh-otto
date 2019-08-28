'use strict';

var openGraph = require('open-graph');
var assert = require('assert');
var debug = require('debug')('oh-otto:open-graph');

var myOpenGraph = function(req, res) {
   var url = req.query.url;
   debug('looking for ' + url);
   openGraph(url, function(err, data) {
      assert.ifError(err);
      debug(data);
      return res.json(data).end();
   });
};

module.exports = function(app) {
   app.get('/a/open-graph', myOpenGraph);
};

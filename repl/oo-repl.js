'use strict';

var debug = require('debug')('oh-otto:repl');

debug = console.log.bind();

var repl = require('repl');

require('./oo-repl-commands');

var replServer = repl.start({
    prompt: 'oh-otto > '
});

debug('repl started');

console.log('here i am');

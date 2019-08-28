#!/usr/bin/env bash

echo "==================="
echo "running server lint"

# serverside only, and test scripts
jshint --config ./qa/jshint.server.json --reporter=node_modules/jshint-stylish \
test/functional/**/*.js \
test/runtime/*.js \
test/*.js \
src/server/*.js \
src/util/*.js \
packages/js-diff/src/*.js \
packages/js-diff/test/*.js \
repl/*.js \

echo "running browser lint"

# browser, esversion 5
jshint --config ./qa/jshint.browser.json public/js/*.js \

echo "ran lint on server and browser code"
echo "==================================="

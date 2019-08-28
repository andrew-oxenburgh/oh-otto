#!/usr/bin/env bash

set -e

echo 'testing main'
mocha --spec Reporter test/**/*-test.js

echo 'testing js-diff'
pushd packages/js-diff
mocha test
popd


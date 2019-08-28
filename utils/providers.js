var _ = require('lodash');

var providers = require('../node/default-providers');

var aggregation = {};

console.log('start');
_.forEach(providers.providers, function(value, key, collection) {
    aggregation[value.provider_name] = {
        provider_name: value.provider_name,
        direct: value
    };
});

_.forEach(providers.noembeddableProviders, function(value, key, collection) {
    if (!aggregation[value.name]) {
        aggregation[value.name] = {};
    }
    aggregation[value.name].provider_name = value.name;
    aggregation[value.name].noembed = value;
});

console.log('finish');

_.forEach(aggregation, function(value) {
    console.log(value.provider_name);
    if (value.direct && value.direct.endpoints) {
        _.forEach(value.direct.endpoints, function(value) {
            console.log('\t direct:\t' + value.url + '\t' + (value.schemes ? value.schemes.join('\t') : '\t'));
        });
    }
    value.noembed && console.log('\t noembed:\t' + value.noembed.patterns.join('\t'));
});


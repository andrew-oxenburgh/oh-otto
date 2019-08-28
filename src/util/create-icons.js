'use strict';

var svg_to_png = require('svg-to-png');
var Promise = require('bluebird');
var rename = Promise.promisify(require('fs').rename);

var createJpgWithSize = function(sz) {
   var origName = 'Daschund_Without_Green';
   return svg_to_png.convert('./images/originals/' +
           origName +
            '.svg', './public/build/images', {
               compress: true,
               defaultWidth: sz,
               defaultHeight: sz,
               optimizationLevel: 9
            })
        .then(function() {
           var from = './public/build/images/' + origName + '.png';
           var to = './public/build/images/' + 'Dcsh' + sz + '.png';
           return rename(from, to);
        })
        .catch(function(err) {
           console.log(err);
        });
};

createJpgWithSize(16)
    .then(()=> {
       return createJpgWithSize(19);
    })
    .then(()=> {
       return createJpgWithSize(32);
    })
    .then(()=> {
       return createJpgWithSize(48);
    })
    .then(()=> {
       return createJpgWithSize(64);
    })
    .then(()=> {
       return createJpgWithSize(128);
    })
    .then(()=> {
       return createJpgWithSize(128);
    })
    .then(()=> {
       return createJpgWithSize(512);
    })
    .then(()=> {
       return createJpgWithSize(50);
    })
    .then(()=> {
       return createJpgWithSize(75);
    })
    .then(()=> {
       return createJpgWithSize(100);
    })
    .then(()=> {
       return createJpgWithSize(150);
    })
    .then(()=> {
       return createJpgWithSize(200);
    })
    .then(()=> {
       return createJpgWithSize(300);
    })
    .then(()=> {
       return createJpgWithSize(400);
    })
    .catch(err=> {
       console.log(err);
    });

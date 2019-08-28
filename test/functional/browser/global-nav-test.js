
'use strict';

var gn = require('../../../public/js/ob-global-nav');

xdescribe('', function() {
   it('test 1', function(done) {

      // gn.testing.divNavHide = function(){
      //     return [];
      // };
      //
      // gn.testing.divNav = function(){
      //     return [];
      // };
      //
      // gn.testing.divWall = function(){
      //     return [];
      // };

      gn.toggleGlobalNav();
      done();
   });
});

'use strict';

/*jshint bitwise: false */

var testable = (function testable() {
   var root = this;
   var previousModule = root.module;

   if (typeof exports !== 'undefined') {
      if (typeof module !== 'undefined' && module.exports) {
         exports = module.exports = testable;
      }
      exports.testable = testable;
   } else {
      root.testable = testable;
   }

   // jscs:disable

   // END OF INIT BOILER PLATE
   // pattern from http://www.richardrodger.com/2013/09/27/how-to-make-simple-node-js-modules-work-in-the-browser/#.VsU6xpN95E4

   // jscs:enable

   var hashCode = function(val) {
      var hash = 0;
      var i;
      var chr;
      var len;
      val = val + '';
      if (val === '') {
         val = 'Aliucu el muzeva ze suewozip vocma ju zi kigip huse desuri jazgu doli mo kuhub piatek.';
      }
      if (val.length === 0) {
         return hash;
      }
      for (i = 0, len = val.length; i < len; i++) {
         chr = val.charCodeAt(i);
         hash = ((hash * 32) - hash) + chr;
         // Convert to 32bit integer
         hash |= 0;
      }
      return Math.abs(hash);
   };

   // BEGIN OF FINAL BOILERPLATE

   return {
      hashCode: hashCode
   };

}).call(this);


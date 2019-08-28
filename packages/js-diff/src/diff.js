'use strict';

/*jshint node:true*/

/*******
 * JS-Diff by Gary Chisholm
 * Additional work and testing by Andrew Oxenburgh
 * All we're going to do is read in two objects. Iterate over them and return the differences.
 * Distributed under the MIT license.
 * The software is provided "as is", without warranty of any kind, express or implied.
 ******/
function getDiff(obj1, obj2, ign) {
   var diff = false;

   var obj1Val;
   var obj2Val;

   var ignored = ign ? Array.from(ign) : [];

   // Iterate over obj1 looking for removals and differences in existing values
   var isIgnored = function(key) {
      return ignored.indexOf(key) > -1;
   };
   for (var key in obj1) {
      if (isIgnored(key)) {
          // ignored
      } else if (obj1.hasOwnProperty(key) && typeof obj1[key] !== 'function') { // TODO: Could probably be a helper function
         obj1Val = obj1[key];
         obj2Val = obj2[key];

         // If property exists in obj1 and not in obj2 then it has been removed
         if (!(key in obj2)) {
            if (!diff) {
               diff = {};
            }
            diff[key] = {
               from: obj1Val,
               to: null // using null to specify that the value is empty in obj2
            };
         }

         // If property is an object then we need to recursively go down the rabbit hole
         else if (typeof obj1Val === 'object') {
            var tempDiff = getDiff(obj1Val, obj2Val, ignored);
            if (tempDiff) {
               if (!diff) {
                  diff = {};
               }
               diff[key] = tempDiff;
            }
         }

         // If property is in both obj1 and obj2 and is different
         else if (obj1Val !== obj2Val) {
            if (!diff) {
               diff = {};
            }
            diff[key] = {
               from: obj1Val,
               to: obj2Val
            };
         }
      }
   }

   // Iterate over obj2 looking for any new additions
   for (key in obj2) {
      if (isIgnored(key)) {
          // ignored
      } else if (obj2.hasOwnProperty(key) && typeof obj2[key] !== 'function') {
         obj1Val = obj1[key];
         obj2Val = obj2[key];

         if (!(key in obj1)) {
            if (!diff) {
               diff = {};
            }
            diff[key] = {
               from: null,
               to: obj2Val
            };
         }
      }
   }

   return diff;
}

module.exports = getDiff;

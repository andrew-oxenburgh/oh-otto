'use strict';

var HIDE = 'hide';
var SHOW = 'show';

var divNav = function() {
   return $('#global-nav');
};

var divWall = function() {
   return $('#wall');
};

var divNavHide = function() {
   return $('#global-nav.hide');
};

var ssAvail = (function storageAvailable(type) {
   var storage;
   var x;
   try {
      storage = window[type];
      x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
   }
   catch (e) {
      return false;
   }
})('sessionStorage');

var storeNavMenuState = function(state) {
   if (ssAvail) {
      sessionStorage.oo_navState = state;
   }
};

var setNavState = function(state) {
   if (ssAvail) {
      state = state || sessionStorage.oo_navState || HIDE;
      sessionStorage.oo_navState = state;
      userMessage(5, 'sessionState available');
   } else {
      state = state || HIDE;
      userMessage(5, 'sessionState unavailable');
   }
   var currState = (state === HIDE) ? SHOW : HIDE;

   divNav().addClass(state).removeClass(currState);
   divWall().addClass(currState).removeClass(state);
   storeNavMenuState(state);
};

var newNavMenuState = function() {
   var $globalHidden = divNavHide();
   var isCurrentlyHidden = !!($globalHidden && $globalHidden.length);
   return isCurrentlyHidden ? SHOW : HIDE;
};

var toggleGlobalNav = function() {
   setNavState(newNavMenuState());
};

// module.exports = {
//    toggleGlobalNav: toggleGlobalNav,
//    setNavState: setNavState,
//    testing: {
//        divWall: divWall,
//        divNav: divNav,
//        divNavHide: divNavHide
//    }
// };

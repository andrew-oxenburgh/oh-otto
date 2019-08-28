'use strict';

oo.lock = 0;
oo.LOCAL_STORAGE = 'local';
oo.USER_TOKEN = 'userToken';

oo.boardBackground = 'swirl';
oo.cookieOptions = {expires: 7, path: '/'};
oo.SAVE_THROTTLE_WAIT = 5 * 1000;
oo.timer = null;
oo.pageCreationDate = new Date().toTimeString();
oo.saveOn = true;
oo.BOARD_STORAGE = 'oo-board-storage';
oo.userMessagesOn = true;

oo.GRID_WIDTH = 10;
oo.GRID_HEIGHT = 10;

oo.maxZoom = 10;
oo.minZoom = 20;

oo.clearBrowser = function() {
   oo.saveOn = false;
   $.removeCookie(oo.USER_TOKEN);
   $.removeCookie('userProfile');
   localStorage.clear();
   sessionStorage.clear();
};

oo.state = function() {
   console.log('localStorage => ' + oo.BOARD_STORAGE + '>>', localStorage.getItem(oo.BOARD_STORAGE));
};

oo.CARD_DRAGGING = {
   appendTo: '.oo-cell',
   scope: 'cells',
   stop: function() {
      $(this).css({
         position: 'relative',
         top: 0,
         left: 0
      });
   }
};

var nextPasteCell = function() {
   var pos = nextPastePosition();
   return '.cell-' + pos.left + '-' + pos.top;
};

function nextPastePosition() {
   var possibleClassPositions = $($('.oo-cell:not(.oo-cell-occupied)')[0]).attr('class');
   return getPosFromListOfClasses(possibleClassPositions);
}

var getPosFromListOfClasses = function(clazzes) {
   var top = -1;
   var left = -1;
   _(clazzes).split(' ').each(function(val) {
      var coordinates = val.match('^cell-(\\d+)-(\\d+)$');
      if (coordinates) {
         left = coordinates[1] || -1;
         top = coordinates[2] || -1;
         // console.log('coordinates', left, top);
      }
   });
   return {top: top, left: left};
};


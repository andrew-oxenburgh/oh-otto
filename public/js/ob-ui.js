'use strict';

var MENU_WIDTH = '14em';

oo.debugInfo = function() {
   return JSON.stringify(boardDefinition(), null, 1);
};

function rm(ele) {
   $(ele).closest('.oo-card').fadeOut(1000, deleteCard);
}

function deleteCard() {
   var $card = $(this);
   removeCardFromCell($card);
   $card.remove();
   userMessage(1, 'removed card');
   dirtyBoard();
   showCardCount();
}

function showPublicBoards() {
   $.getJSON('/static-boards', function(boards, status) {
      if (status !== 'success') {
         $('<span>error in getting static boards - ' + status + '</span>>')
            .appendTo('#oo-static-boards');
         return;
      }
      var $changeBoard = $('.oo-static-boards');
      for (var i = 0; i < boards.length; i++) {
         var board = boards[i];
         var $boardItem =
            $('<li><a href="#"><i class="fa fa-fixed-width "></i>' +
               board +
               '</a></li>');
         $boardItem.appendTo($changeBoard);
      }
      $changeBoard.find('a').click(function() {
         var url = '/static-board/' + $(this).text();
         oo.boardName = 'static-board-' + $(this).text();
         clearAllCards();
         queryOhOtto(url);
      });

   });

   $('i[class*="oo-background-menu-"]').addClass('fa fa-fw');
}

function showSignoutDlg() {
   var $signOut = $('#cw-check-signout');
   var $dw = $('#dialog-wrapper');
   moveCardToTop($signOut);
   $dw.show();
   $signOut.show();

   // can click outside dlg and will cancel the dialog
   $('#dialog-wrapper').click(function(evt) {
      $('#cw-check-signout, #dialog-wrapper').hide();
   });
   $('#cw-check-signout').click(function(evt) {
      return false;
   });
}

function underlay(underlay) {
   var $body = $('#oo-body');
   oo.boardBackground = underlay || 'blank';
   removeBackgroundClasses($body);

   $body.addClass('background-' + oo.boardBackground);

   $('i[class^="oo-background-menu-"]').removeClass('fa-check');
   $('.oo-background-menu-' + oo.boardBackground).addClass('fa fa-fw fa-check');
   return false;
}

function removeBackgroundClasses($body) {
   if ($body.attr('class') === undefined) {
      return;
   }
   $body.attr('class').split(' ').filter(function(c) {
      if (c.indexOf('background-') === 0) {
         $body.removeClass(c);
      }
   });
}

function userMessage(level, msg) {
   if (!oo.userMessagesOn) {
      return;
   }
   if (level > oo.userMessageLevel) {
      return;
   }

   var currentLogBucket = 'log-bucket-' + Math.floor(new Date().getTime() / oo.userMessageBucketTime);

   var $log = $('#log');
   var $logBucket = $log.find('div.' + currentLogBucket);
   if ($logBucket.length < 1) {
      var logBucketDiv = sprintf('<div class="%s"></div>', currentLogBucket);
      $logBucket = $(logBucketDiv);
      $logBucket.appendTo($log);
      $logBucket.show();
   }
   var message = sprintf('<p>%s</p>', msg);

   $logBucket.append($(message));

   $log.show();

   oo.timer = setTimeout(function() {
      $logBucket.hide({
         easing: 'linear',
         effect: 'blind',
         duration: 1000,
         complete: function() {
            $logBucket.detach();
         }
      });
   }, oo.userMessageDisplayTime);

}

oo.wipeBoard = function() {
   $('.oo-card').each(function(ndx, val) {
      removeCardFromCell($(val));
   });
};

oo.noop = function() {
};

oo.configZoomButtons = function() {
   var newFontSize = parseInt($('.oo-grid').css('font-size')) || 16;
   console.log('size is ' + newFontSize);
   var $zoomOut = $('.oo-zoom-out');
   var $zoomIn = $('.oo-zoom-in');
   $zoomIn.off('click.zoomIn');
   $zoomOut.off('click.zoomOut');
   if (newFontSize < oo.maxZoom) {
      console.log('too big');
      $zoomOut.css({color: 'grey'});
      $zoomIn.on('click.zoomIn', oo.zoomIn);
      $zoomIn.css({color: 'black'});

   } else if (newFontSize > oo.minZoom) {
      console.log('too small');
      $zoomIn.css({color: 'grey'});
      $zoomOut.on('click.zoomOut', oo.zoomOut);
      $zoomOut.css({color: 'black'});
   } else {
      console.log('in bounds');
      $zoomIn.on('click.zoomIn', oo.zoomIn);
      $zoomOut.on('click.zoomOut', oo.zoomOut);
      $zoomIn.css({color: 'black'});
      $zoomOut.css({color: 'black'});
   }
};

oo.zoom = function(incr) {
   var $grid = $('.oo-grid');
   var fontSize = parseInt($grid.css('font-size'));
   if (incr) {
      this.zoomTo(fontSize + incr + 'px', $grid);
      oo.configZoomButtons();
   } else {
      return fontSize + 'px';
   }
};

oo.zoomTo = function(fontSize) {
   var $grid = $('.oo-grid');
   $grid.css({'font-size': fontSize});
   // dirtyBoard();
};

oo.zoomIn = function() {
   oo.zoom(1);
   return false;
};

oo.zoomOut = function() {
   oo.zoom(-1);
   return false;
};

oo.showTabbable = function() {
   _($('*[tabindex]')).each(function(ndx) {
         var $ndx = $(ndx);
         var clz = $ndx.attr('class');
         var tb = $ndx.attr('tabindex');
         if (parseInt(tb) >= 1) {
            console.log(tb + ', ' + clz);
         }
      }
   );
};

$('body').attr('tabindex', 2000);
$('#wall').attr('tabindex', 1);

var directionSwap = false;

$('body').focus(function() {
   $('#wall').focus();
});


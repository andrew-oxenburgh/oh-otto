'use strict';

$(function() {
   try {
      initOhOtto();
   } catch (e) {
      console.log(e);
      alert('error in init: check console---');
      throw e;
   }
});

var initOhOtto = function() {
   oo.userMessagesOn = true;

   $('.splashscreen').show();

   // trelloAuth(false);
   // forIos();
   showAuthenticatedOrOtherwise();
   initMarkdown();
   navAnchorsUntabbable();
   // loadHints();
   initUiStuff();

   startup();
   createCard_afterDropOrPasteOrDblClick();

   $('#oo-nav-menu').menu();

   var $cwBody = $('#oo-body');

   setTimeout(function() {
      $('.splashscreen').hide();
   }, 1000);
   userMessage(5, 'js ' + oo.pageCreationDate);

   if (oo.showFocus) {
      $('body *').focus(function() {
         userMessage(5, 'focus moved ' + $(this).html());
      });
   }
   oo.socket = io();
   oo.socket.on('connect', function() {
      userMessage(1, 'connected');
   });
   oo.socket.on('disconnect', function() {
      userMessage(1, 'disconnected');
   });
   oo.socket.on('refresh', function() {
      oo.indicateSyncing();
      reloadCards();
      userMessage(1, 'refreshed');
   });

   $('a').attr('onerror', 'epic(this)');

   oo.configZoomButtons();
};

var createGrid = function() {
   var $grid = $('.oo-grid');
   for (var col = 0; col < oo.GRID_WIDTH; col++) {
      var $col = $('<div class="oo-col"/>');
      for (var row = 0; row < oo.GRID_HEIGHT; row++) {
         var $cell = $('<div class="oo-cell" tabindex="-1"/>');
         var posClass = 'cell-' + col + '-' + row;
         $cell.addClass(posClass);
         $col.append($cell);
      }
      $grid.append($col);
   }

   $('.oo-cell').droppable();

   enableCells();
};

function onlySendWhenAuthorized() {
   var tkn = $.cookie(oo.USER_TOKEN);
   if (tkn) {
      $.ajaxSetup({
         'beforeSend': function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + tkn);
         }
      });
   } else {
      return false;
   }
}

function initDialog(sel) {
   $(sel).dialog({autoOpen: false, dialogClass: 'cw-dialog'}).find('a :not(.cw-button)').prop({
      target: '_blank',
      tabindex: 1
   });
}

function loadHints() {
   $('#hints').html(marked(oo.HINTS));
}

function navAnchorsUntabbable() {
   $('.nav * a, .nav * input').prop('tabindex', '-1');
}

function initUiStuff() {
   $('#log').hide();
   $('.save').css({opacity: 0});

   // initDialog('#cw-check-signout');
   // initDialog('#cw-restore-demo');
   // initDialog('#cw-about');
   // initDialog('#cw-debug');
   // initDialog('#oo-settings');
   // initDialog('.oo-duplicate-board');
   // initDialog('.oo-wipe-board');
   // initDialog('#oo-board-config');
   // initDialog('#oo-auth-config');

   // $('.cw-ok').button();
   // $('.cw-close').button();

   // $('.toolbar').tooltip({
   //     position: {my: "left middle", at: "right bottom"}
   // });

   // $('#oo-new-board').buttonset();
   $('.oo-menu').click(
        function() {
           $('.oo-menu ul').hide('slow');
        }
    );

   $('.oo-rename-save').click(function() {
      var name = $('.oo-rename-text').val();
      oo.boardName = name;
      $('.oo-board-title').text(oo.boardName);
   });
   // showSavedBoards();
   // setNavState();
   // showPublicBoards();

   showWindowSize();

   $(window).resize(showWindowSize);

   $('.submenu-body').hide();

   $('.submenu-header > a').click(function() {
      $(this).parent().find('.submenu-body').animate({height: 'toggle'}, 1000);
   });

   window.addEventListener('storage', function(e) {
      if (e.storageArea['oo-board-storage']) {
         oo.saveOn = false;
         oo.userMessagesOn = false;
         reloadCards();
         oo.saveOn = true;
      }
   });
   createGrid();
}

var showWindowSize = function() {
   var w = $(window).width();
   var h = $(window).height();
   $('.oo-window-size').text(w + ' X ' + h);
};

function showCardCount() {
   var cnt = $('.oo-card').size();
   $('.oo-note-count').text('card count = ' + cnt);

   var $iframes = $('iframe');
   var ifs = $iframes && $iframes.size();
   var sandboxes = $('iframe[sandbox]');
   var ifsWithSandbox = sandboxes ? sandboxes.size() : 0;

   $('.oo-window-size').html('total iframes = ' + ifs +
       '<br> iframes with sandbox =' + ifsWithSandbox);
}

function initMarkdown() {
   marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
   });
}

function showAuthenticatedOrOtherwise() {
   oo.lock = new Auth0Lock(oo.auth0_clientId, oo.auth0_domain);
   var token = $.cookie('userToken');
   if (token) {
      var profile = $.cookie('userProfile');
      if (profile) {
         userProfile = JSON.parse(profile);
         signedIn();
      } else {
         userProfile = null;
         signedOut();
      }
   } else {
      signedOut();
   }
}

function startup() {
   reloadCards();
}

function epic(c) {
   c.onerror = '';
   c.src = '/ohOtto256px.png';
}

oo.hashCode = testable.hashCode;


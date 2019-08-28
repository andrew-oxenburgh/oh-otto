'use strict';

function showCards(json) {
   if (json === undefined || json.cards === undefined) {
      return;
   }

   var underlayName = json.background || oo.boardBackground;
   underlay(underlayName);

   clearAllCards();

   json.cards.forEach(function(ele, ndx) {
      var name = ele.name || 'unnamed';
      var text = ele.content || '';
      var left = 0;
      var top = 0;
      if (ele.extent) {
         left = _.toInteger(ele.extent.left);
         top = _.toInteger(ele.extent.top);
      }

      var unknownPos =  _.isUndefined(ele.extent) || _.isUndefined(ele.extent.left) || _.isUndefined(ele.extent.top);
      if (unknownPos) {
         console.log('unknown pos');
         var pos = nextPastePosition();
         left = pos.left;
         top = pos.top;
      }

      var card = createCardWithIdAndText(name, text);
      var addr = $('.cell-' + left + '-' + top);

      card.css({
         position: 'relative',
         top: 0,
         left: 0
      });

      // console.log('ndx', ndx);
      // add 2, 1 for non-zero, and 1 for the wall
      var tabIndex  = ele.index || (ndx + 2);
      // console.log('tabIndex', tabIndex);
      card.attr('tabindex',  tabIndex);

      putCardInCell(card, addr);
      if (ele.style) {
         if (ele.style.name) {
            card.addClass('oo-note-' + ele.style.name);
         }
         if (ele.style.css) {
            card.css(ele.style.css);
         }
      } else {
         card.addClass('oo-note-default');
      }
   });
   oo.userMessagesOn = true;
}

function queryOhOtto(url) {
   $.ajax({
      cache: false,
      url: url,
      'beforeSend': function(xhr) {
         var sample = (url.indexOf('samples/') === 0);
         var staticBoards = (url.indexOf('/static-board/') === 0);
         if (sample || staticBoards) {
            return true;
         }
         var tkn = $.cookie(oo.USER_TOKEN);
         if (tkn) {
            xhr.setRequestHeader('Authorization',
                'Bearer ' + tkn);
         } else {
            return false;
         }
      }
   }, function(data) {
      clearAllCards();
      showCards(data);
   });
}

function readCards() {
   var tkn = $.cookie(oo.USER_TOKEN);
   if (isSignedIn() && tkn) {
      $('.wall').show();
      $('.welcome').hide();
      $.ajax({
         type: 'GET',
         url: '/board/r/' + oo.boardName,
         cache: false,
         success: function(rcvd_data) {
            loadCards(rcvd_data);
         },
         error: function(err) {
            alert('error in reading - ' + JSON.stringify(err));
         },
         beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + tkn);
         },
         complete: function() {
            oo.saveOn = true;
         }
      });
   } else {
      $('.wall').hide();
      $('.welcome').show();
   }
}

function reloadCards() {
   oo.userMessagesOn = false;
   oo.saveOn = false;
   var json = readCards();
   oo.userMessagesOn = true;
}

function loadCards(json) {
   oo.zoomTo(json.zoom);

   if (json === null) {
      var url = 'samples/instructions';
      queryOhOtto(url);
      return;
   }
   showCards(json);
   if (json.cards.length < 1) {
      oo.boardName = oo.boardName || 'default';
      underlay();
      var $card = createCard(newCardName(), 'default');
      putCardInCell($card);
   }
}

function loadDemo() {
   clearAllCards();
   queryOhOtto('samples/instructions');
}

function clearAllCards() {
   oo.userMessagesOn = false;
   $('.oo-card').each(deleteCard);
   oo.userMessagesOn = true;
}

function readLocally() {
   var crds = lsAvailable && localStorage.getItem(oo.BOARD_STORAGE);
   if (crds) {
      return JSON.parse(crds);
   } else {
      return LOCAL_INIT_BOARD;
   }
}

var lsAvailable;
try {
   var fail;
   var uid;
   uid = new Date();
   (lsAvailable = window.localStorage).setItem(uid, uid);
   fail = (lsAvailable.getItem(uid) != uid);
   lsAvailable.removeItem(uid);
   fail && (lsAvailable = false);
} catch (exception) {
}

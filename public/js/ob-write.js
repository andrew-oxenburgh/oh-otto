'use strict';

function manualSave() {
   userMessage(2, 'saving');
   _.throttle(persist, 5000);
   userMessage(1, 'saved');
}

function cardToText(card) {
   var styleName = card.prop('class').split(' ').find(function(cls) {
      return cls.indexOf('oo-note-') === 0;
   });

   if (!styleName) {
      styleName = 'plain';
   } else {
      styleName = styleName.substr('oo-note-'.length);
   }

   var clazzes = card.closest('.oo-cell').attr('class');

   var pos = getPosFromListOfClasses(clazzes);

   var crd = {
      content: card.data(oo.LOCAL_STORAGE),
      extent: {left: pos.left, top: pos.top},
      style: {
         name: styleName, css: ''
      }
   };
   return crd;
}

function boardDefinition() {
   var sv = [];
   $('.oo-card').sort(sortByTabIndex).each(function() {
      var div = $(this);
      var crd = cardToText.call(this, div);
      sv.push(crd);
   });
   var toSave = {};
   toSave.background = oo.boardBackground;
   toSave.cards = sv;
   toSave.zoom = oo.zoom();
   //toSave.extent = {left: left, top: top, height: height, width: width};

   return toSave;
}

var throttledPersist = _.throttle(persist, oo.SAVE_THROTTLE_WAIT, {leading: false, trailing: true});

oo.indicateSyncing = function() {
   $('.save')
       .animate({opacity: 1}, 500)
       .animate({opacity: 0}, 500);
};

function persist() {
   if (oo.saveOn) {
      var toSave = boardDefinition();
      writeCards(toSave);
      // userMessage(1, 'saving board');
      oo.indicateSyncing();
      // $('.icon-save').fadeOut(200).fadeIn(500).fadeOut(200).fadeIn(500);
   }
}

var dirtyBoard = function() {
   if (oo.saveOn) {
      userMessage(2, 'board dirty');
      $('.save').css({color: 'black', opacity: 1});
      throttledPersist();
   }
};

function sortByTabIndex(a, b) {
   return parseInt(a.getAttribute('tabindex')) > parseInt(b.getAttribute('tabindex'));
}

function writeLocally(board) {
   if (board === null || board.cards === null || board.cards.length === 0) {
      localStorage.setItem(oo.BOARD_STORAGE, '{"cards":[]}');
      return;
   }
   localStorage.setItem(oo.BOARD_STORAGE, JSON.stringify(board));
}

function writeCards(board) {
   console.log('WRITING', board);
   var tkn = $.cookie(oo.USER_TOKEN);
   if (isSignedIn() && tkn) {
      $.ajax({
         type: 'POST',
         url: '/board/w/' + oo.boardName,
         data: JSON.stringify(board),
         cache: false,
         contentType: 'application/json; charset=utf-8',
         dataType: 'json',
         complete: function() {
            userMessage(2, 'wrote to the cloud');
         },
         failure: function(err) {
            alert('error saving' + JSON.stringify(err));
         },
         beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + tkn);
         }
      });
   } else {
      writeLocally(board);
      userMessage(2, 'wrote locally');
   }
}


'use strict';

function newCardName() {
   var rnd = Math.floor(Math.random() * 100000);
   var cardName = 'card-' + rnd;
   return cardName;
}

function createCard(x, y) {
   userMessage(2, 'creating card');
   var pos = nextPastePosition();
   x = x || pos.left;
   y = y || pos.top;
   var card = createCardWithIdAndText(newCardName(), '');
   card.addClass('oo-note-greencard');
   editCard(card);
   card.focus();
   return card;
}

function allNoteClasses(index, css) {
   return (css.match(/(^|\s)oo-note-\S+/g) || []).join(' ');
}

function switchStyleTo(card, cls) {
   card.find(cls).click(function() {
      card.removeClass(allNoteClasses).addClass(cls.substr(1, (cls.length - '-menu'.length - 1)));
      card.find('.oo-settings ul').fadeOut().clearQueue();

      card.find('a[class^="oo-note-"]').find('i').removeClass('fa-check');
      card.find(cls).find('i').addClass('fa-check');
      userMessage(5, 'change style');
      dirtyBoard();
   });
}

function createCardWithIdAndText(id, text) {
   var x = 0;
   var y = 0;
   var card = $('<div class=\'ui-widget-content draggable oo-card\'>' +
       '<div class=\'card-content\' tabindex=\'-1\'>' +
       '<p></p>' +
       '<textarea class=\'editor\' placeholder=\'text here: try markup, a great way to format your notes\'></textarea>' +
       '<a class="card-content-remove" href="#!" onclick="rm(this);return false;" tabindex="-1" title="remove card"><i class="fa fa-fw fa-trash"></i></a>' +
       '<a class="card-content-edit" href="#!" onclick="editCard(this);return false;" tabindex="-1" title="edit card"><i class="fa fa-fw fa-edit" tabindex="-1"></i></a>' +
       '</div>')
       .prop('id', id).appendTo('body');
   // jscs:enable
   handleCardSettingsMenu();

   var p = card.find('p');
   ohOttoArticulate.modifyMarkdown(p, text, card);

   var edtr = card.find('.editor');
   edtr_addKeys(card, p, edtr);

   card.draggable(oo.CARD_DRAGGING);

   card.on('dragstart', function() {
      card.focus();
   });

   card.mousedown(function(evnt) {
      if (!card.is(':focus')) {
         card.data('mdown', true);
      }
   });

   // card.find('.editor').keypress(function (evt) {
   //     evt.stopPropagation();
   // });
   //
   card.keypress(function(evt) {
      //if (evt.keyCode === 10 || evt.keyCode === 13) {
      //  editCard($(evt.target));
      //}
   });

   card.dblclick(function(evt) {
      editCard($(evt.target));
      return false;
   });

   p.blur(function(evt) {
      p.unbind('keypress');
   });

   var content = card.find('.card-content');
   card.css({position: 'relative', left: 0, top: 0, opacity: 0.1}).animate({opacity: 1}, 100);

   card.click(function() {
      card.focus();
   });

   // on card select:
   // 1. show card nav
   // 2. bring card to top
   card.focus(function() {
      card.find('.nav').css({opacity: 1});
      card.removeData('mdown');
   });

   // hide card nav bar
   card.blur(function() {
      card.find('.nav').css({opacity: 0.1});
      card.find('.oo-settings ul').hide();
   });

   switchStyleTo(card, '.oo-note-bluecard-menu');
   switchStyleTo(card, '.oo-note-yellowcard-menu');
   switchStyleTo(card, '.oo-note-greencard-menu');
   switchStyleTo(card, '.oo-note-plain-menu');
   switchStyleTo(card, '.oo-note-contentonly-menu');
   switchStyleTo(card, '.oo-note-trello-menu');
   switchStyleTo(card, '.oo-note-plain-white-menu');
   switchStyleTo(card, '.oo-note-plain-red-menu');

   showCardCount();

   userMessage(5, 'added card');

   putCardInCell(card);

   card.closest('.oo-cell').attr('tabindex', -1);
   card.attr('tabindex', 5);
   card.find('i, a, img').attr('tabindex', -1);

   return card;
}

var handleCardSettingsMenu = function() {
   var $oo = $('.oo-settings');
   $oo.click(
        function() { //appearing on click
           $('ul', this).fadeIn().clearQueue();
           var that = $(this);
           $(document).click(function() {
              that.find('ul').fadeOut();
           }, that);
        }
    );
};

function moveCardToTop(card) {
   var zIndexes = $('.oo-card').map(function() {
      return Number($(this).css('z-index') || 0);
   });
   var maxIndex = Math.max.apply(null, zIndexes.get());
   card.css({'z-index': maxIndex + 1});
}

function clpData(event, types) {
   for (var i = 0; i < types.length; i++) {
      var type = types[i];
      var data = event.originalEvent.clipboardData.getData(type);
      if (data) {
         return data;
      }
   }
   return 'unknown type';
}

function trxData(event, types) {
   for (var i = 0; i < types.length; i++) {
      var type = types[i];
      console.log('trxData = ' + type);
      var data = event.originalEvent.dataTransfer.getData(type);
      if (data) {
         return data;
      }
   }
   return 'unknown type';
}

function createCard_afterDropOrPasteOrDblClick() {
   var $cw = $('.oo-cell');

   $cw.bind('dblclick', handleDblClick);
   $('body').bind('paste', handlePaste);

   function handleDblClick(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      var here = $(this);
      var text = '';

      var card = createCardWithIdAndText(newCardName(), 'title\n\ncontent');
      editCard(card);
      card.focus();
      card.addClass('oo-note-greencard');
      putCardInCell(card, $(evt.target));

   }

   function handlePaste(evt) {
      userMessage(1, 'pasted a card');
      var inTextArea = evt.target.nodeName === 'TEXTAREA';
      if (inTextArea) {
         userMessage(5, 'paste in text area');
         return true;
      }

      evt.stopPropagation(); // Stops some browsers from redirecting.
      evt.preventDefault();
      var text = '';

      if (evt.originalEvent.clipboardData) {
         text = clpData(evt, ['text']);
      } else if (evt.originalEvent.dataTransfer) {
         text = trxData(evt, ['text']);
      }

      var card = createCardWithIdAndText(newCardName(), text);
      putCardInCell(card);
      card.addClass('oo-note-greencard');
      card.focus();
      return false;
   }
}

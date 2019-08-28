'use strict';

function editCard(trgt) {
   trgt = $(trgt);
   var card = trgt.closest('.oo-card');
   moveCardToTop(card);
   var p = card.find('p');
   var edtr = card.find('.editor');

   edtr.val(card.data(oo.LOCAL_STORAGE));
   p.hide(1);
   moveCardToTop(card);
   card.addClass('oo-card-focused');
   edtr.show(10, function() {
      //card.find('.nav').show()
      //card.focus();
      edtr.focus();
   });
}

function edtr_addKeys(card, p, edtr) {

   edtr.blur(function() {
      var val = edtr.val();
      ohOttoArticulate.modifyMarkdown(p, val, card);
      edtr.hide(1);
      p.show(1);
      card.focus();
      card.removeClass('oo-card-focused');
      userMessage(2, 'edited card');
      dirtyBoard();
   });

   edtr.keypress(function(evt) {
      //if ((evt.keyCode === 10 || evt.keyCode === 13) && (evt.ctrlKey || evt.metaKey)) {
      //  var pos = card.position();
      //  edtr.blur();
      //  var newcard = createCard(pos.left + 50, pos.top + 50);
      //}
   });

   edtr.keydown(function(evt) {
      //if (evt.keyCode === 27) {
      //  edtr.hide();
      //  p.show();
      //  p.focus();
      //}
   });

   edtr.bind('click dblclick', function(e) {
      e.stopPropagation();
   });

}


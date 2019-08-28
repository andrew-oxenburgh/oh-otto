'use strict';

var putCardInCell = function($card, $cell) {
   var currCell = $card.closest('.oo-cell');
   if (currCell.length > 0) {
      // already somewhere
      var $currCell = $(currCell);
      if (!$cell || $cell.is($currCell)) {
         //not moved or can't move
         return;
      }
      // make us available again
      $currCell.removeClass('oo-cell-occupied');
      $currCell.addClass('oo-card-free');
   }

   if (!$cell || $cell.hasClass('oo-cell-occupied')) {
      $cell = $(nextPasteCell());
   }

   $card.appendTo($cell);
   // $card.addClass('oo-cell-occupied');
   $card.removeClass('oo-card-free');
   $card.css({
      top: 0,
      left: 0
   });

   $cell.addClass('oo-cell-occupied');
   enableCells();
};

var removeCardFromCell = function($card) {
   var currCell = $card.closest('.oo-cell');
   if (currCell) {
      var $currCell = $(currCell);
      $currCell.removeClass('oo-cell-occupied');
      $currCell.addClass('oo-card-free');
      $card.detach();
   }
   enableCells();
};

var enableCells = function() {
   $('.oo-cell.oo-cell-occupied').droppable('disable');
   $('.oo-cell:not(.oo-cell-occupied)').droppable('enable');
   $('.oo-cell:not(.oo-cell-occupied)').droppable({
      tolerance: 'intersect',
      scope: 'cells',
      activeClass: 'oo-cell-occupiable',
      hoverClass: 'oo-cell-hover',
      accept: '.oo-card',
      drop: function(evt, ui) {
         var $cell = $(this);
         var $card = $(ui.draggable);
         putCardInCell($card, $cell);
         dirtyBoard();
      }
   });
};

$('.oo-cell').droppable();
enableCells();

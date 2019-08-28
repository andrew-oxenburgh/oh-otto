'use strict';

function trelloAuth(interactive) {
   console.log('authing');
   try {
      Trello.authorize({
         type: 'popup',
         name: 'Oh, Otto',
         persist: true,
         interactive: !!interactive,
         scope: {
            read: true
         },
         expiration: '30days',
         success: trelloAuthSuccess,
         error: trelloAuthFail
      });
   } catch (e) {
      console.log('Trello unavailable!!' + JSON.stringify(e));
   }
}

function trelloToggleAuth() {
   if (Trello.authorized()) {
      trelloDeauth();
   } else {
      trelloAuth(true);
   }
}

function trelloDeauth() {
   Trello.deauthorize();
   trelloShow();
   return false;
}

var trelloAuthSuccess = function() {
   trelloShow();
   return false;
};

var trelloAuthFail = function() {
   console.log('Failed trello authentication');
};

function trelloShow() {
   if (Trello.authorized()) {
      Trello.get('/member/me', function(data) {
         $('.trello-fullname').text(data.fullName || '');
         $('.trello-username').text(data.username || '');
         $('.trello-toggle').text('trello sign out');
      }, function(err) {
        });
   } else {
      $('.trello-fullname').text('');
      $('.trello-username').text('');
      $('.trello-toggle').text('trello sign in');
   }
}

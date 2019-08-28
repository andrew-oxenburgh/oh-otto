'use strict';

function isSignedIn() {
   return !!$.cookie('userToken');
}

function toggleSignedState() {
   $('#cw-checkout-signout, #dialog-wrapper').hide();
   manualSave();
   if (isSignedIn()) {
      $.removeCookie('userToken', oo.cookieOptions);
      $.removeCookie('userProfile', oo.cookieOptions);
      signedOut();
      $('#after-signout, #dialog-wrapper').show(1).delay(3000).hide(1);
      reloadCards();
   } else {
      oo.lock.show({scope: 'openid profile'}, function(err, profile, token) {
         if (err) {
            // Error callback
            alert('There was an error:' + err);
            signedOut();
         } else {
            $.cookie(oo.USER_TOKEN, token, oo.cookieOptions);
            $.cookie('userProfile', JSON.stringify(profile), oo.cookieOptions);
            userProfile = profile;
            signedIn();
            $('#after-signin, #dialog-wrapper').show(1).delay(3000).hide(1);
         }
         reloadCards();
      });
   }
}

function signedIn() {
   var pic = $('#user-picture');
   var icn = $('.cw-signin-or-out');
   var nck = $('.nick');

   if (userProfile) {
      nck.text(' - ' + userProfile.nickname);
      pic.attr('src', userProfile.picture);
      pic.show();
      icn.hide();
   } else {
      nck.text(' - no signed in');
      pic.hide();
      icn.show();
   }
   $('#cw-checkout-signout').hide();
   $('#wall').show();
   $('.welcome').hide();
}

var userProfile = null;

function signedOut() {
   var $pic = $('#user-picture');
   var $signed = $('.cw-signin-or-out');
   $('.nick').text('');

   $pic.hide();
   $pic.attr('src', '');
   $signed.show();
   $signed.removeClass('fa-signout').addClass('fa-signin');
   $('#wall').hide();
   $('.welcome').show();
}

<style>
body{
  background:whitesmoke;
  font-family:monofur;
}

h1{
  font-variant:small-caps;
}

h2{
  margin-left: 10px;
}

h3{
  margin-left: 20px;;
}

h4{
  margin-left: 30px;
}

ul, li{
  margin-left: 25px;
    list-style:none;
}

@media screen and (max-width:3200px){
    body{
    -webkit-column-count: 4; 
    -moz-column-count: 4; 
    column-count: 4;
    }
}

@media screen and (max-width:2400px){
    body{
    -webkit-column-count: 3; 
    -moz-column-count: 3; 
    column-count: 3;
    }
}

@media screen and (max-width:1600px){
    body{
    -webkit-column-count: 2; 
    -moz-column-count: 2; 
    column-count: 2;
    }
}

@media screen and (max-width:800px){
    body{
    -webkit-column-count: 1; 
    -moz-column-count: 1; 
    column-count: 1;
    }
}

</style>

# Test Script!!

# Disable Cookies
 ## Should create a default card

# board menu shown
## otto action
<img src='../public/ohOtto256px.png' alt="otto logo" width=32 height=32/>
 - has tooltip
 - click to show info

## oh-otto title shown
 - text only. no cursor, no action

## board name shown
 - click should show backgrounds and board options
 - should not be shown if not logged on

## templates
 - should be 5
 - should be able to open all of these

## board config
 - should be able to set the background of a board, and refresh it to keep it

## trello link
![alt text](../images/trello.png "Logo Title Text 1")
 - should open trello oh-otto board in separate tab

## mark down link
 - should open mark down documentation in separate tab

## download action
![alt text](./images/debug.png "Logo Title Text 1")
 - should download the current board definition to downloads directory - named after board or public board type

## wipe action
![alt text](./images/wipeBoard.png "Logo Title Text 1")
 - should be able to wipe board
 - should be a dialog

## save action
 ![alt text](./images/save.png "Logo Title Text 1")
 - should save the current board. If logged in it should be saved in mongo, and available from another browser.

## create card action
![alt text](./images/createCard.png "Logo Title Text 1")
 - should create a new card
 - should be positioned near top left corner, and new ones should not cover old ones.


# Zooming
 - 3 buttons, larger, reset and smaller
 - should multi-click and not queue events

# Creating cards

## cards are limited in size to 140 characters. This is a core bit of oh-otto. We want small chunks here, which will link to other apps.

## _board action_ in nav bar

## double click on page
 - create a note under the cursor
 - should open in edit mode
 - should be a white lined card

## paste on page
 - not osx/safari. not osx/firefox
 - should be able to paste text on to the page.
 - where it is created is based on some rotating criteria. We don;t want every card overwriting the previous card.

## drop on page
 - should be dropped under the cursor.

# Card

## drag  card
  - should be bounded by the board
  - should line up with other boards

##  resize card
 - by dragging little pink square

## edit card
 - has text 'polite notice: max 140 characters'
 - if lots of lines, should add scroll bar to textarea
 - when finished editing, card should completely wrap the input text

## show card
### first line is a title
 - first line is a centered header

## delete card
 - should fade away

## can style a card
 - set background

# Card Contents

## links should be opened in separate window

## images should be framed like a photo

# authorization actions
## sign in action
 ![alt text](./images/signIn.png "Logo Title Text 1")
 - should take you through authorization procedure

 ## sign out
 ![alt text](./images/signIn.png "Logo Title Text 1")
 - should allow you to be signed out


# Discussions:

## Security:

 ### Using IFrames
 
 There is a concern that users may inadvertantly copy in an html or js fragment that will render that page open to XSS attack.
 
 For this reason I am wrapping _all_ content in iframes.
 
 Oh-otto uses _markdown_ which offers some protection against xss, but there is still the extensive use of embed html. This will always be wrapped in an iframe. Occasionally the html frag is sent 
 with an embedded iframe. This will be fragment displayed.

## On Opening for first time
 - Should use the 

<script src='http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
<script>

function hideTilNext(evt, tag) {
  $(evt.target).closest(tag).nextUntil(tag).toggle(200)
}

function toggleTag(tag, prevTag) {
  $(tag).click(function(evt) {
    hideTilNext(evt, tag)
    if (prevTag) {
      $(evt.target).find(prevTag).untilNext(prevTag).hide()
    }
  })
}

toggleTag('h1', 'h2')
toggleTag('h2', 'h3')
toggleTag('h3', 'h4')
toggleTag('h4', 'h5')

$('h4').nextUntil('h4').hide()
$('h3').nextUntil('h3').hide()
$('h2').nextUntil('h2').hide()
$('h1').nextUntil('h1').hide()

$('h1').show()

$('h1, h2, h3, h4, p, li').each(function(ndx, itm) {
  $itm = $(itm)
  $itm.prepend('<input type="checkbox">')
});
</script>

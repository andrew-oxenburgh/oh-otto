/*

 https://developer.chrome.com/extensions/tabs

 */

var local_url = 'http://localhost:5000';
var prod_url = 'https://cryptic-wave-1327.herokuapp.com';

function destUrl() {
   if (document.getElementById('local').checked) {
      return local_url;
   }
   return prod_url;
}

function sendToOhOtto(url) {
   document.querySelector('.message').innerHTML = 'starting';

   var url = destUrl() + '/a/bookmark/' + esc(url);
   document.querySelector('.message').innerHTML = url;
   var req = new XMLHttpRequest();
   req.withCredentials = true;
   req.open('POST', url);
   req.send();
}

function sendUrlToPath(path, url) {
   chrome.tabs.create({
      url: destUrl() + '/' + path + '?url=' + esc(url)
   });
}

function openOhOtto() {
   chrome.tabs.create({
      url: destUrl()
   });
}

function esc(str) {
   return str
      .replace(/&/g, '&amp;')
      .replace(/\?/g, '%3F')
      .replace(/>/g, '&gt;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;')
      .replace(/\//g, '%2F')
      .replace(/\:/g, '%3A')
      ;
}

document.addEventListener('DOMContentLoaded', function() {
   document.querySelector('.bm').addEventListener('click',
      function() {
         document.querySelector('.message').innerHTML = 'thingy';

         chrome.tabs.getSelected(function(tab) {
            sendToOhOtto(tab.url);
         });
      });
   document.querySelector('.open-graph').addEventListener('click',
      function() {
         chrome.tabs.getSelected(function(tab) {
            sendUrlToPath('a/open-graph', tab.url);
         });
      });
   document.querySelector('.oembed').addEventListener('click',
      function() {
         chrome.tabs.getSelected(function(tab) {
            sendUrlToPath('a/oembed', tab.url);
         });
      });
   document.querySelector('.articulate-url').addEventListener('click',
      function() {
         chrome.tabs.getSelected(function(tab) {
            sendUrlToPath('a/articulate-url', tab.url);
         });
      });
   document.querySelector('.metadata').addEventListener('click',
      function() {
         chrome.tabs.getSelected(function(tab) {
            sendUrlToPath('a/metadata', tab.url);
         });
      });
   document.querySelector('.wiki').addEventListener('click',
      function() {
         chrome.tabs.getSelected(function(tab) {
            var url = tab.url;
            var wikiRegexp = /(^https?:\/\/[A-Za-z]*.wikipedia.org)/;
            var host = url.match(wikiRegexp);
            if (!host) {
               alert('not a wiki page: ' + url);
               return;
            }

            var path = url.split('/');
            var title = path[path.length - 1].trim();
            var wikiMetaUrl = host[0] + '/w/api.php?action=query&formatversion=2&prop=extracts|pageimages|revisions&redirects=&exintro=true&exsentences=2&explaintext=true&piprop=thumbnail&pithumbsize=300' +
               '&rvprop=timestamp&format=json&titles=' + title;

            chrome.tabs.create({
               url: wikiMetaUrl
            });
         });
      });
   document.querySelector('.add-note').addEventListener('click',
      function() {
         var note = document.querySelector('.note').value;
         sendToOhOtto(note);
      });
   document.querySelector('.open-oh-otto').addEventListener('click',
      function() {
         openOhOtto();
      });
});

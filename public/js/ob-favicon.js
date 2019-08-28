'use strict';

function parseUri(str) {
   var o = parseUri.options;
   var m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str);
   var uri = {};
   var i = 14;

   while (i--) {
      uri[o.key[i]] = m[i] || '';
   }

   uri[o.q.name] = {};
   uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
      if ($1) {
         uri[o.q.name][$1] = $2;
      }
   });

   return uri;
}

// jscs:disable
parseUri.options = {
   strictMode: false,
   key: ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'],
   q: {
      name: 'queryKey',
      parser: /(?:^|&)([^&=]*)=?([^&]*)/g
   },
   parser: {
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
   }
};
// jscs:enable

function favIcon(text) {
   if (/^http(s)?:.*\./.test(text)) {
      return 'http://www.google.com/s2/favicons?domain=' + parseUri(text).host;
   }
   return false;
}

if (typeof module !== 'undefined' && module.hasOwnProperty('exports')) {
   module.exports = favIcon;
}


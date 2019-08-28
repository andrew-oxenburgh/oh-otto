'use strict';

var prependNamedProp = function($, $info, prop) {
   var $site = $info.find('.oo-url-' + prop);
   if ($site) {
      $site = $($site);
      $info.prepend($site);
   }
};
var createCardFragFromJson = function($, data) {
   var res = '<div class="oo-url">\n';
   _.forOwn(data, function(value, key) {
      if (!value) {
          // ignore
      } else if (key === 'url') {
         // ignore.
      } else if (key === 'color') {
         // ignore.
      } else if (key === 'favicon') {
         res += sprintf('\t<img class="oo-url-%s" src="%s" onerror="epic(this)"/>\n', key, value);
      } else if (key === 'site') {
         var SITE_PATTERN = '\t<a class="oo-url-%s" href="%s" target="_blank" title="open">%s</a>\n';
         res += sprintf(SITE_PATTERN, key, data.url, value);
      } else if (key === 'image') {
          // ignore
      } else {
         res += sprintf('\t<div class="oo-url-%s">%s</div>\n', key, value);
      }
   });
   res += '\t<a class="oo-url-remove" href="#!" onclick="rm(this);return false;" title="remove card"><i class="fa fa-fw fa-trash"></i></a>\n';// jscs:ignore maximumLineLength
   res += '</div>';
   var $info = $(res);
   var clr = data.color;
   if (!clr) {
      var seed = oo.hashCode(data.site || data.url || '');
      clr = randomColor({
         seed: Math.abs(seed),
         luminosity: 'light',
         hue: 'blue'
      });
      clr = tinycolor(clr).lighten(0).toHexString();
   }
   $info.css('background-color', clr);
   prependNamedProp($, $info, 'description');
   prependNamedProp($, $info, 'title');
   prependNamedProp($, $info, 'site');
   return $info;
};
var ohOttoArticulate = (function ohOttoArticulate() {
   var root = this;
   var previousModule = root.module;

   // var has_require = typeof require !== 'undefined';
   //
   // var _ = root._;
   //
   // if (typeof _ === 'undefined') {
   //     if (has_require) {
   //         _ = require('underscore');
   //     }
   //     else throw new Error('ohOttoArticulate requires underscore, see http://underscorejs.org');
   // }

   if (typeof exports !== 'undefined') {
      if (typeof module !== 'undefined' && module.exports) {
         exports = module.exports = ohOttoArticulate;
      }
      exports.ohOttoArticulate = ohOttoArticulate;
   } else {
      root.ohOttoArticulate = ohOttoArticulate;
   }

   // jscs:disable

   // END OF INIT BOILER PLATE
   // pattern from http://www.richardrodger.com/2013/09/27/how-to-make-simple-node-js-modules-work-in-the-browser/#.VsU6xpN95E4

   // jscs:enable

   function modifyMarkdown(p, val, card) {
      try {
         val = val.trim();
         if (isUrl(val)) {
            if (thirdParty_articulate(val, card)) {
               return;
            }
         }
         card.data(root.oo.LOCAL_STORAGE, val);
         p.html(root.marked(val));
      } catch (e) {
         console.log(e);
      }
      // links should open in separate tab
      modifyLinks(card);
   }

   var isUrl = function(arg) {
      // arg must be string
      if (!arg || typeof arg !== 'string') {
         return false;
      }

      // arg on single line
      if (arg.indexOf('\n') >= 0) {
         return false;
      }

      // arg begins with protocol
      return /^https?:\/\/\S+/i.test(arg);
   };

   var modifyLinks = function(card) {
      card.find('p a').prop({target: '_blank', tabindex: -1});
      card.find('a').each(function() {
         var a = $(this);
         var href = a.attr('href');
         if (isImage(href)) {
            modifyImage(a, href);
         } else {
            addFavicon(a, href);
         }
      });
   };

   var addFavicon = function(a, href) {
      var icn = root.favIcon(href);
      if (icn) {
         a.html('<img class=\'oo-url-favicon\' src=\'' + icn + '\' tabindex="-1"/>' + href);
      }
   };

   function endsWith(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
   }

   var isImage = function(href) {
      return endsWith(href, '.jpg') || endsWith(href, '-jpg') || endsWith(href, '.png');
   };

   var modifyImage = function(a, href) {
      $('<img class=\'oo-photo\' src=\'' + href + '\' tabindex=\'-1\'/>').insertAfter(a);
      a.remove();
   };

   function evernote(val, card) {
      var url = root.parseUri(val);
      if (url.host.indexOf('evernote.com') >= 0) {
         var path = url.path.split('/');
         var guid = path[path.length - 1];
         $.getJSON('/evernote/note/' + guid, function(note) {
            card.find('p').html(root.marked('# ' + note.title) + note.content);
         });

         card.attr('class').split(' ').filter(function(c) {
            if (c.indexOf('oo-note-') === 0) {
               card.removeClass(c);
            }
         });

         $('<img src="/evernote-logo.png" class="oo-third-party-logo"/>').appendTo(card);
         card.addClass('oo-note-evernote');
         var settingsHtml = '<a href="' + val +
             '" title="open note in evernote" target="_blank">' +
             '<i class="fa fa-fw fa-external-link"></i></a>';
         card.find('.nav .oo-settings').html(settingsHtml);
         return true;
      }
   }

   function trello(val, card) {
      var url = root.parseUri(val);
      if (url.host.indexOf('trello.com') >= 0) {
         var URL = url.path;

         URL = URL.replace('/c/', '/card/');
         URL += '?fields=name,desc';
         root.Trello.rest(
             'GET',
             URL,
                function(data) {
                   var title = data.name;
                   var p = data.desc;
                   card.find('p').html(root.marked('# ' + title + '\n\n' + p));
                   card.addClass('oo-note-trello');
                   var settingsHtml = function() {
                      return '<a href="' +
                          val +
                          '" title="open note in trello" target="_blank">' +
                          '<i class="fa fa-fw fa-external-link"></i></a>';
                   };
                   card.find('.nav .oo-settings')
                       .html(settingsHtml());
                   $('<img src="/trello-logo.png" class="oo-third-party-logo"/>').appendTo(card);
                },
                (function(i1, txt, err) {
                   card.find('p').html(root.marked('# ' + txt + '\n\n' + err + '<br/>' + URL));
                   card.addClass('oo-note-trello');
                }));
         return true;
      }
      return false;
   }

   function thirdParty_oembed(url, card) {
      var options = {
         'url': url
      };

      $.getJSON(
          '/oembed',
          options,
            function(data) {
               var cardParagraph = card.find('p');
               if (data.error) {
                  cardParagraph.html(root.marked(url));
                  modifyLinks(card);
                  return;
               }

               data.width && card.css('width', data.width + 10);
               data.height && card.css('height', data.height + 10);
               var externalLink = '<a href="' +
                   data.url + '" title="open note in ' +
                   data.provider_name +
                   '" target="_blank">' +
                   '<i class="fa fa-fw fa-external-link">' +
                   '</i></a>';
               card.find('.nav .oo-settings').html(externalLink);

               var favIconImg = '<img src="' + data.favicon +
                   '" class="oo-third-party-logo"/>';
               $(favIconImg).appendTo(card);

               if (data.html) {
                  var iframe = $('<iframe>').attr(
                        {
                           srcdoc: data.html,
                           width: data.width,
                           height: data.height,
                           scrolling: 'no'
                        }
                    );
                  cardParagraph.html(iframe);
                  cardParagraph.find('a').click(false);
                  var invisibleCss = {
                     margin: 0,
                     padding: 0,
                     //overflow: 'hidden',
                     //border: 0
                  };

                  card.css(invisibleCss);
                  cardParagraph.css(invisibleCss);
                  iframe.css(invisibleCss);
               } else {
                  //var createdCard = $('<h1>' + data.title + '</h1>' + data.description);
                  //cardParagraph.find('p').html(createdCard);
               }

            });
      return true;
   }

   function thirdParty_articulate(url, card) {

      card.html($(sprintf('<p class="oo-url-store-url">%s</p>', url)));

      card.data(root.oo.LOCAL_STORAGE, url);

      var options = {
         'url': url
      };

      $.getJSON('/a/articulate-url', options, {async: true})
          .done(
                function(data) {
                   root.marked(url);
                   var $info = createCardFragFromJson($, data);
                   card.append($info);
                   data.image && card.find('.oo-url').css('background-image', 'url("' + data.image + '")');
                })
            .fail(function(err) {
               console.log('failed getting ' + url);
            });
      return true;
   }

   // jscs:disable
   /*
    *
    author_name
    author_url
    channel_name
    channel_url
    description
    duration
    height
    html
    is_plus
    provider_name
    provider_url
    thumbnail_height
    thumbnail_url
    thumbnail_width
    title
    type
    uri
    url
    version
    video_id
    width
    *
    *
    * */
   /*
    var youtube_sample =
    {
    "author_name": "schmoyoho",
    "width": 459,
    "author_url": "https://www.youtube.com/user/schmoyoho",
    "provider_url": "https://www.youtube.com/",
    "version": "1.0",
    "thumbnail_width": 480,
    "provider_name": "YouTube",
    "thumbnail_url": "https://i.ytimg.com/vi/bDOYN-6gdRE/hqdefault.jpg",
    "height": 344,
    "thumbnail_height": 360,
    "html": "\n<div class=\"noembed-embed \">\n  <div class=\"noembed-wrapper\">\n    \n<div class=\"noembed-embed-inner noembed-youtube\">\n  \n<iframe width=\" 459\" height=\"344\" src=\"https://www.youtube.com/embed/bDOYN-6gdRE?feature=oembed\" frameborder=\"0\" allowfullscreen></iframe>\n\n</div>\n\n    <table class=\"noembed-meta-info\">\n      <tr>\n        <td class=\"favicon\"><img src=\"https://noembed.com/favicon/YouTube.png\"></td>\n        <td>YouTube</td>\n        <td align=\"right\">\n          <a title=\"http://www.youtube.com/watch?v=bDOYN-6gdRE\" href=\"http://www.youtube.com/watch?v=bDOYN-6gdRE\">http://www.youtube.com/watch?v=bDOYN-6gdRE</a>\n        </td>\n      </tr>\n    </table>\n  </div>\n</div>\n",
    "url": "http://www.youtube.com/watch?v=bDOYN-6gdRE",
    "title": "Auto-Tune the News #8: dragons. geese. Michael Vick. (ft. T-Pain)",
    "type": "video"
    }
    */
   // jscs:enable

   var youtubeContent = function(data) {
      var title = data.title;
      var img = data.thumbnail_url;
      var watch = data.url;
      var author = data.author_name;
      var auther_url = data.author_url;

      var msg = '# ' +
          title + '\n\n<a href ="' +
          watch + '" target="_blank"><img src="' +
          img + '" class="oo-embedded-img"></a>\n\n<a href="' +
          auther_url + '" target="_blank">\n\n## ' +
          author + '</a>';
      return msg;
   };

   var isYoutube = function(val) {
      var url = root.parseUri(val);
      var isYoutube = url.host.indexOf('youtube.com') >= 0;
      return isYoutube;
   };
   // jscs:disable

   /*

    VIMEO
    =====
    {
    author_name: "3DAR",
    width: 1280,
    provider_url: "https://vimeo.com/",
    thumbnail_width: 1280,
    html: " <div class="noembed-embed "> <div class="noembed-wrapper"> <div class="noembed-embed-inner noembed-vimeo"> <iframe src="https://player.vimeo.com/video/147365861" width="1280" height="534" frameborder="0" title="UNCANNY VALLEY (2015)" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> </div> <table class="noembed-meta-info"> <tr> <td class="favicon"><img src="https://noembed.com/favicon/Vimeo.png"></td> <td>Vimeo</td> <td align="right"> <a title="https://vimeo.com/channels/staffpicks/147365861" href="https://vimeo.com/channels/staffpicks/147365861">https://vimeo.com/channels/staffpicks/147365861</a> </td> </tr> </table> </div> </div> ",
    video_id: 147365861,
    url: "https://vimeo.com/channels/staffpicks/147365861",
    author_url: "https://vimeo.com/user12563589",
    version: "1.0",
    provider_name: "Vimeo",
    channel_name: "Vimeo Staff Picks",
    is_plus: "1",
    duration: 533,
    thumbnail_url: "https://i.vimeocdn.com/video/546078021_1280.jpg",
    description: "In the slums of the future, virtual reality junkies satisfy their violent impulses in online entertainment. An expert player discovers that the line between games and reality is starting to fade away. 3DAR’s latest short film explores the frightening potential of our next technological revolution. Behind the scenes coming soon! Stay connected, but not too much ;) Artwork and process in www.3dar.com CREDITS WRITTEN AND DIRECTED BY FEDERICO HELLER EXECUTIVE PRODUCERS GERMAN HELLER BRANDON MASEDA ANIMATION DIRECTOR FERNANDO MALDONADO VFX PRODUCTION DESIGNER JORGE TERESO LEAD VFX ARTIST FEDERICO CARLINI LEAD 3D ARTIST MARCO LOCOCO VISUAL EFFECTS SUPERVISOR FEDERICO HELLER DIGITAL ART DIRECTOR PABLO OLIVERA CGFX TD ALAN RINALDI PRODUCER FEDERICO HELLER VFX PRODUCTION COORDINATOR MARIA JOSE TABARES ASSISTANT DIRECTOR NAZARENO ALBA CELESTE LOIS DIRECTOR OF PHOTOGRAPHY NICOLAS TROVATO FERNANDO LORENZALE ART DIRECTOR LOLA SOSA ORIGINAL SCORE CYRILLE MARCHESSEAU MUSIC MIX RODOLPHE GERVAIS AUDIO POST BY IMPOSSIBLE ACOUSTIC BRENDAN J. HOGAN JAMIE HUNSDALE Representation: Scott Glassgold / Ground Control -- scott@groundcontrol-la.com.",
    height: 534,
    uri: "/videos/147365861",
    thumbnail_height: 534,
    type: "video",
    title: "UNCANNY VALLEY (2015)",
    channel_url: "https://vimeo.com/channels/staffpicks"
    }


    */
    
   // jscs:enable

   var vimeoContent = function(data) {
      var title = data.title || '';
      var img = data.thumbnail_url || '';
      var watch = data.url || '';
      var author = data.author_name || '';
      var auther_url = data.author_url || '';
      var desc = data.description || '';

      // jscs:disable
      var msg = '# ' + title + '\n\n<a href ="' + watch + '" target="_blank"><img src="' + img + '" class="oo-embedded-img"></a>\n\n<a href="' + auther_url + '" target="_blank">\n\n## ' + author + '</a>\n\n' + desc;
      // jscs:enable
      return msg;
   };

   var isVimeo = function(val) {
      var url = root.parseUri(val);
      return url.host.indexOf('vimeo.com') >= 0;
   };

   var embed_patterns = [
       'http://(?:www.)?xkcd.com/d+/?',
       'https?://soundcloud.com/.*/.*',
       'https?://(?:www.)?flickr.com/.*',
       'https?://flic.kr/p/[a-zA-Z0-9]+',
       'http://www.ted.com/talks/.+.html',
       'http://(?:www.)?theverge.com/d{4}/d{1,2}/d{1,2}/d+/[^/]+/?$',
       'http://.*.viddler.com/.*',
       'https?://(?:www.)?avclub.com/article/[^/]+/?$',
       'https?://(?:www.)?wired.com/([^/]+/)?d+/d+/[^/]+/?$',
       'http://www.theonion.com/articles/[^/]+/?',
       'http://yfrog.com/[0-9a-zA-Z]+/?$',
       'http://www.duffelblog.com/d{4}/d{1,2}/[^/]+/?$',
       'http://www.clickhole.com/article/[^/]+/?',
       'https?://(?:www.)?skitch.com/([^/]+)/[^/]+/.+',
       'http://skit.ch/[^/]+',
       'https?://(alpha|posts|photos).app.net/.*',
       'https?://gist.github.com/(?:[-0-9a-zA-Z]+/)?([0-9a-fA-f]+)',
       'https?://www.(dropbox.com/s/.+.(?:jpg|png|gif))',
       'https?://db.tt/[a-zA-Z0-9]+',
       'https?://[^.]+.wikipedia.org/wiki/(?!Talk:)[^#]+(?:#(.+))?',
       'http://www.traileraddict.com/trailer/[^/]+/trailer',
       'http://lockerz.com/[sd]/d+',
       'http://gifuk.com/s/[0-9a-f]{16}',
       'http://trailers.apple.com/trailers/[^/]+/[^/]+',
       'http://gfycat.com/([a-zA-Z]+)',
       'http://bash.org/?(d+)',
       'http://arstechnica.com/[^/]+/d+/d+/[^/]+/?$',
       'http://imgur.com/gallery/[0-9a-zA-Z]+',
       'http://www.asciiartfarts.com/[0-9]+.html',
       'http://www.monoprice.com/products/product.asp?.*p_id=d+',
       'http://boingboing.net/d{4}/d{2}/d{2}/[^/]+.html',
       'https?://(?:[^.]+.)?youtube.com/watch/??(?:.+&)?v=([^&]+)',
       'https?://youtu.be/([a-zA-Z0-9_-]+)',
       'https?://github.com/([^/]+)/([^/]+)/commit/(.+)',
       'http://git.io/[_0-9a-zA-Z]+',
       'https?://open.spotify.com/(track|album)/([0-9a-zA-Z]{22})',
       'https?://path.com/p/([0-9a-zA-Z]+)$',
       'http://www.funnyordie.com/videos/[^/]+/.+',
       'http://(?:www.)?twitpic.com/([^/]+)',
       'https?://www.giantbomb.com/videos/[^/]+/d+-d+/?',
       'http://(?:www.)?beeradvocate.com/beer/profile/d+/d+',
       'http://(?:www.)?imdb.com/title/(ttd+)',
       'http://cl.ly/(?:image/)?[0-9a-zA-Z]+/?$',
       'http://clyp.it/.*',
       'http://www.hulu.com/watch/.*',
       'https?://(?:www|mobile.)?twitter.com/(?:#!/)?[^/]+/status(?:es)?/(d+)/?$',
       'https?://t.co/[a-zA-Z0-9]+',
       'https?://(?:www.)?vimeo.com/.+',
       'http://www.amazon.com/(?:.+/)?[gd]p/(?:product/)?(?:tags-on-product/)?([a-zA-Z0-9]+)',
       'http://amzn.com/([^/]+)',
       'http://qik.com/video/.*',
       'http://www.rdio.com/artist/[^/]+/album/[^/]+/?',
       'http://www.rdio.com/artist/[^/]+/album/[^/]+/track/[^/]+/?',
       'http://www.rdio.com/people/[^/]+/playlists/d+/[^/]+',
       'http://www.slideshare.net/.*/.*',
       'http://imgur.com/([0-9a-zA-Z]+)$',
       'https?://instagr(?:.am|am.com)/p/.+',
       'http://www.twitlonger.com/show/[a-zA-Z0-9]+',
       'http://tl.gd/[^/]+',
       'https?://vine.co/v/[a-zA-Z0-9]+',
       'http://www.urbandictionary.com/define.php?term=.+',
       'http://picplz.com/user/[^/]+/pic/[^/]+',
       'https?://(?:www.)?twitter.com/(?:#!/)?[^/]+/status(?:es)?/(d+)/photo/d+(?:/large|/)?$',
       'https?://pic.twitter.com/.+'];

   var isEmbedUrl = function(url) {
      var found = !!root._.find(embed_patterns, function(patt) {
         var m = url.search(patt);
         return m >= 0;
      });
      return found;
   };

   // BEGIN OF FINAL BOILERPLATE

   return {
      isUrl: isUrl,
      modifyMarkdown: modifyMarkdown
   };

}).call(this);


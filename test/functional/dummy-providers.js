var providers =
    [
        {
           'date': '20160125',
           'url': 'http://oembed.com/providers.json'
        },
        {
           'provider_name': 'IFTTT',
           'provider_url': 'http://www.ifttt.com/',
           'endpoints': [
                {
                   'schemes': [
                       'http://ifttt.com/recipes/*'
                   ],
                   'url': 'http://unknown-host.oo/oembed',
                   'discovery': true
                }
            ]
        },
        {
           'provider_name': 'xkcs',
           'provider_url': 'http://www.xkcd.com/',
           'endpoints': [
                {
                   'schemes': [
                       'http://xkcd.com/*'
                   ],
                   'url': 'http://unknown-host.oo/oembed',
                   'discovery': true
                }
            ]
        },
        {
           'provider_name': 'YouTube',
           'provider_url': 'http://www.youtube.com/',
           'endpoints': [
                {
                   'url': 'http://unknown-host.oo/oembed',
                   'discovery': true
                }
            ]
        },
        {
           'provider_name': 'Flickr',
           'provider_url': 'http://www.flickr.com/',
           'endpoints': [
                {
                   'schemes': [
                       'http://*.flickr.com/photos/*',
                       'http://flic.kr/p/*'
                   ],
                   'url': 'http://unknown-host.oo/oembed',
                   'discovery': true
                }
            ]
        },
        {
           'provider_name': 'FunnyOrDie',
           'provider_url': 'http://www.funnyordie.com/',
           'endpoints': [
                {
                   'schemes': [
                       'http://www.funnyordie.com/videos/*'
                   ],
                   'url': 'http://www.funnyordie.com/oembed.{format}'
                }
            ]
        }
    ];

var noembed_providers =
    [
        {
           'patterns': ['http://(?:www\\.)?xkcd\\.com/\\d+/?'],
           'name': 'XKCD'
        },
        {
           'patterns': ['https?://soundcloud.com/.*/.*'],
           'name': 'SoundCloud'
        },
        {
           'patterns': [
               'https?://(?:www\\.)?flickr\\.com/.*',
               'https?://flic\\.kr/p/[a-zA-Z0-9]+'
           ],
           'name': 'Flickr'
        }
    ];

module.exports = {
   providers: providers,
   noembed_providers: noembed_providers
};

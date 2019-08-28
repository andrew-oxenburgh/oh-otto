// jscs:disable


var ALL_PROVIDERS =
    [
        {
          'provider_name': 'IFTTT',
          'provider_url': 'http:\/\/www.ifttt.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/ifttt.com\/recipes\/*'
                  ],
                  'url': 'http:\/\/www.ifttt.com\/oembed\/',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'YouTube',
          'provider_url': 'http:\/\/www.youtube.com\/',
          'endpoints': [
                {
                  'url': 'http:\/\/www.youtube.com\/oembed',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'Flickr',
          'provider_url': 'http:\/\/www.flickr.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/*.flickr.com\/photos\/*',
                      'http:\/\/flic.kr\/p\/*'
                  ],
                  'url': 'http:\/\/www.flickr.com\/services\/oembed\/',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'Viddler',
          'provider_url': 'http:\/\/www.viddler.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/www.viddler.com\/v\/*'
                  ],
                  'url': 'http:\/\/www.viddler.com\/oembed\/'
                }
            ]
        },
        {
          'provider_name': 'Hulu',
          'provider_url': 'http:\/\/www.hulu.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/www.hulu.com\/watch\/*'
                  ],
                  'url': 'http:\/\/www.hulu.com\/api\/oembed.{format}'
                }
            ]
        },
        {
          'provider_name': 'Vimeo',
          'provider_url': 'http:\/\/vimeo.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/vimeo.com\/*',
                      'http:\/\/vimeo.com\/groups\/*\/videos\/*',
                      'https:\/\/vimeo.com\/*',
                      'https:\/\/vimeo.com\/groups\/*\/videos\/*'
                  ],
                  'url': 'http:\/\/vimeo.com\/api\/oembed.{format}'
                }
            ]
        },
        {
          'provider_name': 'CollegeHumor',
          'provider_url': 'http:\/\/www.collegehumor.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/www.collegehumor.com\/video\/*'
                  ],
                  'url': 'http:\/\/www.collegehumor.com\/oembed.{format}',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'Embedly',
          'provider_url': 'http:\/\/api.embed.ly\/',
          'endpoints': [
                {
                  'url': 'http:\/\/api.embed.ly\/1\/oembed'
                }
            ]
        },
        {
          'provider_name': 'Portfolium',
          'provider_url': 'https:\/\/portfolium.com',
          'endpoints': [
                {
                  'schemes': [
                      'https:\/\/portfolium.com\/entry\/*'
                  ],
                  'url': 'https:\/\/api.portfolium.com\/oembed'
                }
            ]
        },
        {
          'provider_name': 'iFixit',
          'provider_url': 'http:\/\/www.iFixit.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/www.ifixit.com\/Guide\/View\/*'
                  ],
                  'url': 'http:\/\/www.ifixit.com\/Embed'
                }
            ]
        },
        {
          'provider_name': 'SmugMug',
          'provider_url': 'http:\/\/www.smugmug.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/*.smugmug.com\/*'
                  ],
                  'url': 'http:\/\/api.smugmug.com\/services\/oembed\/',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'Deviantart.com',
          'provider_url': 'http:\/\/www.deviantart.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/*.deviantart.com\/art\/*',
                      'http:\/\/*.deviantart.com\/*#\/d*',
                      'http:\/\/fav.me\/*',
                      'http:\/\/sta.sh\/*'
                  ],
                  'url': 'http:\/\/backend.deviantart.com\/oembed'
                }
            ]
        },
        {
          'provider_name': 'SlideShare',
          'provider_url': 'http:\/\/www.slideshare.net\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/www.slideshare.net\/*\/*',
                      'http:\/\/fr.slideshare.net\/*\/*',
                      'http:\/\/de.slideshare.net\/*\/*',
                      'http:\/\/es.slideshare.net\/*\/*',
                      'http:\/\/pt.slideshare.net\/*\/*'
                  ],
                  'url': 'http:\/\/www.slideshare.net\/api\/oembed\/2',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'WordPress.com',
          'provider_url': 'http:\/\/wordpress.com\/',
          'endpoints': [
                {
                  'url': 'http:\/\/public-api.wordpress.com\/oembed\/',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'chirbit.com',
          'provider_url': 'http:\/\/www.chirbit.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/chirb.it\/*'
                  ],
                  'url': 'http:\/\/chirb.it\/oembed.{format}',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'nfb.ca',
          'provider_url': 'http:\/\/www.nfb.ca\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/*.nfb.ca\/film\/*'
                  ],
                  'url': 'http:\/\/www.nfb.ca\/remote\/services\/oembed\/',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'Scribd',
          'provider_url': 'http:\/\/www.scribd.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/www.scribd.com\/doc\/*'
                  ],
                  'url': 'http:\/\/www.scribd.com\/services\/oembed\/'
                }
            ]
        },
        {
          'provider_name': 'Dotsub',
          'provider_url': 'http:\/\/dotsub.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/dotsub.com\/view\/*'
                  ],
                  'url': 'http:\/\/dotsub.com\/services\/oembed'
                }
            ]
        },
        {
          'provider_name': 'Animoto',
          'provider_url': 'http:\/\/animoto.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/animoto.com\/play\/*'
                  ],
                  'url': 'http:\/\/animoto.com\/oembeds\/create'
                }
            ]
        },
        {
          'provider_name': 'Rdio',
          'provider_url': 'http:\/\/rdio.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/*.rdio.com\/artist\/*',
                      'http:\/\/*.rdio.com\/people\/*'
                  ],
                  'url': 'http:\/\/www.rdio.com\/api\/oembed\/'
                }
            ]
        },
        {
          'provider_name': 'MixCloud',
          'provider_url': 'http:\/\/mixcloud.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/www.mixcloud.com\/*\/*\/'
                  ],
                  'url': 'http:\/\/www.mixcloud.com\/oembed\/'
                }
            ]
        },
        {
          'provider_name': 'Clyp',
          'provider_url': 'http:\/\/clyp.it\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/clyp.it\/*',
                      'http:\/\/clyp.it\/playlist\/*'
                  ],
                  'url': 'http:\/\/api.clyp.it\/oembed\/',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'Screenr',
          'provider_url': 'http:\/\/www.screenr.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/www.screenr.com\/*\/'
                  ],
                  'url': 'http:\/\/www.screenr.com\/api\/oembed.{format}'
                }
            ]
        },
        {
          'provider_name': 'FunnyOrDie',
          'provider_url': 'http:\/\/www.funnyordie.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/www.funnyordie.com\/videos\/*'
                  ],
                  'url': 'http:\/\/www.funnyordie.com\/oembed.{format}'
                }
            ]
        },
        {
          'provider_name': 'Poll Daddy',
          'provider_url': 'http:\/\/polldaddy.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/*.polldaddy.com\/s\/*',
                      'http:\/\/*.polldaddy.com\/poll\/*',
                      'http:\/\/*.polldaddy.com\/ratings\/*'
                  ],
                  'url': 'http:\/\/polldaddy.com\/oembed\/'
                }
            ]
        },
        {
          'provider_name': 'Ted',
          'provider_url': 'http:\/\/ted.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/ted.com\/talks\/*'
                  ],
                  'url': 'http:\/\/www.ted.com\/talks\/oembed.{format}'
                }
            ]
        },
        {
          'provider_name': 'VideoJug',
          'provider_url': 'http:\/\/www.videojug.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/www.videojug.com\/film\/*',
                      'http:\/\/www.videojug.com\/interview\/*'
                  ],
                  'url': 'http:\/\/www.videojug.com\/oembed.{format}'
                }
            ]
        },
        {
          'provider_name': 'Sapo Videos',
          'provider_url': 'http:\/\/videos.sapo.pt',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/videos.sapo.pt\/*'
                  ],
                  'url': 'http:\/\/videos.sapo.pt\/oembed'
                }
            ]
        },
        {
          'provider_name': 'Official FM',
          'provider_url': 'http:\/\/official.fm',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/official.fm\/tracks\/*',
                      'http:\/\/official.fm\/playlists\/*'
                  ],
                  'url': 'http:\/\/official.fm\/services\/oembed.{format}'
                }
            ]
        },
        {
          'provider_name': 'HuffDuffer',
          'provider_url': 'http:\/\/huffduffer.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/huffduffer.com\/*\/*'
                  ],
                  'url': 'http:\/\/huffduffer.com\/oembed'
                }
            ]
        },
        {
          'provider_name': 'Shoudio',
          'provider_url': 'http:\/\/shoudio.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/shoudio.com\/*',
                      'http:\/\/shoud.io\/*'
                  ],
                  'url': 'http:\/\/shoudio.com\/api\/oembed'
                }
            ]
        },
        {
          'provider_name': 'Moby Picture',
          'provider_url': 'http:\/\/www.mobypicture.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/www.mobypicture.com\/user\/*\/view\/*',
                      'http:\/\/moby.to\/*'
                  ],
                  'url': 'http:\/\/api.mobypicture.com\/oEmbed'
                }
            ]
        },
        {
          'provider_name': '23HQ',
          'provider_url': 'http:\/\/www.23hq.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/www.23hq.com\/*\/photo\/*'
                  ],
                  'url': 'http:\/\/www.23hq.com\/23\/oembed'
                }
            ]
        },
        {
          'provider_name': 'Cacoo',
          'provider_url': 'https:\/\/cacoo.com',
          'endpoints': [
                {
                  'schemes': [
                      'https:\/\/cacoo.com\/diagrams\/*'
                  ],
                  'url': 'http:\/\/cacoo.com\/oembed.{format}'
                }
            ]
        },
        {
          'provider_name': 'Dipity',
          'provider_url': 'http:\/\/www.dipity.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/www.dipity.com\/*\/*\/'
                  ],
                  'url': 'http:\/\/www.dipity.com\/oembed\/timeline\/'
                }
            ]
        },
        {
          'provider_name': 'Roomshare',
          'provider_url': 'http:\/\/roomshare.jp',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/roomshare.jp\/post\/*',
                      'http:\/\/roomshare.jp\/en\/post\/*'
                  ],
                  'url': 'http:\/\/roomshare.jp\/en\/oembed.{format}'
                }
            ]
        },
        {
          'provider_name': 'Dailymotion',
          'provider_url': 'http:\/\/www.dailymotion.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/www.dailymotion.com\/video\/*'
                  ],
                  'url': 'http:\/\/www.dailymotion.com\/services\/oembed'
                }
            ]
        },
        {
          'provider_name': 'Crowd Ranking',
          'provider_url': 'http:\/\/crowdranking.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/crowdranking.com\/*\/*'
                  ],
                  'url': 'http:\/\/crowdranking.com\/api\/oembed.{format}'
                }
            ]
        },
        {
          'provider_name': 'CircuitLab',
          'provider_url': 'https:\/\/www.circuitlab.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'https:\/\/www.circuitlab.com\/circuit\/*'
                  ],
                  'url': 'https:\/\/www.circuitlab.com\/circuit\/oembed\/',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'Geograph Britain and Ireland',
          'provider_url': 'https:\/\/www.geograph.org.uk\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/*.geograph.org.uk\/*',
                      'http:\/\/*.geograph.co.uk\/*',
                      'http:\/\/*.geograph.ie\/*',
                      'http:\/\/*.wikimedia.org\/*_geograph.org.uk_*'
                  ],
                  'url': 'http:\/\/api.geograph.org.uk\/api\/oembed'
                }
            ]
        },
        {
          'provider_name': 'Geograph Germany',
          'provider_url': 'http:\/\/geo-en.hlipp.de\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/geo-en.hlipp.de\/*',
                      'http:\/\/geo.hlipp.de\/*',
                      'http:\/\/germany.geograph.org\/*'
                  ],
                  'url': 'http:\/\/geo.hlipp.de\/restapi.php\/api\/oembed'
                }
            ]
        },
        {
          'provider_name': 'Geograph Channel Islands',
          'provider_url': 'http:\/\/channel-islands.geograph.org\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/*.geograph.org.gg\/*',
                      'http:\/\/*.geograph.org.je\/*',
                      'http:\/\/channel-islands.geograph.org\/*',
                      'http:\/\/channel-islands.geographs.org\/*',
                      'http:\/\/*.channel.geographs.org\/*'
                  ],
                  'url': 'http:\/\/www.geograph.org.gg\/api\/oembed'
                }
            ]
        },
        {
          'provider_name': 'Quiz.biz',
          'provider_url': 'http:\/\/www.quiz.biz\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/www.quiz.biz\/quizz-*.html'
                  ],
                  'url': 'http:\/\/www.quiz.biz\/api\/oembed',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'Quizz.biz',
          'provider_url': 'http:\/\/www.quizz.biz\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/www.quizz.biz\/quizz-*.html'
                  ],
                  'url': 'http:\/\/www.quizz.biz\/api\/oembed',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'Coub',
          'provider_url': 'http:\/\/coub.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/coub.com\/view\/*',
                      'http:\/\/coub.com\/embed\/*'
                  ],
                  'url': 'http:\/\/coub.com\/api\/oembed.{format}'
                }
            ]
        },
        {
          'provider_name': 'SpeakerDeck',
          'provider_url': 'https:\/\/speakerdeck.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/speakerdeck.com\/*\/*',
                      'https:\/\/speakerdeck.com\/*\/*'
                  ],
                  'url': 'https:\/\/speakerdeck.com\/oembed.json',
                  'discovery': true,
                  'formats': [
                      'json'
                  ]
                }
            ]
        },
        {
          'provider_name': 'Alpha App Net',
          'provider_url': 'https:\/\/alpha.app.net\/browse\/posts\/',
          'endpoints': [
                {
                  'schemes': [
                      'https:\/\/alpha.app.net\/*\/post\/*',
                      'https:\/\/photos.app.net\/*\/*'
                  ],
                  'url': 'https:\/\/alpha-api.app.net\/oembed',
                  'formats': [
                      'json'
                  ]
                }
            ]
        },
        {
          'provider_name': 'YFrog',
          'provider_url': 'http:\/\/yfrog.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/*.yfrog.com\/*',
                      'http:\/\/yfrog.us\/*'
                  ],
                  'url': 'http:\/\/www.yfrog.com\/api\/oembed',
                  'formats': [
                      'json'
                  ]
                }
            ]
        },
        {
          'provider_name': 'Instagram',
          'provider_url': 'https:\/\/instagram.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/instagram.com\/p\/*',
                      'http:\/\/instagr.am\/p\/*',
                      'https:\/\/instagram.com\/p\/*',
                      'https:\/\/instagr.am\/p\/*'
                  ],
                  'url': 'http:\/\/api.instagram.com\/oembed',
                  'formats': [
                      'json'
                  ]
                }
            ]
        },
        {
          'provider_name': 'SoundCloud',
          'provider_url': 'http:\/\/soundcloud.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/soundcloud.com\/*'
                  ],
                  'url': 'https:\/\/soundcloud.com\/oembed'
                }
            ]
        },
        {
          'provider_name': 'On Aol',
          'provider_url': 'http:\/\/on.aol.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/on.aol.com\/video\/*'
                  ],
                  'url': 'http:\/\/on.aol.com\/api'
                }
            ]
        },
        {
          'provider_name': 'Kickstarter',
          'provider_url': 'http:\/\/www.kickstarter.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/www.kickstarter.com\/projects\/*'
                  ],
                  'url': 'http:\/\/www.kickstarter.com\/services\/oembed'
                }
            ]
        },
        {
          'provider_name': 'Ustream',
          'provider_url': 'http:\/\/www.ustream.tv',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/*.ustream.tv\/*',
                      'http:\/\/*.ustream.com\/*'
                  ],
                  'url': 'http:\/\/www.ustream.tv\/oembed',
                  'formats': [
                      'json'
                  ]
                }
            ]
        },
        {
          'provider_name': 'Daily Mile',
          'provider_url': 'http:\/\/www.dailymile.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/www.dailymile.com\/people\/*\/entries\/*'
                  ],
                  'url': 'http:\/\/api.dailymile.com\/oembed?format=json',
                  'formats': [
                      'json'
                  ]
                }
            ]
        },
        {
          'provider_name': 'Sketchfab',
          'provider_url': 'http:\/\/sketchfab.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/sketchfab.com\/models\/*',
                      'https:\/\/sketchfab.com\/models\/*',
                      'https:\/\/sketchfab.com\/*\/folders\/*'
                  ],
                  'url': 'http:\/\/sketchfab.com\/oembed',
                  'formats': [
                      'json'
                  ]
                }
            ]
        },
        {
          'provider_name': 'Meetup',
          'provider_url': 'http:\/\/www.meetup.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/meetup.com\/*',
                      'http:\/\/meetu.ps\/*'
                  ],
                  'url': 'https:\/\/api.meetup.com\/oembed',
                  'formats': [
                      'json'
                  ]
                }
            ]
        },
        {
          'provider_name': 'AudioSnaps',
          'provider_url': 'http:\/\/audiosnaps.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/audiosnaps.com\/k\/*'
                  ],
                  'url': 'http:\/\/audiosnaps.com\/service\/oembed',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'edocr',
          'provider_url': 'http:\/\/www.edocr.com',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/edocr.com\/docs\/*'
                  ],
                  'url': 'http:\/\/edocr.com\/api\/oembed'
                }
            ]
        },
        {
          'provider_name': 'RapidEngage',
          'provider_url': 'https:\/\/rapidengage.com',
          'endpoints': [
                {
                  'schemes': [
                      'https:\/\/rapidengage.com\/s\/*'
                  ],
                  'url': 'https:\/\/rapidengage.com\/api\/oembed'
                }
            ]
        },
        {
          'provider_name': 'Ora TV',
          'provider_url': 'http:\/\/www.ora.tv\/',
          'endpoints': [
                {
                  'discovery': true,
                  'url': 'https:\/\/www.ora.tv\/oembed\/*?format={format}'
                }
            ]
        },
        {
          'provider_name': 'Getty Images',
          'provider_url': 'http:\/\/www.gettyimages.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/gty.im\/*'
                  ],
                  'url': 'http:\/\/embed.gettyimages.com\/oembed',
                  'formats': [
                      'json'
                  ]
                }
            ]
        },
        {
          'provider_name': 'amCharts Live Editor',
          'provider_url': 'http:\/\/live.amcharts.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/live.amcharts.com\/*'
                  ],
                  'url': 'http:\/\/live.amcharts.com\/oembed'
                }
            ]
        },
        {
          'provider_name': 'iSnare Articles',
          'provider_url': 'https:\/\/www.isnare.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'https:\/\/www.isnare.com\/*'
                  ],
                  'url': 'https:\/\/www.isnare.com\/oembed\/'
                }
            ]
        },
        {
          'provider_name': 'Infogram',
          'provider_url': 'https:\/\/infogr.am\/',
          'endpoints': [
                {
                  'schemes': [
                      'https:\/\/infogr.am\/*'
                  ],
                  'url': 'https:\/\/infogr.am\/oembed'
                }
            ]
        },
        {
          'provider_name': 'ChartBlocks',
          'provider_url': 'http:\/\/www.chartblocks.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/public.chartblocks.com\/c\/*'
                  ],
                  'url': 'http:\/\/embed.chartblocks.com\/1.0\/oembed'
                }
            ]
        },
        {
          'provider_name': 'ReleaseWire',
          'provider_url': 'http:\/\/www.releasewire.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/rwire.com\/*'
                  ],
                  'url': 'http:\/\/publisher.releasewire.com\/oembed\/',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'They Said So',
          'provider_url': 'https:\/\/theysaidso.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'https:\/\/theysaidso.com\/image\/*'
                  ],
                  'url': 'https:\/\/theysaidso.com\/extensions\/oembed\/',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'LearningApps.org',
          'provider_url': 'http:\/\/learningapps.org\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/learningapps.org\/*'
                  ],
                  'url': 'http:\/\/learningapps.org\/oembed.php',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'ShortNote',
          'provider_url': 'https:\/\/www.shortnote.jp\/',
          'endpoints': [
                {
                  'schemes': [
                      'https:\/\/www.shortnote.jp\/view\/notes\/*'
                  ],
                  'url': 'https:\/\/www.shortnote.jp\/oembed\/',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'Embed Articles',
          'provider_url': 'http:\/\/embedarticles.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/embedarticles.com\/*'
                  ],
                  'url': 'http:\/\/embedarticles.com\/oembed\/'
                }
            ]
        },
        {
          'provider_name': 'Topy',
          'provider_url': 'http:\/\/www.topy.se\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/www.topy.se\/image\/*'
                  ],
                  'url': 'http:\/\/www.topy.se\/oembed\/',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'ReverbNation',
          'provider_url': 'https:\/\/www.reverbnation.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'https:\/\/www.reverbnation.com\/*',
                      'https:\/\/www.reverbnation.com\/*\/songs\/*'
                  ],
                  'url': 'https:\/\/www.reverbnation.com\/oembed',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'Blackfire.io',
          'provider_url': 'https:\/\/blackfire.io',
          'endpoints': [
                {
                  'schemes': [
                      'https:\/\/blackfire.io\/profiles\/*\/graph',
                      'https:\/\/blackfire.io\/profiles\/compare\/*\/graph'
                  ],
                  'url': 'https:\/\/blackfire.io\/oembed',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'Oumy',
          'provider_url': 'https:\/\/www.oumy.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'https:\/\/www.oumy.com\/v\/*'
                  ],
                  'url': 'https:\/\/www.oumy.com\/oembed',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'EgliseInfo',
          'provider_url': 'http:\/\/egliseinfo.catholique.fr\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/egliseinfo.catholique.fr\/*'
                  ],
                  'url': 'http:\/\/egliseinfo.catholique.fr\/api\/oembed',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'RepubHub',
          'provider_url': 'http:\/\/repubhub.icopyright.net\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/repubhub.icopyright.net\/freePost.act?*'
                  ],
                  'url': 'http:\/\/repubhub.icopyright.net\/oembed.act',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'CatBoat',
          'provider_url': 'http:\/\/img.catbo.at\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/img.catbo.at\/*'
                  ],
                  'url': 'http:\/\/img.catbo.at\/oembed.json',
                  'formats': [
                      'json'
                  ]
                }
            ]
        },
        {
          'provider_name': 'Verse',
          'provider_url': 'http:\/\/verse.media\/',
          'endpoints': [
                {
                  'url': 'http:\/\/verse.media\/services\/oembed\/'
                }
            ]
        },
        {
          'provider_name': 'Silk',
          'provider_url': 'http:\/\/www.silk.co\/',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/*.silk.co\/explore\/*',
                      'https:\/\/*.silk.co\/explore\/*',
                      'http:\/\/*.silk.co\/s\/embed\/*',
                      'https:\/\/*.silk.co\/s\/embed\/*'
                  ],
                  'url': 'http:\/\/www.silk.co\/oembed\/',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'Animatron',
          'provider_url': 'https:\/\/www.animatron.com\/',
          'endpoints': [
                {
                  'schemes': [
                      'https:\/\/www.animatron.com\/project\/*',
                      'https:\/\/animatron.com\/project\/*'
                  ],
                  'url': 'https:\/\/animatron.com\/oembed\/json',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'Codepoints',
          'provider_url': 'https:\/\/codepoints.net',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/codepoints.net\/*',
                      'https:\/\/codepoints.net\/*',
                      'http:\/\/www.codepoints.net\/*',
                      'https:\/\/www.codepoints.net\/*'
                  ],
                  'url': 'https:\/\/codepoints.net\/api\/v1\/oembed',
                  'discovery': true
                }
            ]
        },
        {
          'provider_name': 'Pastery',
          'provider_url': 'https:\/\/www.pastery.net',
          'endpoints': [
                {
                  'schemes': [
                      'http:\/\/pastery.net\/*',
                      'https:\/\/pastery.net\/*',
                      'http:\/\/www.pastery.net\/*',
                      'https:\/\/www.pastery.net\/*'
                  ],
                  'url': 'https:\/\/www.pastery.net\/oembed',
                  'discovery': true
                }
            ]
        }
    ];

var noembeddableProviders =
    [{'patterns': ['http://(?:www\\.)?xkcd\\.com/\\d+/?'], 'name': 'XKCD'}, {
      'patterns': ['https?://soundcloud.com/.*/.*'],
      'name': 'SoundCloud'
    }, {'patterns': ['https?://(?:www\\.)?flickr\\.com/.*', 'https?://flic\\.kr/p/[a-zA-Z0-9]+'], 'name': 'Flickr'}, {
      'patterns': ['http://www\\.ted\\.com/talks/.+\\.html'],
      'name': 'TED'
    }, {'patterns': ['http://(?:www\\.)?theverge\\.com/\\d{4}/\\d{1,2}/\\d{1,2}/\\d+/[^/]+/?$'], 'name': 'The Verge'}, {
      'patterns': ['http://.*\\.viddler\\.com/.*'],
      'name': 'Viddler'
    }, {'patterns': ['https?://(?:www\\.)?avclub\\.com/article/[^/]+/?$'], 'name': 'The AV Club'}, {
      'patterns': ['https?://(?:www\\.)?wired\\.com/([^/]+/)?\\d+/\\d+/[^/]+/?$'],
      'name': 'Wired'
    }, {'patterns': ['http://www\\.theonion\\.com/articles/[^/]+/?'], 'name': 'The Onion'}, {
      'patterns': ['http://yfrog\\.com/[0-9a-zA-Z]+/?$'],
      'name': 'YFrog'
    }, {'patterns': ['http://www\\.duffelblog\\.com/\\d{4}/\\d{1,2}/[^/]+/?$'], 'name': 'The Duffel Blog'}, {
      'patterns': ['http://www\\.clickhole\\.com/article/[^/]+/?'],
      'name': 'Clickhole'
    }, {'patterns': ['https?://(?:www.)?skitch.com/([^/]+)/[^/]+/.+', 'http://skit.ch/[^/]+'], 'name': 'Skitch'}, {
      'patterns': ['https?://(alpha|posts|photos)\\.app\\.net/.*'],
      'name': 'ADN'
    }, {
      'patterns': ['https?://gist\\.github\\.com/(?:[-0-9a-zA-Z]+/)?([0-9a-fA-f]+)'],
      'name': 'Gist'
    }, {
      'patterns': ['https?://www\\.(dropbox\\.com/s/.+\\.(?:jpg|png|gif))', 'https?://db\\.tt/[a-zA-Z0-9]+'],
      'name': 'Dropbox'
    }, {'patterns': ['https?://[^\\.]+\\.wikipedia\\.org/wiki/(?!Talk:)[^#]+(?:#(.+))?'], 'name': 'Wikipedia'}, {
      'patterns': ['http://www.traileraddict.com/trailer/[^/]+/trailer'],
      'name': 'TrailerAddict'
    }, {'patterns': ['http://lockerz\\.com/[sd]/\\d+'], 'name': 'Lockerz'}, {
      'patterns': ['http://gifuk\\.com/s/[0-9a-f]{16}'],
      'name': 'GIFUK'
    }, {'patterns': ['http://trailers\\.apple\\.com/trailers/[^/]+/[^/]+'], 'name': 'iTunes Movie Trailers'}, {
      'patterns': ['http://gfycat\\.com/([a-zA-Z]+)'],
      'name': 'Gfycat'
    }, {'patterns': ['http://bash\\.org/\\?(\\d+)'], 'name': 'Bash.org'}, {
      'patterns': ['http://arstechnica\\.com/[^/]+/\\d+/\\d+/[^/]+/?$'],
      'name': 'Ars Technica'
    }, {'patterns': ['http://imgur\\.com/gallery/[0-9a-zA-Z]+'], 'name': 'Imgur'}, {
      'patterns': ['http://www\\.asciiartfarts\\.com/[0-9]+\\.html'],
      'name': 'ASCII Art Farts'
    }, {'patterns': ['http://www\\.monoprice\\.com/products/product\\.asp\\?.*p_id=\\d+'], 'name': 'Monoprice'}, {
      'patterns': ['http://boingboing\\.net/\\d{4}/\\d{2}/\\d{2}/[^/]+\\.html'],
      'name': 'Boing Boing'
    }, {
      'patterns': ['https?://(?:[^\\.]+\\.)?youtube\\.com/watch/?\\?(?:.+&)?v=([^&]+)', 'https?://youtu\\.be/([a-zA-Z0-9_-]+)'],
      'name': 'YouTube'
    }, {
      'patterns': ['https?://github\\.com/([^/]+)/([^/]+)/commit/(.+)', 'http://git\\.io/[_0-9a-zA-Z]+'],
      'name': 'Github Commit'
    }, {'patterns': ['https?://open\\.spotify\\.com/(track|album)/([0-9a-zA-Z]{22})'], 'name': 'Spotify'}, {
      'patterns': ['https?://path\\.com/p/([0-9a-zA-Z]+)$'],
      'name': 'Path'
    }, {'patterns': ['http://www.funnyordie.com/videos/[^/]+/.+'], 'name': 'Funny or Die'}, {
      'patterns': ['http://(?:www\\.)?twitpic\\.com/([^/]+)'],
      'name': 'Twitpic'
    }, {'patterns': ['https?://www\\.giantbomb\\.com/videos/[^/]+/\\d+-\\d+/?'], 'name': 'GiantBomb'}, {
      'patterns': ['http://(?:www\\.)?beeradvocate\\.com/beer/profile/\\d+/\\d+'],
      'name': 'Beer Advocate'
    }, {'patterns': ['http://(?:www\\.)?imdb.com/title/(tt\\d+)'], 'name': 'IMDB'}, {
      'patterns': ['http://cl\\.ly/(?:image/)?[0-9a-zA-Z]+/?$'],
      'name': 'CloudApp'
    }, {'patterns': ['http://clyp\\.it/.*'], 'name': 'Clyp'}, {
      'patterns': ['http://www\\.hulu\\.com/watch/.*'],
      'name': 'Hulu'
    }, {
      'patterns': ['https?://(?:www|mobile\\.)?twitter\\.com/(?:#!/)?[^/]+/status(?:es)?/(\\d+)/?$', 'https?://t\\.co/[a-zA-Z0-9]+'],
      'name': 'Twitter'
    }, {
      'patterns': ['https?://(?:www\\.)?vimeo\\.com/.+'],
      'name': 'Vimeo'
    }, {
      'patterns': ['http://www\\.amazon\\.com/(?:.+/)?[gd]p/(?:product/)?(?:tags-on-product/)?([a-zA-Z0-9]+)', 'http://amzn\\.com/([^/]+)'],
      'name': 'Amazon'
    }, {
      'patterns': ['http://qik\\.com/video/.*'],
      'name': 'Qik'
    }, {
      'patterns': [
          'http://www\\.rdio\\.com/artist/[^/]+/album/[^/]+/?',
          'http://www\\.rdio\\.com/artist/[^/]+/album/[^/]+/track/[^/]+/?',
          'http://www\\.rdio\\.com/people/[^/]+/playlists/\\d+/[^/]+'
      ],
      'name': 'Rdio'
    }, {'patterns': ['http://www\\.slideshare\\.net/.*/.*'], 'name': 'SlideShare'}, {
      'patterns': ['http://imgur\\.com/([0-9a-zA-Z]+)$'],
      'name': 'Imgur'
    }, {'patterns': ['https?://instagr(?:\\.am|am\\.com)/p/.+'], 'name': 'Instagram'}, {
      'patterns': ['http://www\\.twitlonger\\.com/show/[a-zA-Z0-9]+', 'http://tl\\.gd/[^/]+'],
      'name': 'Twitlonger'
    }, {'patterns': ['https?://vine.co/v/[a-zA-Z0-9]+'], 'name': 'Vine'}, {
      'patterns': ['http://www\\.urbandictionary\\.com/define\\.php\\?term=.+'],
      'name': 'Urban Dictionary'
    }, {
      'patterns': ['http://picplz\\.com/user/[^/]+/pic/[^/]+'],
      'name': 'Picplz'
    }, {
      'patterns': [
          'https?://(?:www\\.)?twitter\\.com/(?:#!/)?[^/]+/status(?:es)?/(\\d+)/photo/\\d+(?:/large|/)?$',
          'https?://pic\\.twitter\\.com/.+'
      ],
      'name': 'Twitter'
    }];

module.exports = {
  //http://oembed.com/providers.json
  providers: ALL_PROVIDERS,
  //https://noembed.com/providers
  noembeddableProviders: noembeddableProviders
};


// jscs:enable
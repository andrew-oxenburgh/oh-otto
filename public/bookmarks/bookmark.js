oo_service = oo_service || 'http://localhost:5000';
var query;
var title;
var desc;
var embedUrl;
var i;
var url;
var hasLink = false;
var hasDesc = false;

var findEmbedUrlInLinkTags = function(){
    var link = document.getElementsByTagName('link');
    for (i = 0; i < link.length; i++) {
        if ((null !== link[i].getAttribute('rel')) && (link[i].getAttribute('rel').toLowerCase() === 'alternate')) {
            if ((null !== link[i].getAttribute('type')) && (link[i].getAttribute('type').toLowerCase() === 'application/json+oembed')) {
                if ((null !== link[i].getAttribute('href')) && (link[i].getAttribute('type').toLowerCase() === 'application/json+oembed')) {
                    hasLink = true;
                    return link[i].getAttribute('href');
                }
            }
        }
    }
    return false;
};

var findDescriptionInMetaTags = function(){
    var meta = document.getElementsByTagName('meta');
    for (i = 0; i < meta.length; i++) {
        if ((null !== meta[i].getAttribute('name')) && (meta[i].getAttribute('name').toLowerCase() === 'description')) {
            hasDesc = true;
            return meta[i].getAttribute('content');
        } else if ((null !== meta[i].getAttribute('itemprop')) && (meta[i].getAttribute('itemprop').toLowerCase() === 'description')) {
            hasDesc = true;
            return meta[i].getAttribute('content');
        }
    }
    return false;
};

title = (document.getElementsByTagName('title') && document.getElementsByTagName('title')[0].innerHTML);

desc = findDescriptionInMetaTags();
embedUrl = findEmbedUrlInLinkTags();
url = location.href;

query = 'hasLink=' + hasLink + '&hasDesc=' + hasDesc + '&title=' + title + '&desc=' + desc + '&url=' + encodeURIComponent(url);
if (embedUrl) {
    query += '&embedUrl=' + encodeURIComponent(embedUrl);
}

window.open(oo_service + '/oembed?' + query);

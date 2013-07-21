// ==UserScript==
// @name		NRC Digitale Editie Fix
// @author 		Frenzie
// @version		1.01
// @namespace		http://extendopera.org/userjs/content/nrc-digitale-editie-fix
// @description		Suppresses the default annoying behavior of digital NRC. Instead of opening articles in a popup window only accessible through left click, this script replaces this ludicrousness with regular links so you get all the power that comes with regular links, such as opening them in background, creating linked windows, etcetera.
// @include		http://www.nrc.nl/digitaleeditie/*
// ==/UserScript==
// Changelog
// 1.0 July 3, 2010. Initial release.
// 1.01 July 5, 2010. Added suppression of the opening of search results in a new window.

if ( (location.hostname.indexOf('nrc.nl') != -1) && (location.pathname.indexOf('digitaleeditie') != -1) && (location.pathname.indexOf('.html') == -1) )
{
	function articleLink(element) {
		// Grabbed from http://www.nrc.nl/digitaleeditie/script2.js
		var mode = document.location.href.match(/#([^#]+)$/)
		if (element.className.match(/^ad/)) {
			var ad = element.className.match(/^\S+/)
			var uri = ad + '.html'
		} else {
			var article = element.className.match(/article\d+/)
			if (mode) {
				if (mode[1] == 'text') {
					var uri = article + '.html#text'
				} else if (mode[1] == 'original') {
					var uri = article + '_image.html#original'
				} else {
					var name = 'NRCM_'+ document.location.href.split('/').slice(-3,-1).join('.').replace(/[_]+./,'.').replace(/\./g,'_')
					var uri = name + '_' + article + '.pdf'
				}
			} else {
				var uri = article + '_image.html'
			}
		}
		// End grabbed.
		return uri;
	}
	document.addEventListener('DOMContentLoaded',function() {
		// The image map.
		var articles = document.getElementsByTagName('area');
		for (var i=0;i<articles.length;i++) {
			var element = articles[i];
			element.href = articleLink(element);
		}
		// The divs overlaid on the image map.
		articles = document.getElementsByClassName('page')[0].childNodes;
		for (var i=0;i<articles.length;i++) {
			var element = articles[i];
			if (element == '[object HTMLDivElement]')
				element.outerHTML = '<a href="' + articleLink(element) + '">' + element.outerHTML + '</a>';
		}
		// The links on the right side of the page.
		articles = document.getElementsByClassName('teaser_contents')[0].childNodes;
		for (var i=0;i<articles.length;i++) {
			var element = articles[i];
			if (element == '[object HTMLDivElement]')
				element.outerHTML = '<a href="' + articleLink(element) + '">' + element.outerHTML + '</a>';
		}
	}, false);
	// Suppress default behavior on the articles.
	window.opera.addEventListener('BeforeEventListener.click', function (e)
	{
		//opera.postError(e.event.currentTarget.parentNode.toString())
		if (
			e.event.currentTarget.parentNode == '[object HTMLMapElement]' // The image map, obviously.
			|| e.event.currentTarget.parentNode == '[object HTMLHeadingElement]' // Search results.
			|| e.event.currentTarget.parentNode.toString().indexOf('nrc.nl') != -1 // Links added to DIVs.
		) {
			e.preventDefault();
		}
	}, false);
}
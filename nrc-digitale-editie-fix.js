// ==UserScript==
// @name		NRC Digitale Editie Fix
// @author 		Frenzie
// @version		2.0
// @namespace		http://extendopera.org/userjs/content/nrc-digitale-editie-fix
// @description		Suppresses the default annoying behavior of digital NRC. Instead of opening articles in a lightbox only accessible through left click, this script replaces this ludicrousness with regular links so you get all the power that comes with regular links, such as opening them in background, creating linked windows, etcetera.
// @include		http://digitaleeditie.nrc.nl/*
// ==/UserScript==
// Changelog
// 2.0 January 30, 2011. Updated for new NRC site.
// 1.01 July 5, 2010. Added suppression of the opening of search results in a new window.
// 1.0 July 3, 2010. Initial release.

if ( (location.hostname.indexOf('digitaleeditie.nrc.nl') != -1) )
{

	// Blatant copy of the MyOpera Enhancements settings system.
	var defaultScriptSettings = {

/********************************/
/**** Begin editable section ****/
/********************************/

		//*** Toggle core functions
		// Whether to open the article text instead of the picture by default.
		// true to enable
		textDefault : false,

/******************************/
/**** End editable section ****/
/******************************/
	}

	/*
	 * Copy settings to variables for easier use later.
	 * Check window.UJSMyOperaCommunityFESettings for backwards compatibility.
	 */
	var userSets = opera.UJSFixNRCSettings||defaultScriptSettings;

	var textDefault          = !(userSets.textDefault          === undefined)? userSets.textDefault          :defaultScriptSettings.textDefault;


	window.opera.addEventListener('BeforeScript', function (e)
	{
		// jQuery makes things simpler my ass.
		if (e.element.src.indexOf('one-page-view.js') != -1)
			{
				e.element.text = e.element.text.replace(
					'articleDivs.click(function(){ NrcOnePageView.Articles.showArticle(this);return false; })',
					'articleDivs.each(function(){jQuery(this).html(\'<a href="\'+getArticleHref(this)+\'" style="display:block;width:100%;height:100%"></a>\')})'
				);
				/*
				e.element.text = e.element.text.replace(
					'areas.click(function(){ NrcOnePageView.Articles.showArticle(this);return false; });',
					''
				);
				*/
				e.element.text = e.element.text.replace(
					'NrcOnePageView.Articles.articleHyperlinks.click(function(){ NrcOnePageView.Articles.showArticle(this);return false; })',
					'NrcOnePageView.Articles.articleHyperlinks.each(function(){jQuery(this).attr(\'href\',getArticleHref(this))})'
				);
			}
	}, false);

	// Mostly just taken from the NRC website. The crux of the problem is that this is how links are added, rather than server-side.
	// Read my lips: PROGRESSIVE ENHANCEMENT. Build a *working* website, then add some lousy Javascript special effects if you must.
	// The whole idea behind this freaking UserJS is to rewrite the website into what it should've been like before any JS was added.
	getArticleHref = function(el) {
		//get url by using classname
		var filename;
		if (el.className && el.className.match(/^ad/)) { filename = el.className.match(/^\S+/) + ".html"; } 
		else {
			// Note textDefault which loads the text version of an article if true.
			if ( (el.href && el.href.indexOf("#text") != -1) || textDefault ) {
				filename = el.className.match(/article\d+/) + "_text.html";
			}
			else {
				filename = el.className.match(/article\d+/) + "_image.html";
			}
		}
		return filename;
	}

	// Add some styles that are specific to this script.
	var addStyle = function() {
		var style = document.createElement('style');
		style.setAttribute('type', 'text/css');
		style.textContent = '\
			#CloseButton {display:none !important}\
			.column-left {float:none !important}\
			.column-right {padding-left: 1em !important}\
		';
		document.body.previousSibling.appendChild(style);
	}
	document.addEventListener('DOMContentLoaded', addStyle, false);
	
	// Switches the left and right column in the DOM for easier styling.
	document.addEventListener('DOMContentLoaded', function(){
		var columnLeftTemp = jQuery('.column-left').clone();
		jQuery('.column-left').remove();
		columnLeftTemp.appendTo('.columns');
	}, false);
}
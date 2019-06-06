// ==UserScript==
// @name     	Youtube
// @namespace	tarinnik.gitlab.io/gmscripts
// @version  	1.1.1
// @include		https://www.youtube.com/*
// @icon		https://youtube.com/favicon.ico
// ==/UserScript==

// Redirecting embeded youtube links to full youtube
if (window.location.href.slice(0,30) == "https://www.youtube.com/embed/") {
	var url = window.location.href;
	var videoID = url.slice(30, 41);
	var finalURL = "https://www.youtube.com/watch?v=" + videoID;
	window.location = finalURL;
}

// Expand subscription list
document.getElementsByTagName("ytd-guide-collapsible-entry-renderer")[1].setAttribute("expanded", "");

// Video selector index
var video_select = 0

// Key mappings
var map = {};
onkeydown = onkeyup = function(e){
	map[e.keyCode] = e.type == 'keydown';

	// CTRL + ALT +
	if (map[17] && map[18] && map[77]) {
		if (video_select == 0) {
			document.getElementsByTagName("ytd-grid-video-renderer")[video_select].setAttribute("style", "background:darkblue");
			video_select++;
		} else {
			document.getElementsByTagName("ytd-grid-video-renderer")[video_select].setAttribute("style", "background:darkblue");
			document.getElementsByTagName("ytd-grid-video-renderer")[video_select-1].removeAttribute("style");
			video_select++;
		}
	}


}

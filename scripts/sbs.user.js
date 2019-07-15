// ==UserScript==
// @name     	SBS
// @namespace   tarinnik.gitlab.io/gmscripts
// @version	    0.1
// @include	    https://www.sbs.com.au/ondemand/*
// ==/UserScript==

if (typeof video_select === 'undefined') {
	var video_select = -1;
}

// Background colour
var selectionColour = "background:#fdaf2c";

//Scroll when loading page
if (window.location.href.slice(0,40) == "https://www.sbs.com.au/ondemand/program/") {
    //document.getElementsByClassName("text lighter text--seriesLarge video__detail__name ng-binding")[0].scrollIntoView();
    video_select = -1;
}

//
function scroll(video, firstPos, secondPos, firstPosNum) {
	if (video < firstPosNum) {
		document.getElementsByClassName(firstPos)[0].scrollIntoView();
	} else {
		document.getElementsByClassName(secondPos)[video-firstPosNum].scrollIntoView();
	}
}

function selectNext(className) {
	//If it's the first video
	if (video_select == -1) {
		video_select++;
		document.getElementsByClassName(className)[video_select].setAttribute("style", selectionColour);
	}

	//If it's the end of the available videos
	else if (video_select >= document.getElementsByClassName(className).length - 1) {
		document.getElementsByClassName(className)[0].setAttribute("style", selectionColour);
		document.getElementsByClassName(className)[video_select].removeAttribute("style");
		video_select = 0;
	}

	//Anything else
	else {
		video_select++;
		document.getElementsByClassName(className)[video_select].setAttribute("style", selectionColour);
		document.getElementsByClassName(className)[video_select - 1].removeAttribute("style");
	}
}

function selectPrevious(className) {
	var length = document.getElementsByClassName(className).length;

	//If it's the first video
	if (video_select == 0 || video_select == -1) {
		document.getElementsByClassName(className)[length - 1].setAttribute("style", selectionColour);
		document.getElementsByClassName(className)[0].removeAttribute("style");
		video_select = length - 1;
	}

	//Anything else
	else {
		video_select--;
		document.getElementsByClassName(className)[video_select].setAttribute("style", selectionColour);
		document.getElementsByClassName(className)[video_select + 1].removeAttribute("style");
	}
}

// Key mappings
var map = {};
onkeydown = onkeyup = function(e){
	map[e.keyCode] = e.type == 'keydown';

	// CTRL + ALT + R - Recently viewed shows
	if (map[17] && map[18] && map[82]) {

	}

	// CTRL + ALT + F - Fullscreen
	else if (map[17] && map[18] && map[70]){
		document.getElementsByClassName("jw-video jw-reset")[0].mozRequestFullScreen();
	}

	// CTRL + ALT + C - Close player
	else if (map[17] && map[18] && map[67]) {

	}

	// CTRL + ALT + N - Highlight next video
	else if (map[17] && map[18] && map[78]) {

	    if (window.location.href == "https://www.sbs.com.au/ondemand/") {
	        document.getElementsByClassName("icon icon--m icon--right rn-carousel-control rn-carousel-control-next animation-all")[0].click();
        }




	}

	// CTRL + ALT + M - Highlight previous video
	else if (map[17] && map[18] && map[77]) {

	    if (window.location.href == "https://www.sbs.com.au/ondemand/") {
	        document.getElementsByClassName("icon icon--m icon--left rn-carousel-control rn-carousel-control-prev animation-all")[0].click();
        }

	}


	// CTRL + ALT + S - Select highlighted video
	else if (map[17] && map[18] && map[83]) {

	    if (window.location.href == "https://www.sbs.com.au/ondemand/") {
	        document.getElementsByClassName("text lighter preview-hero__title")[0].getElementsByClassName("ng-binding")[0].click();
        }

	}



}


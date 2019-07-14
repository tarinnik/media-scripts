// ==UserScript==
// @name     	ABC iview
// @namespace 	tarinnik.gitlab.io/gmscripts
// @version  	2.1.1
// @include		https://iview.abc.net.au/*
// @icon		https://iview.abc.net.au/favicon.ico
// ==/UserScript==


if (typeof video_select === 'undefined') {
	var video_select = -1;
}

// Background colour
var selectionColour = "background:#326060";

// Scroll on initial load
if (window.location.href == "https://iview.abc.net.au/your/recents") {
  document.getElementsByClassName("iv-1fREI")[0].scrollIntoView();
  video_select = -1;
} else if (window.location.href.slice(0,30) == "https://iview.abc.net.au/show/") {
  document.getElementsByClassName("iv-2NeoO iv-2-wcB")[0].scrollIntoView();
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
		window.location = "https://iview.abc.net.au/your/recents";
	}

	// CTRL + ALT + W - Play main video
	else if (map[17] && map[18] && map[87]) {
		document.getElementsByClassName("iv-1yw_p")[0].click();
	}

	// CTRL + ALT + F - Fullscreen
	else if (map[17] && map[18] && map[70]){
		document.getElemetsByClassName("jw-video jw-reset")[0].mozRequestFullScreen();
	}

	// CTRL + ALT + C - Close player
	else if (map[17] && map[18] && map[67]) {
		document.getElementsByClassName("iv-PfJvL iv-3bAEn iv-2npVU iconLarge iv-1NR5s iv-25r32")[0].click();
	}

	// CTRL + ALT + N - Highlight next video
	else if (map[17] && map[18] && map[78]) {

		if (window.location.href == "https://iview.abc.net.au/your/recents") {
			selectNext("iv-1AY7n iv-3RSim iv-2U3lE");
			scroll(video_select, "iv-1fREI", "iv-1AY7n iv-3RSim iv-2U3lE", 4);
		}

		else if (window.location.href.slice(0,30) == "https://iview.abc.net.au/show/") {
			selectNext("iv-2Nzsw");
			if (document.getElementsByClassName("iv-hsfpe") === 'undefined') {
				scroll(video_select, "iv-x90Qp", "iv-2Nzsw", 1);
			} else {
				scroll(video_select, "iv-hsfpe", "iv-2Nzsw", 1);
			}
		}


	}

	// CTRL + ALT + M - Highlight previous video
	else if (map[17] && map[18] && map[77]) {

		if (window.location.href == "https://iview.abc.net.au/your/recents") {

			selectPrevious("iv-1AY7n iv-3RSim iv-2U3lE");
			scroll(video_select, "iv-1fREI", "iv-1AY7n iv-3RSim iv-2U3lE", 4);
		}

		else if(window.location.href.slice(0,30) == "https://iview.abc.net.au/show/") {
			selectPrevious("iv-2Nzsw");
			if (document.getElementsByClassName("iv-hsfpe") === 'undefined') {
				scroll(video_select, "iv-x90Qp", "iv-2Nzsw", 1);
			} else {
				scroll(video_select, "iv-hsfpe", "iv-2Nzsw", 1);
			}
		}
	}


	// CTRL + ALT + S - Select highlighted video
	else if (map[17] && map[18] && map[83]) {
		if (window.location.href.slice(0,30) == "https://iview.abc.net.au/show/" && video_select == -1) {
			document.getElementsByClassName("iv-1yw_p")[0].click();
		}

		else if (window.location.href.slice(0,30) == "https://iview.abc.net.au/show/") {
			document.getElementsByClassName("iv-2Nzsw")[0].getElementsByClassName("iv-Mnr16")[0].getElementsByClassName("iv-1yw_p")[0].click();
		}

		else if (window.location.href == "https://iview.abc.net.au/your/recents") {
			var link = document.getElementsByClassName("iv-1AY7n iv-3RSim iv-2U3lE")[video_select].innerHTML.split('"')[1];
			var finalURL = "https://iview.abc.net.au" + link;
			window.location = finalURL;
		}
	}



}


// ==UserScript==
// @name     	ABC iview
// @namespace 	tarinnik.gitlab.io/gmscripts
// @version  	2.0.2
// @include  	https://iview.abc.net.au/*
// @icon		https://iview.abc.net.au/favicon.ico
// ==/UserScript==

if (typeof video_select === 'undefined') {
	var video_select = -1;
}

var selectionColour = "background:#326060";

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

		//If it's the first video
		if (video_select == -1) {
			video_select++;
			document.getElementsByClassName("iv-1AY7n iv-3RSim iv-2U3lE")[video_select].setAttribute("style", selectionColour);
		}

		//If it's the end of the available videos
		else if (video_select >= document.getElementsByClassName("iv-1AY7n iv-3RSim iv-2U3lE").length-1) {
			document.getElementsByClassName("iv-1AY7n iv-3RSim iv-2U3lE")[0].setAttribute("style", selectionColour);
			document.getElementsByClassName("iv-1AY7n iv-3RSim iv-2U3lE")[video_select].removeAttribute("style");
			video_select = 0;
		}

		//Anything else
		else {
			video_select++;
			document.getElementsByClassName("iv-1AY7n iv-3RSim iv-2U3lE")[video_select].setAttribute("style", selectionColour);
			document.getElementsByClassName("iv-1AY7n iv-3RSim iv-2U3lE")[video_select-1].removeAttribute("style");
		}
	}

	// CTRL + ALT + M - Highlight previous video
	else if (map[17] && map[18] && map[77]) {

		var length = document.getElementsByClassName("iv-1AY7n iv-3RSim iv-2U3lE").length;

		//If it's the first video
		if (video_select == 0 || video_select == -1) {
			document.getElementsByClassName("iv-1AY7n iv-3RSim iv-2U3lE")[length-1].setAttribute("style", selectionColour);
			document.getElementsByClassName("iv-1AY7n iv-3RSim iv-2U3lE")[0].removeAttribute("style");
			video_select = length-1;
		}

		//Anything else
		else {
			video_select--;
			document.getElementsByClassName("iv-1AY7n iv-3RSim iv-2U3lE")[video_select].setAttribute("style", selectionColour);
			document.getElementsByClassName("iv-1AY7n iv-3RSim iv-2U3lE")[video_select+1].removeAttribute("style");
		}
	}


	// CTRL + ALT + S - Select highlighted video
	else if (map[17] && map[18] && map[83]) {
		var link = document.getElementsByClassName("iv-1AY7n iv-3RSim iv-2U3lE")[video_select].innerHTML.split('"')[1];
		var finalURL = "https://iview.abc.net.au" + link;
		window.location = finalURL;
	}



}


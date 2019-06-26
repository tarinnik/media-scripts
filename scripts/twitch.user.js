// ==UserScript==
// @name 		Twitch
// @namespace 	tarinnik.gitlab.io/gmscripts
// @version 	1.1.1
// @include 	https://www.twitch.tv/*
// @icon 		https://twitch.tv/favicon.ico
// ==/UserScript==

if (typeof video_select === 'undefined') {
	var video_select = -1;
}

var selectionColour = "background:#4b367c";

//Toggle theatre mode
function theatre_mode() {
	document.getElementsByClassName("player-button qa-theatre-mode-button")[0].click();
}

//Toggle fullscreen mode
function fullscreen() {
	document.getElementsByClassName("player-button qa-fullscreen-button pl-mg-r-1 pl-button__fullscreen--tooltip-left")[0].click();
}

// Key mappings
var map = {};
onkeydown = onkeyup = function(e){
	map[e.keyCode] = e.type == 'keydown';

	// CTRL + ALT + T - theatre mode
	if (map[17] && map[18] && map[84]) {
		theatre_mode();
	}

	// CTRL + ALT + F - Fullscreen
	if (map[17] && map[18] && map[70]) {
		fullscreen();
	}

	// CTRL + ALT + N - Highlight next video/streamer
	if (map[17] && map[18] && map[78]) {

		//Videos
		if (window.location.href.includes("videos")) {
			//If it's the first video
			if (video_select == -1) {
				video_select++;
				document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2")[video_select].setAttribute("style", selectionColour);
			}

			//If it's the last video
			else if (video_select >= document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2").length-1 ) {
				document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2")[0].setAttribute("style", selectionColour);
				document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2")[video_select].removeAttribute("style");
				video_select = 0;
			}

			//If it's anything else
			else {
				video_select++;
				document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2")[video_select].setAttribute("style", selectionColour);
				document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2")[video_select-1].removeAttribute("style");
			}

		}

		//Streamers
		else {
			//document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done");
		}
	}

	// CTRL + ALT + M - Highlight previous video/streamer
	if (map[17] && map[18] && map[77]) {

		//Videos
		if (window.location.href.includes("videos")) {

			var length = document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2").length;

			//If it's the first video
			if (video_select == 0 || video_select == -1) {
				document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2")[length-1].setAttribute("style", selectionColour);
				document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2")[0].removeAttribute("style");
				video_select = length-1;
			}

			else {
				video_select--;
				document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2")[video_select].setAttribute("style", selectionColour);
				document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2")[video_select+1].removeAttribute("style");
			}
		}

		//Streamers
		else {
			console.log("Streamers");
		}
	}

	// CTRL + ALT + S - Select highlighted video
	if (map[17] && map[18] && map[83]) {
		//Videos
		if (window.location.href.includes("videos")) {
			document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2")[video_select].getElementsByClassName("tw-interactive tw-link")[0].click();
		}

		//Streamers
		else {
			console.log("Streamers");
		}
	}

}

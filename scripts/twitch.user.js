// ==UserScript==
// @name        Twitch
// @namespace   tarinnik.gitlab.io/gmscripts
// @version     1.4.3
// @include     https://www.twitch.tv/*
// @icon        https://static.twitchcdn.net/assets/favicon-32-d6025c14e900565d6177.png
// ==/UserScript==

const BOTTOM_RIGHT_NAV_ARRAY = document.getElementsByClassName(
		"player-controls__right-"+
		"control-group tw-align-items-center tw-flex tw-flex-grow-1 tw-justify"+
		"-content-end")[0].
		getElementsByClassName("tw-align-items-center "+
		"tw-align-middle tw-border-bottom-left-radius-medium tw-border-"+
		"bottom-right-radius-medium tw-border-top-left-radius-medium "+
		"tw-border-top-right-radius-medium tw-button-icon tw-button-icon"+
		"--overlay tw-core-button tw-core-button--border tw-core-button--"+
		"overlay tw-inline-flex tw-interactive tw-justify-content-center "+
		"tw-overflow-hidden tw-relative");

const SELECTION_COLOUR = "background:#4b367c";

let video_select;
if (typeof video_select === 'undefined') {
	video_select = -1;
}

var selectionColour = "background:#4b367c";

// Toggle theatre mode
function theatre_mode() {
	let THEATRE_MODE_INDEX;
	if (BOTTOM_RIGHT_NAV_ARRAY.length === 4) {
		THEATRE_MODE_INDEX = 2;
	} else {
		THEATRE_MODE_INDEX = 3;
	}
	BOTTOM_RIGHT_NAV_ARRAY[THEATRE_MODE_INDEX].click();
}

/*
// Toggle fullscreen mode
function fullscreen() {
	let FULLSCREEN_INDEX;
	if (BOTTOM_RIGHT_NAV_ARRAY.length === 4) {
		FULLSCREEN_INDEX = 3;
	} else {
		FULLSCREEN_INDEX = 4;
	}
	BOTTOM_RIGHT_NAV_ARRAY[FULLSCREEN_INDEX].click();
}
 */

// Recent videos for streamer
function recents() {
	const url = window.location.href;

	if (url === "https://www.twitch.tv/") {
		window.location = "https://twitch.tv/xqcow/videos?filter=archives&sort=time";
	}

	else {
		var splitting = url.split("/", 4);
		window.location = "https://twitch.tv/" + splitting[3] + "/videos?filter=archives&sort=time";
	}
}

// Key mappings
var map = {};
onkeydown = onkeyup = function(e){
	map[e.keyCode] = e.type === 'keydown';

	// CTRL + ALT + T - theatre mode
	if (map[17] && map[18] && map[84]) {
		theatre_mode();
	}

	/* Use F instead
	// CTRL + ALT + F- Fullscreen
	if (map[17] && map[18] && map[83]) {
		fullscreen();
	}
	 */

	// CTRL + ALT + R - Recent videos
	if (map[17] && map[18] && map[82]) {
		recents();
	}

	/* Use ALT+F instead
  	// CTRL + ALT + O - Search
  	if (map[17] && map[18] && map[79]) {
      document.getElementById("tw-53c90fcb5a12ffa5c59fc299888b334c").focus();
	}
	 */

	// CTRL + ALT + N - Highlight next video/streamer
	if (map[17] && map[18] && map[78]) {

		//Videos
		if (window.location.href.includes("videos")) {
			//If it's the first video
			if (video_select === -1) {
				video_select++;
				document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2")[video_select].setAttribute("style", SELECTION_COLOUR);
			}

			//If it's the last video
			else if (video_select >= document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2").length-1 ) {
				document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2")[0].setAttribute("style", SELECTION_COLOUR);
				document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2")[video_select].removeAttribute("style");
				video_select = 0;
			}

			//If it's anything else
			else {
				video_select++;
				document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2")[video_select].setAttribute("style", SELECTION_COLOUR);
				document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2")[video_select-1].removeAttribute("style");
			}

		}

		//Streamers
		else {
			//If it's the first video
			if (video_select === -1) {
				video_select++;
				document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done")[video_select].getElementsByClassName("side-nav-card tw-align-items-center tw-flex tw-relative")[0].getElementsByClassName("side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05")[0].setAttribute("style", SELECTION_COLOUR);
			}

			//If it's the last video
			else if (video_select >= document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done").length-1 ) {
				document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done")[0].getElementsByClassName("side-nav-card tw-align-items-center tw-flex tw-relative")[0].getElementsByClassName("side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05")[0].setAttribute("style", SELECTION_COLOUR);
				document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done")[video_select].getElementsByClassName("side-nav-card tw-align-items-center tw-flex tw-relative")[0].getElementsByClassName("side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05")[0].removeAttribute("style");
				video_select = 0;
			}

			//If it's anything else
			else {
				video_select++;
				document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done")[video_select].getElementsByClassName("side-nav-card tw-align-items-center tw-flex tw-relative")[0].getElementsByClassName("side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05")[0].setAttribute("style", SELECTION_COLOUR);
				document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done")[video_select-1].getElementsByClassName("side-nav-card tw-align-items-center tw-flex tw-relative")[0].getElementsByClassName("side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05")[0].removeAttribute("style");
			}
		}
	}

	// CTRL + ALT + M - Highlight previous video/streamer
	if (map[17] && map[18] && map[77]) {

		//Videos
		if (window.location.href.includes("videos")) {

			var length = document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2").length;

			//If it's the first video
			if (video_select === 0 || video_select === -1) {
				document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2")[length-1].setAttribute("style", SELECTION_COLOUR);
				document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2")[0].removeAttribute("style");
				video_select = length-1;
			}

			else {
				video_select--;
				document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2")[video_select].setAttribute("style", SELECTION_COLOUR);
				document.getElementsByClassName("tw-flex-wrap tw-tower tw-tower--300 tw-tower--gutter-sm")[0].getElementsByClassName("tw-mg-b-2")[video_select+1].removeAttribute("style");
			}
		}

		//Streamers
		else {
			var length = document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done").length;

			//If it's the first video
			if (video_select === 0 || video_select === -1) {
				document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done")[length-1].getElementsByClassName("side-nav-card tw-align-items-center tw-flex tw-relative")[0].getElementsByClassName("side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05")[0].setAttribute("style", SELECTION_COLOUR);
				document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done")[0].getElementsByClassName("side-nav-card tw-align-items-center tw-flex tw-relative")[0].getElementsByClassName("side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05")[0].removeAttribute("style");
				video_select = length-1;
			}

			else {
				video_select--;
				document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done")[video_select].getElementsByClassName("side-nav-card tw-align-items-center tw-flex tw-relative")[0].getElementsByClassName("side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05")[0].setAttribute("style", SELECTION_COLOUR);
				document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done")[video_select+1].getElementsByClassName("side-nav-card tw-align-items-center tw-flex tw-relative")[0].getElementsByClassName("side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05")[0].removeAttribute("style");
			}
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
			document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done")[video_select].getElementsByClassName("side-nav-card tw-align-items-center tw-flex tw-relative")[0].getElementsByClassName("side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05")[0].click();
			//setTimeout(goToVideos, 2000);
		}
	}
};

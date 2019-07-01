// ==UserScript==
// @name 	Twitch
// @namespace 	tarinnik.gitlab.io/gmscripts
// @version 	1.4.1
// @include 	https://www.twitch.tv/*
// @icon 	https://twitch.tv/favicon.ico
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

//Recent videos for streamer
function recents() {
	var url = window.location.href;

	if (url == "https://www.twitch.tv/") {
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
	map[e.keyCode] = e.type == 'keydown';

	// CTRL + ALT + T - theatre mode
	if (map[17] && map[18] && map[84]) {
		theatre_mode();
	}

	// CTRL + ALT + F - Fullscreen
	if (map[17] && map[18] && map[70]) {
		fullscreen();
	}

	// CTRL + ALT + R - Recent videos
	if (map[17] && map[18] && map[82]) {
		recents();
	}

  // CTRL + ALT + O - Search
  if (map[17] && map[18] && map[79]) {
      document.getElementById("nav-search-input").focus();
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
			//If it's the first video
			if (video_select == -1) {
				video_select++;
				document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done")[video_select].getElementsByClassName("side-nav-card tw-align-items-center tw-flex tw-relative")[0].getElementsByClassName("side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05")[0].setAttribute("style", selectionColour);
			}

			//If it's the last video
			else if (video_select >= document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done").length-1 ) {
				document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done")[0].getElementsByClassName("side-nav-card tw-align-items-center tw-flex tw-relative")[0].getElementsByClassName("side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05")[0].setAttribute("style", selectionColour);
				document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done")[video_select].getElementsByClassName("side-nav-card tw-align-items-center tw-flex tw-relative")[0].getElementsByClassName("side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05")[0].removeAttribute("style");
				video_select = 0;
			}

			//If it's anything else
			else {
				video_select++;
				document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done")[video_select].getElementsByClassName("side-nav-card tw-align-items-center tw-flex tw-relative")[0].getElementsByClassName("side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05")[0].setAttribute("style", selectionColour);
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
			var length = document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done").length;

			//If it's the first video
			if (video_select == 0 || video_select == -1) {
				document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done")[length-1].getElementsByClassName("side-nav-card tw-align-items-center tw-flex tw-relative")[0].getElementsByClassName("side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05")[0].setAttribute("style", selectionColour);
				document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done")[0].getElementsByClassName("side-nav-card tw-align-items-center tw-flex tw-relative")[0].getElementsByClassName("side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05")[0].removeAttribute("style");
				video_select = length-1;
			}

			else {
				video_select--;
				document.getElementsByClassName("tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done")[video_select].getElementsByClassName("side-nav-card tw-align-items-center tw-flex tw-relative")[0].getElementsByClassName("side-nav-card__link tw-align-items-center tw-flex tw-flex-nowrap tw-full-width tw-interactive tw-link tw-link--hover-underline-none tw-pd-x-1 tw-pd-y-05")[0].setAttribute("style", selectionColour);
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
		}
	}

}

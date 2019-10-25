// ==UserScript==
// @name                ABC iview
// @namespace           tarinnik.gitlab.io/gmscripts
// @version             2.1.7
// @include             https://iview.abc.net.au/*
// @icon                https://iview.abc.net.au/favicon.ico
// ==/UserScript==

// Background colour of the currently selected item
const SELECTION_COLOUR = "background:#326060";
// Index of the selected video (-1 if not defined)
let VIDEO_SELECT;
// Recents URL
const RECENTS_URL = "https://iview.abc.net.au/your/recents";
// Show URL
const SHOW_URL = "https://iview.abc.net.au/show/";
// Length of the base show url, not specific to any show
const SHOW_URL_LENGTH = 30;
const SHOW_HIGHLIGHT_ELEMENT = "iv-2Nzsw";
const SHOW_CLICKABLE_ELEMENT = "iv-1yw_p";
// Distance to scroll on the show page if elements haven't loaded
const SHOW_MAIN_VIDEO_SCROLL = 650;


if (VIDEO_SELECT === undefined) {
	VIDEO_SELECT = -1;
}

// Scroll on initial load
if (window.location.href === RECENTS_URL) {
  document.getElementsByClassName("iv-33kfb iv-uxMpK iv-2bylY iv-" +
	  	"2s_Ue iv-3h0O3")[0].scrollIntoView();
  VIDEO_SELECT = -1;
} else if (window.location.href.slice(0, SHOW_URL_LENGTH) === SHOW_URL) {
	const scrollElement = document.getElementsByClassName("iv-30EH9 iv-2nZkO iv-3776S iv-3" +
		"-ftZ iv-_x-Fk iv-1F28d iv-1Z3fY iv-2s_Ue iv-3hNJh")[0];

	if (scrollElement === undefined) {
		window.scrollBy(0, SHOW_MAIN_VIDEO_SCROLL);
	} else {
		scrollElement.scrollIntoView();
	}

  VIDEO_SELECT = -1;
}

/**
 * Gets the video elements on the show page
 * @returns {HTMLCollectionOf<Element>}
 */
function getShowElements() {
	return document.getElementsByClassName(SHOW_HIGHLIGHT_ELEMENT);
}

/**
 * Gets the clickable element of the video on the show page
 * @returns {Element}
 */
function getShowClickableElement(videoToWatch) {
	return videoToWatch.getElementsByClassName(SHOW_CLICKABLE_ELEMENT)[0];
}

//
function scroll(video, defaultPosition, onScrollPosition, rowLength) {
	if (video < rowLength) {
		document.getElementsByClassName(defaultPosition)[0].scrollIntoView();
	} else {
		document.getElementsByClassName(onScrollPosition)[video-rowLength].scrollIntoView();
	}
}

function next(className) {
	//If it's the first video
	if (VIDEO_SELECT === -1) {
		VIDEO_SELECT++;
		document.getElementsByClassName(className)[VIDEO_SELECT].setAttribute("style", SELECTION_COLOUR);
	}

	//If it's the end of the available videos
	else if (VIDEO_SELECT >= document.getElementsByClassName(className).length - 1) {
		document.getElementsByClassName(className)[0].setAttribute("style", SELECTION_COLOUR);
		document.getElementsByClassName(className)[VIDEO_SELECT].removeAttribute("style");
		VIDEO_SELECT = 0;
	}

	//Anything else
	else {
		VIDEO_SELECT++;
		document.getElementsByClassName(className)[VIDEO_SELECT].setAttribute("style", SELECTION_COLOUR);
		document.getElementsByClassName(className)[VIDEO_SELECT - 1].removeAttribute("style");
	}
}

function previous(className) {
	const length = document.getElementsByClassName(className).length;

	//If it's the first video
	if (VIDEO_SELECT === 0 || VIDEO_SELECT === -1) {
		document.getElementsByClassName(className)[length - 1].setAttribute("style", SELECTION_COLOUR);
		document.getElementsByClassName(className)[0].removeAttribute("style");
		VIDEO_SELECT = length - 1;
	}

	//Anything else
	else {
		VIDEO_SELECT--;
		document.getElementsByClassName(className)[VIDEO_SELECT].setAttribute("style", SELECTION_COLOUR);
		document.getElementsByClassName(className)[VIDEO_SELECT + 1].removeAttribute("style");
	}
}

// Selects the current selection
function select() {
	// Elements of the videos on the show page
	const showSelect = getShowClickableElement(getShowElements()[VIDEO_SELECT]);

	if (window.location.href.slice(0,30) === "https://iview.abc.net.au/show/") {
		showSelect[VIDEO_SELECT + 1].click();
	} else if (window.location.href === "https://iview.abc.net.au/your/recents") {
		const link = document.getElementsByClassName("iv-1AY7n iv-3RSim iv-2U3lE")[VIDEO_SELECT].innerHTML.split('"')[1];
		window.location = "https://iview.abc.net.au" + link;
	}
}

// Key mappings
const map = {};
onkeydown = onkeyup = function(e){
	map[e.keyCode] = e.type === 'keydown';

	// CTRL + ALT + R - Recently viewed shows
	if (map[17] && map[18] && map[82]) {
		window.location = "https://iview.abc.net.au/your/recents";
	}

	// CTRL + ALT + F - Fullscreen
	else if (map[17] && map[18] && map[70]){
		document.getElementsByClassName("jw-video jw-reset")[0].mozRequestFullScreen();
	}

	// CTRL + ALT + C - Close player
	else if (map[17] && map[18] && map[67]) {
		document.getElementsByClassName("iv-PfJvL iv-3bAEn iv-2npVU iconLarge iv-1NR5s iv-25r32")[0].click();
	}

	// CTRL + ALT + N - Highlight next video
	else if (map[17] && map[18] && map[78]) {

		if (window.location.href === "https://iview.abc.net.au/your/recents") {
			next("iv-1AY7n iv-3RSim iv-2U3lE");
			scroll(VIDEO_SELECT, "iv-1fREI", "iv-1AY7n iv-3RSim iv-2U3lE", 4);
		}

		else if (window.location.href.slice(0,30) === "https://iview.abc.net.au/show/") {
			next("iv-2Nzsw");
			if (!!document.getElementsByClassName("iv-hsfpe")[0]) {
				scroll(VIDEO_SELECT, "iv-hsfpe", "iv-2Nzsw", 1);
			} else {
				scroll(VIDEO_SELECT, "iv-x90Qp", "iv-2Nzsw", 1);
			}
		}


	}

	// CTRL + ALT + M - Highlight previous video
	else if (map[17] && map[18] && map[77]) {

		if (window.location.href === "https://iview.abc.net.au/your/recents") {

			previous("iv-1AY7n iv-3RSim iv-2U3lE");
			scroll(VIDEO_SELECT, "iv-1fREI", "iv-1AY7n iv-3RSim iv-2U3lE", 4);
		}

		else if(window.location.href.slice(0,30) === "https://iview.abc.net.au/show/") {
			previous("iv-2Nzsw");
			if (!!document.getElementsByClassName("iv-hsfpe")[0]) {
				scroll(VIDEO_SELECT, "iv-hsfpe", "iv-2Nzsw", 1);
			} else {
				scroll(VIDEO_SELECT, "iv-x90Qp", "iv-2Nzsw", 1);
			}
		}
	}

	// CTRL + ALT + S - Select highlighted video
	else if (map[17] && map[18] && map[83]) {
		select();
	}
};


// ==UserScript==
// @name                ABC iview
// @namespace           tarinnik.github.io/gmscripts
// @version             2.2
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
// Class name of highlightable element
const SHOW_HIGHLIGHT_ELEMENT = "iv-2Nzsw";
// Class name of clickable element
const SHOW_CLICKABLE_ELEMENT = "iv-1yw_p";
// Distance to scroll on the show page if elements haven't loaded
const SHOW_MAIN_VIDEO_SCROLL = 650;
// Close video player button class name
const CLOSE_PLAYER = "iv-1LlPw iv-3bAEn iv-Xjw7_ iconLarge iv-3mcSv iv-2Ba9R";

if (VIDEO_SELECT === undefined) {
	VIDEO_SELECT = -1;
}

// Scroll on initial load
if (window.location.href === RECENTS_URL) {
	const scrollElement = document.getElementsByClassName("iv-30EH9 iv-2nZkO iv-3776S iv-3-ftZ iv-_" +
		"x-Fk iv-1F28div-1Z3fY iv-2s_Ue iv-1iYjC")[0];
  	if (scrollElement !== undefined) {
  		scrollElement.scrollIntoView();
	}
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
	return getShowElements()[videoToWatch].getElementsByClassName(SHOW_CLICKABLE_ELEMENT)[0];
}

/**
 * Closes the video player
 */
function close() {
	document.getElementsByClassName(CLOSE_PLAYER)[0].click();
}

/**
 * Scrolls so the selected element is in view
 * @param video index of the element
 * @param defaultPosition element to scroll to for the first row
 * @param onScrollPosition element to scroll to for all other rows
 * @param rowLength the row that should be in view
 */
function scroll(video, defaultPosition, onScrollPosition, rowLength) {
	if (video < rowLength) {
		document.getElementsByClassName(defaultPosition)[0].scrollIntoView();
	} else {
		document.getElementsByClassName(onScrollPosition)[video-rowLength].scrollIntoView();
	}
}

/**
 * Highlight the next element
 * @param className name of the class to highlight
 */
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

/**
 * Highlight the previous element
 * @param className name of the class to highlight
 */
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

/**
 * Select the currently highlighted element
 */
function select() {
	if (window.location.href.slice(0,30) === "https://iview.abc.net.au/show/") {
		getShowClickableElement(VIDEO_SELECT).click();
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
	if ((map[17] && map[18] && map[82]) || map[97]) {
		window.location = "https://iview.abc.net.au/your/recents";
	}

	// CTRL + ALT + F - Fullscreen
	else if ((map[17] && map[18] && map[70]) || map[99]){
		document.getElementsByClassName("jw-icon jw-icon-inline jw-button-color jw-reset jw-icon-fullscreen")[0].click();
	}

	// CTRL + ALT + C - Close player
	else if ((map[17] && map[18] && map[67]) || map[105]) {
		close();
	}

	// CTRL + ALT + N - Highlight next video
	else if ((map[17] && map[18] && map[78]) || map[102]) {

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
	else if ((map[17] && map[18] && map[77]) || map[100]) {

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
	else if ((map[17] && map[18] && map[83]) || map [101]) {
		select();
	}

	else if (map[103]) {
		window.history.go(0 - (window.history.length - 1));
	}

	else if (map[13]) {
		document.getElementsByClassName("jw-icon jw-icon-inline jw-button-color jw-reset jw-icon-playback")[0].click();
	}
};


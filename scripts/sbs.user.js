// ==UserScript==
// @name     	SBS
// @namespace   tarinnik.github.io/media
// @version	    2.0
// @include	    https://www.sbs.com.au/ondemand/*
// @icon        https://www.sbs.com.au/favicon.ico
// ==/UserScript==

const BACKGROUND_COLOUR = "background:#ffb006";
const HOME_CLASS = "search__logo search__odLogo";
const LIST_URL = "https://www.sbs.com.au/ondemand/favourites";
const LIST_BUTTON_CLASS = "favourite__extra";
const LIST_VIDEOS_CLASS = "grid__list grid__list--landscape";
const PROGRAM_URL = "https://www.sbs.com.au/ondemand/program";
const PROGRAM_URL_LENGTH = PROGRAM_URL.length;
const PROGRAM_BANNER_CLASS = "tabview__content";
const PROGRAM_VIDEO_CLASS = "series__episodesList ng-scope";
const PROGRAM_WATCHLIST_CLASS = "action";
const PROGRAM_INFORMATION_CLASS = "tabview__tabs";
const VIDEO_URL = "https://www.sbs.com.au/ondemand/video";
const VIDEO_URL_LENGTH = VIDEO_URL.length;
const VIDEO_ID = "video-player";
const FULLSCREEN_CLASS = "spcFullscreenButton";
const PLAY_CLASS = "spcPlayPauseContainer";

let STATE = {
	selection: 0,
	menu: false,
	section: 0,
};

const DIRECTION = {
	remove: 'r',
	none: 0,
	forwards: 1,
	backwards: -1,
	up: -2,
	down: 2,
};

/**
 * Triggered when the page loads
 */
window.addEventListener('load', function() {
	newPage();
});

/**
 * When a new page is loaded
 */
function newPage() {
	setTimeout(function() {
		highlight(DIRECTION.none);
		scroll();
		STATE.selection = 0;
		STATE.menu = false;
	}, 500);
}

/**
 * Triggered when a key is pressed
 */
document.addEventListener('keydown', function(event) {
	key(event);
});

/**
 * Determines the key press
 * @param event that was triggered
 */
function key(event) {
	if (STATE.search) {
		searchKey(event.key);
		return;
	}

	switch (event.key) {
		case '1':
			list();
			break;
		case '2':
			down();
			break;
		case '3':
			fullscreen();
			break;
		case '4':
			left();
			break;
		case '5':
			select();
			break;
		case '6':
			right();
			break;
		case '7':
			home();
			break;
		case '8':
			up();
			break;
		case '9':
			back();
			break;
		case '0':
			search();
			break;
		case 'Enter':
			playpause();
			break;
		case '.':
			seasons();
			break;
		case '-':
			break;
		case '/':
			refresh();
			break;
	}
}

/**
 * Checks that the current page is my list
 * @return {boolean}
 */
function checkList() {
	return window.location.href === LIST_URL;
}

/**
 * Checks that the current page is the program page
 * @return {boolean}
 */
function checkProgram() {
	return window.location.href.slice(0, PROGRAM_URL_LENGTH) === PROGRAM_URL;
}

/**
 * Checks that the current page is the watch page
 */
function checkWatch() {
	return window.location.href.slice(0, VIDEO_URL_LENGTH) === VIDEO_URL;
}

/**
 * Gets the elements on the program page
 * @return {[]}
 */
function getProgramElements() {
	let e = [];
	let elements;
	if (STATE.menu) {
		e.push(document.getElementsByClassName(PROGRAM_WATCHLIST_CLASS)[0].getElementsByTagName("li")[0]);
		elements = document.getElementsByClassName(PROGRAM_INFORMATION_CLASS)[0].getElementsByTagName("li");
	} else {
		e.push(document.getElementsByClassName(PROGRAM_BANNER_CLASS)[0]);
		elements = document.getElementsByClassName(PROGRAM_VIDEO_CLASS)[0].getElementsByTagName("li");
	}

	for (let i = 0; i < elements.length; i++) {
		e.push(elements[i]);
	}
	return e;
}

/**
 * Gets the elements that need to be highlighted
 */
function getElements() {
	if (checkList()) {
		return document.getElementsByClassName(LIST_VIDEOS_CLASS)[0].getElementsByTagName("li");
	} else if (checkProgram()) {
		return getProgramElements();
	} else if (checkWatch()) {
		return document.getElementById(VIDEO_ID).contentDocument.childNodes[1];
	}
}

/**
 * Gets the number of columns
 * @returns {number} of columns
 */
function getColumns() {
	if (checkList()) {
		let c = document.getElementsByTagName("html")[0].className;
		let i = c.indexOf("grid");
		let columns = c.slice(i + 5);
		return parseInt(columns);
	} else if (checkProgram() && STATE.menu) {
		return 3;
	} else {
		return 1;
	}
}

/**
 * Highlights an element
 * @param d direction to highlight in
 */
function highlight(d) {
	let elements = getElements();
	let columns = getColumns();

	// Highlight the current element
	if (d === DIRECTION.none) {
		elements[STATE.selection].setAttribute("style", BACKGROUND_COLOUR);

		// Remove the highlight from the current element
	} else if (d === DIRECTION.remove) {
		elements[STATE.selection].removeAttribute("style");

		// Highlight forward but at the end of the elements
	} else if (STATE.selection === elements.length - 1 && d === DIRECTION.forwards) {
		return;

		// Highlight backwards but at the start of the elements
	} else if (STATE.selection === 0 && d === DIRECTION.backwards) {
		return;

		// Highlights the element in the row above or below
	} else if (d === DIRECTION.up || d === DIRECTION.down) {
		if (d === DIRECTION.up && STATE.selection < columns) {
			return;
		}
		highlight(DIRECTION.remove);
		let multiplier = d / 2;
		if (d === DIRECTION.down) {
			if (STATE.selection >= elements.length - columns) {
				STATE.selection = elements.length - 1;
				highlight(DIRECTION.none);
				return;
			}
		}
		STATE.selection += (columns * multiplier);
		highlight(DIRECTION.none);

		// Highlighting forwards or backwards with an element on the relevant side
	} else {
		highlight(DIRECTION.remove);
		STATE.selection += d;
		highlight(DIRECTION.none);
	}

	scroll();
}

/**
 * Scrolls so that the selected element is in view
 */
function scroll() {
	let columns = getColumns();
	let elements = getElements();
	let defaultPosition;

	if (checkProgram()) {
		defaultPosition = document.getElementsByTagName("h1")[0];
	} else {
		defaultPosition = null;
	}

	if (STATE.selection < columns) {
		if (defaultPosition === null) {
			window.scrollTo(0, 0);
		} else {
			defaultPosition.scrollIntoView();
		}
	} else {
		elements[STATE.selection - 1].scrollIntoView();
	}
}

/**
 * Toggles between the menu and the content
 */
function toggleMenu() {
	highlight(DIRECTION.remove);
	STATE.menu = !STATE.menu;
	STATE.selection = 0;
	highlight(DIRECTION.none);
}

/**
 * 6 (right arrow) was pressed
 */
function right() {
	if (checkList()) {
		highlight(DIRECTION.forwards);
	} else if (checkProgram() && STATE.menu) {
		highlight(DIRECTION.forwards);
	}
}

/**
 * 4 (left arrow) was pressed
 */
function left() {
	if (checkList()) {
		highlight(DIRECTION.backwards);
	} else if (checkProgram() && STATE.menu) {
		highlight(DIRECTION.backwards);
	}
}

/**
 * 8 (up arrow) was pressed
 */
function up() {
	if (checkList()) {
		highlight(DIRECTION.up);
	} else if (checkProgram()) {
		if (STATE.selection === 0 && !STATE.menu) {
			toggleMenu();
		} else {
			highlight(DIRECTION.backwards);
		}
	}
}

/**
 * 2 (down arrow) was pressed
 */
function down() {
	if (checkList()) {
		highlight(DIRECTION.down);
	} else if (checkProgram()) {
		if (STATE.menu) {
			toggleMenu();
		} else {
			highlight(DIRECTION.forwards);
		}
	}
}

/**
 * 5 (select) was pressed
 */
function select() {
	if (checkList()) {
		getElements()[STATE.selection].getElementsByTagName("a")[0].click();
		newPage();
	} else if (checkProgram()) {
		getElements()[STATE.selection].getElementsByTagName("a")[0].click();
		if (!STATE.menu) {
			newPage();
		}
	}
}

function playpause() {
	getElements().getElementsByClassName(PLAY_CLASS)[0].click();
}

/**
 * Makes the video fullscreen
 */
function fullscreen() {
	getElements().getElementsByClassName(FULLSCREEN_CLASS)[0].click();
}

/**
 * Closes the video, or if there is no video, goes to the home page
 */
function back() {
	document.getElementsByClassName(HOME_CLASS)[0].getElementsByTagName("a")[0].click();
}

/**
 * Navigates to the list page
 */
function list() {
	STATE.selection = 0;
	document.getElementsByClassName(LIST_BUTTON_CLASS)[0].getElementsByTagName("a")[0].click();
}

/**
 * Goes back to the media home page
 */
function home() {
	window.location = "https://tarinnik.github.io/media/";
}

/**
 * Refreshes the page
 */
function refresh() {
	window.location = window.location.href;
}
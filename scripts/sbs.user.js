// ==UserScript==
// @name     	SBS
// @namespace   tarinnik.github.io/media
// @version	    2.1.1
// @include	    https://www.sbs.com.au/ondemand/*
// @icon        https://www.sbs.com.au/favicon.ico
// ==/UserScript==

const BACKGROUND_COLOUR = "#ffb006";
const HOME_URL = "https://www.sbs.com.au/ondemand/";
const HOME_CLASS = "search__logo search__odLogo";
const HOME_CAROUSEL_ID = "carousel1";
const HOME_CAROUSEL_ACTIVE_CLASS = "active";
const HOME_CAROUSEL_CONTROLS = "rn-carousel-controls ng-scope";
const HOME_VIDEO_ROW_CLASS = "carousel__list";
const HOME_VIDEO_CLASS = "carousel__item";
const LIST_URL = "https://www.sbs.com.au/ondemand/favourites";
const LIST_BUTTON_CLASS = "favourite__extra";
const LIST_VIDEOS_CLASS = "grid__list grid__list--landscape";
const PROGRAM_URL = "https://www.sbs.com.au/ondemand/program";
const PROGRAM_URL_LENGTH = PROGRAM_URL.length;
const PROGRAM_BANNER_CLASS = "tabview__content";
const PROGRAM_VIDEO_CLASS = "series__episodesList ng-scope";
const PROGRAM_WATCHLIST_CLASS = "action";
const PROGRAM_INFORMATION_CLASS = "tabview__tabs";
const VIDEO_FULLSCREEN_URL = "https://www.sbs.com.au/ondemand/video/odplayer";
const VIDEO_URL = "https://www.sbs.com.au/ondemand/video";
const VIDEO_URL_LENGTH = VIDEO_URL.length;
const VIDEO_ID = "video-player";
const FULLSCREEN_CLASS = "spcFullscreenButton";
const PLAY_CLASS = "spcPlayPauseContainer";
const WATCH_PLAY_OVERLAY_CLASS = "tpPlayOverlay";

let STATE = {
	selection: 0,
	menu: false,
	videoSelection: 0,
	videoSection: false,
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

function checkHome() {
	return window.location.href === HOME_URL;
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

function checkFullscreenWatch() {
	return window.location.href.slice(0, VIDEO_FULLSCREEN_URL.length) === VIDEO_FULLSCREEN_URL;
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

function getHomeElements() {
	let a = [];
	a.push(document.getElementById(HOME_CAROUSEL_ID).getElementsByClassName(HOME_CAROUSEL_ACTIVE_CLASS)[0]);
	let e = document.getElementsByClassName(HOME_VIDEO_ROW_CLASS);
	for (let i = 0; i < e.length; i++) {
		a.push(e[i].getElementsByClassName(HOME_VIDEO_CLASS)[0]);
	}
	return a;
}

/**
 * Gets the elements that need to be highlighted
 */
function getElements() {
	if (checkHome()) {
		if (STATE.videoSection) {
			return getHomeElements();
		} else {
			return document.getElementsByClassName(HOME_VIDEO_ROW_CLASS)[STATE.videoSelection - 1].
					getElementsByClassName(HOME_VIDEO_CLASS);
		}
	} else if (checkList()) {
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
		elements[STATE.selection].style.background = BACKGROUND_COLOUR;

		// Remove the highlight from the current element
	} else if (d === DIRECTION.remove) {
		elements[STATE.selection].style.background = "";

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

	if (checkHome() && !STATE.videoSection) {
		return;
	} else if (checkProgram()) {
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
		elements[STATE.selection - columns].scrollIntoView();
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

function preVideoSection() {
	STATE.selection = 0;
	STATE.videoSection = true;
	swapSelection();
}

function postVideoSection() {
	STATE.videoSection = false;
	swapSelection();
}

function swapSelection() {
	let tmp = STATE.selection;
	STATE.selection = STATE.videoSelection;
	STATE.videoSelection = tmp;
}

/**
 * 6 (right arrow) was pressed
 */
function right() {
	if (checkHome()) {
		if (STATE.videoSelection === 0) {
			document.getElementsByClassName(HOME_CAROUSEL_CONTROLS)[0].
					getElementsByTagName("span")[1].click();
		} else {
			highlight(DIRECTION.forwards);
		}
	} else if (checkList()) {
		highlight(DIRECTION.forwards);
	} else if (checkProgram() && STATE.menu) {
		highlight(DIRECTION.forwards);
	}
}

/**
 * 4 (left arrow) was pressed
 */
function left() {
	if (checkHome()) {
		if (STATE.videoSelection === 0) {
			document.getElementsByClassName(HOME_CAROUSEL_CONTROLS)[0].
			getElementsByTagName("span")[0].click();
		} else {
			highlight(DIRECTION.backwards);
		}
	} else if (checkList()) {
		highlight(DIRECTION.backwards);
	} else if (checkProgram() && STATE.menu) {
		highlight(DIRECTION.backwards);
	}
}

/**
 * 8 (up arrow) was pressed
 */
function up() {
	if (checkHome()) {
		preVideoSection();
		highlight(DIRECTION.backwards);
		postVideoSection();
	} else if (checkList()) {
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
	if (checkHome()) {
		preVideoSection();
		highlight(DIRECTION.forwards);
		postVideoSection();
	} else if (checkList()) {
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
	if (checkHome()) {
		if (STATE.videoSelection === 0) {
			STATE.videoSection = true;
			getElements()[STATE.selection].getElementsByTagName("div")[0].click();
			STATE.videoSection = false;
		} else {
			getElements()[STATE.selection].getElementsByTagName("a")[0].click();
		}
		newPage();
	} else if (checkList()) {
		getElements()[STATE.selection].getElementsByTagName("a")[0].click();
		newPage();
	} else if (checkProgram()) {
		getElements()[STATE.selection].getElementsByTagName("a")[0].click();
		if (!STATE.menu) {
			newPage();
		}
	} else if (checkWatch()) {
		let e = document.getElementsByClassName(WATCH_PLAY_OVERLAY_CLASS);
		if (e.length > 0) {
			e[0].click();
		}
	}
}

function playpause() {
	if (checkFullscreenWatch()) {
		document.getElementsByClassName(PLAY_CLASS)[0].click();
	} else if (checkWatch()) {
		getElements().getElementsByClassName(PLAY_CLASS)[0].click();
	}
}

/**
 * Makes the video fullscreen
 */
function fullscreen() {
	if (checkFullscreenWatch()) {
		document.getElementsByClassName(FULLSCREEN_CLASS)[0].click();
	} else if (checkWatch()) {
		window.location = document.getElementById(VIDEO_ID).src;
	}
}

/**
 * Closes the video, or if there is no video, goes to the home page
 */
function back() {
	window.location = HOME_URL;
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
// ==UserScript==
// @name        Twitch
// @namespace   tarinnik.github.io/media
// @version     0.3
// @include     https://www.twitch.tv/*
// @icon        https://static.twitchcdn.net/assets/favicon-32-d6025c14e900565d6177.png
// ==/UserScript==

const CHAT_CLASS = "tw-block tw-border-radius-medium tw-font-size-6 tw-full-width tw-textarea tw-textarea--no-resize";
const BACKGROUND_COLOUR = "background:#9147ff";
const HOME_URL = "https://www.twitch.tv/";
const HOME_FOLLOWED_CHANNELS_CLASS = "tw-transition tw-transition--duration-medium tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done";
const LIST_URL = "";
const SHOW_URL = "";
const STREAM_INDICATOR_CLASS = "channel-header-user-tab__user-content tw-align-items-center tw-flex tw-full-height";
const STREAM_BOTTOM_RIGHT_CONTROLS = "player-controls__right-control-group tw-align-items-center tw-flex tw-flex-grow-1 tw-justify-content-end";
const STREAM_BOTTOM_RIGHT_CONTROLS_ATTRIBUTE = "data-a-target";
const STREAM_THEATRE_MODE = "player-theatre-mode-button";
const STREAM_FULLSCREEN = "player-fullscreen-button";
const SEARCH_URL = "";

let STATE = {
	selection: 0,
	menu: false,
	videoSelection: 0,
	season: false,
	search: false,
	numSameKeyPresses: 0,
	lastKeyPressed: '',
	searchQuery: "",
	changingChar: '',
};

const DIRECTION = {
	remove: 'r',
	none: 0,
	forwards: 1,
	backwards: -1,
	up: -2,
	down: 2,
};

const searchLetters = [
	[' ', '0'],
	['q', 'r', 's', '1'],
	['t', 'u', 'v', '2'],
	['w', 'x', 'y', 'z', '3'],
	['g', 'h', 'i', '4'],
	['j', 'k', 'l', '5'],
	['m', 'n', 'o', 'p', '6'],
	['7'],
	['a', 'b', 'c', '8'],
	['d', 'e', 'f', '9']
];

/**
 * Triggered when the page loads
 */
window.addEventListener('load', function() {
	if (checkHome()) {
		STATE.menu = true;
	}
	highlight(DIRECTION.none);
});

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
	if (document.activeElement.className === CHAT_CLASS) return;

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
			theatre();
			break;
		case '+':
			break;
		case '-':
			break;
		case '*':
			break;
		case '/':
			refresh();
			break;
	}
}

/**
 * Checks if the current page is the home page
 * @return {boolean} if the current page is the home page
 */
function checkHome() {
	return window.location.href === HOME_URL;
}

/**
 * Checks if the current page is the watchlist
 * @returns {boolean} if the current page is my list
 */
function checkList() {

}

/**
 * Checks if the current page is the show page
 * @returns {boolean} if the current page is the show page
 */
function checkShow() {

}

/**
 * Checks if the current page is the video
 * @returns {boolean} if the current page is the video
 */
function checkWatch() {
	return document.getElementsByClassName(STREAM_INDICATOR_CLASS).length > 0;
}

/**
 * Gets the elements that are to be selected
 */
function getElements() {
	if (checkHome()) {
		if (STATE.menu) {
			return document.getElementsByClassName(HOME_FOLLOWED_CHANNELS_CLASS);
		}
	} else if (checkList()) {

	} else if (checkShow()) {

	}
}

/**
 * Gets the number of columns the elements have
 * @returns {number} number of columns
 */
function getColumns() {
	if (checkHome()) {
		return 1;
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
 * 5 (select) was pressed
 */
function select() {
	if (checkHome()) {
		if (STATE.menu) {
			getElements()[STATE.selection].getElementsByTagName('a')[0].click();
		}
	} else if (checkList()) {

	} else if (checkShow()) {

	}
}

/**
 * 6 (right arrow) was pressed
 */
function right() {
	if (checkHome()) {

	} else if (checkList()) {

	} else if (checkShow()) {

	}
}

/**
 * 4 (left arrow) was pressed
 */
function left() {
	if (checkHome()) {

	} else if (checkList()) {

	} else if (checkShow()) {

	}
}

/**
 * 8 (up arrow) was pressed
 */
function up() {
	if (checkHome()) {
		if (STATE.menu) {
			highlight(DIRECTION.up);
		}
	} else if (checkList()) {

	} else if (checkShow()) {

	}
}

/**
 * 2 (down arrow) was pressed
 */
function down() {
	if (checkHome()) {
		if (STATE.menu) {
			highlight(DIRECTION.down);
		}
	} else if (checkList()) {

	} else if (checkShow()) {

	}
}

/**
 * Scrolls the page so the selected element if visible
 */
function scroll() {
	let columns = getColumns();
	let defaultPosition;
	let elements = getElements();
	if (checkHome()) {

	} else if (checkList()) {

	} else if (checkShow()) {

	}

	if (STATE.selection < columns) {
		try {
			defaultPosition.scrollIntoView();
		} catch (TypeError) {
			window.scrollTo(0, 0);
		}
	} else {
		elements[STATE.selection - columns].scrollIntoView();
	}
}

/**
 * Toggles the play state of the video
 */
function playpause() {

}

/**
 * Makes the video fullscreen
 */
function fullscreen() {
	if (checkWatch()) {
		let buttons = document.getElementsByClassName(STREAM_BOTTOM_RIGHT_CONTROLS)[0].getElementsByTagName("button");
		for (let i = 0; i < buttons.length; i++) {
			if (buttons[i].getAttribute(STREAM_BOTTOM_RIGHT_CONTROLS_ATTRIBUTE) === STREAM_FULLSCREEN) {
				buttons[i].click();
				return;
			}
		}
	}
}

/**
 * Toggles theatre mode
 */
function theatre() {
	if (checkWatch()) {
		let buttons = document.getElementsByClassName(STREAM_BOTTOM_RIGHT_CONTROLS)[0].getElementsByTagName("button");
		for (let i = 0; i < buttons.length; i++) {
			if (buttons[i].getAttribute(STREAM_BOTTOM_RIGHT_CONTROLS_ATTRIBUTE) === STREAM_THEATRE_MODE) {
				buttons[i].click();
				return;
			}
		}
	}
}

/**
 * Closes the video if one is open, otherwise goes to the home page
 */
function back() {
	window.location = HOME_URL;
}

/**
 * Navigates to the list page
 */
function list() {

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
	window.location = '.';
}
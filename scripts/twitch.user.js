// ==UserScript==
// @name        Twitch
// @namespace   tarinnik.github.io/media
// @version     0.7.5
// @include     https://www.twitch.tv/*
// @icon        https://static.twitchcdn.net/assets/favicon-32-d6025c14e900565d6177.png
// ==/UserScript==

const CHAT_CLASS = "tw-block tw-border-radius-medium tw-font-size-6 tw-full-width tw-textarea tw-textarea--no-resize";
const BACKGROUND_COLOUR = "background:#9147ff";
const HOME_URL = "https://www.twitch.tv/";
const HOME_FOLLOWED_CHANNELS_CLASS = "tw-transition tw-transition--enter-done tw-transition__scale-over tw-transition__scale-over--enter-done";
const STREAM_INDICATOR_CLASS = "tw-animated-number tw-animated-number--monospaced";
const STREAM_BOTTOM_LEFT_CONTROLS = "player-controls__left-control-group tw-align-items-center tw-flex tw-flex-grow-1 " +
									"tw-justify-content-start";
const STREAM_BOTTOM_RIGHT_CONTROLS = "player-controls__right-control-group tw-align-items-center tw-flex " +
									 "tw-flex-grow-1 tw-justify-content-end";
const STREAM_CONTROLS_VISIBILITY_CLASS = "tw-transition tw-transition--duration-medium tw-transition--exit-done " +
										 "tw-transition__fade";
const STREAM_CONTROLS_HIDDEN_CLASS = "tw-transition__fade--exit-done";
const STREAM_CONTROLS_VISIBLE_CLASS = "tw-transition__fade--enter-done";
const STREAM_BOTTOM_CONTROLS_ATTRIBUTE = "data-a-target";
const STREAM_THEATRE_MODE = "player-theatre-mode-button";
const STREAM_FULLSCREEN = "player-fullscreen-button";
const STREAM_SETTINGS = "player-settings-button";
const STREAM_SETTINGS_MENU = "tw-overflow-auto tw-pd-1";
const STREAM_CHANNEL_POINTS_CLAIM = "tw-button tw-button--success tw-interactive";
const STREAM_PLAY_PAUSE = "player-play-pause-button";
const SEARCH_URL = "";

let STATE = {
	selection: 0,
	menu: false,
	menuDepth: 0,
	videoSelection: 0,
	followed: false,
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
		STATE.followed = true;
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
			settings();
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
		if (STATE.followed) {
			return document.getElementsByClassName(HOME_FOLLOWED_CHANNELS_CLASS);
		}
	} else if (checkWatch()) {
		if (STATE.menu) {
			return document.getElementsByClassName(STREAM_SETTINGS_MENU)[1].children[0].children;
		}
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
		if (STATE.followed) {
			getElements()[STATE.selection].getElementsByTagName('a')[0].click();
		}
	} else if (checkWatch()) {
		if (STATE.menu) {
			highlight(DIRECTION.remove);
			if (STATE.menuDepth === 0) {
				getElements()[STATE.selection].getElementsByTagName("button")[0].click();
				if (STATE.selection === 3)  {
					STATE.menu = false;
					STATE.menuDepth = 0;
					STATE.selection = 0;
				} else if (STATE.selection !== 4) {
					STATE.menuDepth += STATE.selection + 1;
					STATE.selection = 0;
					highlight(DIRECTION.none);
				}
			} else {
				if (STATE.selection === 0) {
					getElements()[STATE.selection].getElementsByTagName("button")[0].click();
					STATE.selection = 0;
					STATE.menuDepth = 0;
					highlight(DIRECTION.none);
				} else if (STATE.menuDepth === 1) {
					getElements()[STATE.selection].getElementsByTagName("input")[0].click();
					STATE.menu = false;
					STATE.menuDepth = 0;
					STATE.selection = 0;
				} else if (STATE.menuDepth === 2) {
					getElements()[STATE.selection].getElementsByTagName("input")[0].click();
					highlight(DIRECTION.none);
				}
			}
		} else if (document.getElementsByClassName(STREAM_CHANNEL_POINTS_CLAIM).length !== 0) {
			document.getElementsByClassName(STREAM_CHANNEL_POINTS_CLAIM)[0].click();
		}
	}
}

/**
 * 6 (right arrow) was pressed
 */
function right() {
	if (checkHome()) {

	} else if (checkWatch()) {

	}
}

/**
 * 4 (left arrow) was pressed
 */
function left() {
	if (checkHome()) {

	} else if (checkWatch()) {

	}
}

/**
 * 8 (up arrow) was pressed
 */
function up() {
	if (checkHome()) {
		if (STATE.followed) {
			highlight(DIRECTION.up);
		}
	} else if (checkWatch()) {
		if (STATE.menu) {
			highlight(DIRECTION.up);
		}
	}
}

/**
 * 2 (down arrow) was pressed
 */
function down() {
	if (checkHome()) {
		if (STATE.followed) {
			highlight(DIRECTION.down);
		}
	} else if (checkWatch()) {
		if (STATE.menu) {
			highlight(DIRECTION.down);
		}
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

	} else if (checkWatch()) {
		if (STATE.menu) {
			return;
		}
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
	if (checkWatch()) {
		let buttons = document.getElementsByClassName(STREAM_BOTTOM_LEFT_CONTROLS)[0].getElementsByTagName("button");
		for (let i = 0; i < buttons.length; i++) {
			if (buttons[i].getAttribute(STREAM_BOTTOM_CONTROLS_ATTRIBUTE) === STREAM_PLAY_PAUSE) {
				buttons[i].click();
				return;
			}
		}
	}
}

/**
 * Makes the video fullscreen
 */
function fullscreen() {
	console.log("Toggling fullscreen");
	if (checkWatch()) {
		let buttons = document.getElementsByClassName(STREAM_BOTTOM_RIGHT_CONTROLS)[0].getElementsByTagName("button");
		for (let i = 0; i < buttons.length; i++) {
			if (buttons[i].getAttribute(STREAM_BOTTOM_CONTROLS_ATTRIBUTE) === STREAM_FULLSCREEN) {
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
	console.log("Toggling theatre mode");
	if (checkWatch()) {
		let buttons = document.getElementsByClassName(STREAM_BOTTOM_RIGHT_CONTROLS)[0].getElementsByTagName("button");
		for (let i = 0; i < buttons.length; i++) {
			if (buttons[i].getAttribute(STREAM_BOTTOM_CONTROLS_ATTRIBUTE) === STREAM_THEATRE_MODE) {
				buttons[i].click();
				return;
			}
		}
	}
}

/**
 * Opens or closes the settings menu
 */
function settings() {
	if (STATE.menu && document.getElementsByClassName(STREAM_SETTINGS_MENU)[1].children[0].children.length === 0) {
		STATE.menu = false;
		return;
	}

	if (checkWatch()) {
		if (STATE.menu) {
			highlight(DIRECTION.remove);
			STATE.selection = 0;
			STATE.menuDepth = 0;
			document.getElementsByClassName(STREAM_CONTROLS_VISIBILITY_CLASS)[1].classList.add(STREAM_CONTROLS_HIDDEN_CLASS);
			document.getElementsByClassName(STREAM_CONTROLS_VISIBILITY_CLASS)[1].classList.remove(STREAM_CONTROLS_VISIBLE_CLASS);
		}

		let buttons = document.getElementsByClassName(STREAM_BOTTOM_RIGHT_CONTROLS)[0].getElementsByTagName("button");
		for (let i = 0; i < buttons.length; i++) {
			if (buttons[i].getAttribute(STREAM_BOTTOM_CONTROLS_ATTRIBUTE) === STREAM_SETTINGS) {
				buttons[i].click();
				break;
			}
		}

		if (!STATE.menu) {
			STATE.menu = true;
			highlight(DIRECTION.none);
			document.getElementsByClassName(STREAM_CONTROLS_VISIBILITY_CLASS)[1].classList.add(STREAM_CONTROLS_VISIBLE_CLASS);
			document.getElementsByClassName(STREAM_CONTROLS_VISIBILITY_CLASS)[1].classList.remove(STREAM_CONTROLS_HIDDEN_CLASS);
		} else {
			STATE.menu = false;
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
	window.location = window.location.href;
}

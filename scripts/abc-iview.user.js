// ==UserScript==
// @name                ABC iview
// @namespace           tarinnik.github.io/media
// @version             3.0
// @include             https://iview.abc.net.au/*
// @icon                https://iview.abc.net.au/favicon.ico
// ==/UserScript==

const BACKGROUND_COLOUR = "background:#326060";
const VIDEO_TAG = "article";
const MY_LIST_BUTTON_CLASS = "iv-2YNoA iv-25IKG iv-1JC6x iv-csH9g iv-3ho3D";
const MY_LIST_URL = "https://iview.abc.net.au/your/watchlist";
const RECENT_URL = "https://iview.abc.net.au/your/recent";
const MY_LIST_MENU_CLASS = "iv-1fREI";
const MY_LIST_COLUMNS = 4;
const SHOW_URL = "https://iview.abc.net.au/show/";
const SHOW_URL_LENGTH = 30;
const SHOW_TITLE_TAG = "h1";
const SHOW_MAIN_VIDEO_CLASS = "iv-x90Qp";
const SHOW_EPISODE_VIDEO_CLASS = "iv-3E9o6";
const VIDEO_FULLSCREEN_CLASS = "jw-icon-fullscreen";
const VIDEO_CLOSE_CLASS = "iv-1LlPw iv-3bAEn iv-Xjw7_ iconLarge iv-3mcSv iv-2Ba9R";

let STATE = {
	selection: 0,
	menu: false,
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
	if (checkList()) {
		STATE.menu = true;
	} else if (checkShow()) {
		document.getElementsByTagName(SHOW_TITLE_TAG)[0].scrollIntoView();
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
			break;
		case '0':
			search();
			break;
		case '.':
			break;
		case '+':
			fullscreen();
			break;
		case '-':
			back();
			break;
		case '/':
			refresh();
			break;
	}
}

/**
 * Checks if the current page is the watchlist
 * @returns {boolean} if the current page is my list
 */
function checkList() {
	return window.location.href === MY_LIST_URL || window.location.href === RECENT_URL;
}

/**
 * Checks if the current page is the show page
 * @returns {boolean} if the current page is the show page
 */
function checkShow() {
	return window.location.href.slice(0, SHOW_URL_LENGTH) === SHOW_URL;
}

/**
 * Gets the elements that are to be selected
 */
function getElements() {
	if (checkList()) {
		if (STATE.menu) {
			return document.getElementsByClassName(MY_LIST_MENU_CLASS)[0].getElementsByTagName("a");
		} else {
			return document.getElementsByTagName(VIDEO_TAG);
		}
	} else if (checkShow()) {
		if (STATE.menu) {

		} else {
			let e = [];
			e.push(document.getElementsByClassName(SHOW_MAIN_VIDEO_CLASS)[0]);
			let episodes = document.getElementsByClassName(SHOW_EPISODE_VIDEO_CLASS)[0].getElementsByTagName(VIDEO_TAG);
			for (let i = 0; i < episodes.length; i++) {
				e.push(episodes[i]);
			}
			return e;
		}
	}
}

/**
 * Gets the number of columns the elements have
 * @returns {number} number of columns
 */
function getColumns() {
	if (checkList()) {
		return MY_LIST_COLUMNS;
	} else {
		return 1;
	}
}

/**
 * Toggles if the menu is selected or not
 */
function toggleMenu() {
	highlight(DIRECTION.remove);
	STATE.menu = !STATE.menu;
	STATE.selection = 0;
	highlight(DIRECTION.none);
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
		highlight(DIRECTION.remove);
		STATE.selection = 0;
		highlight(DIRECTION.none);

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

	// Highlight backwards but at the start of the elements
	} else if (STATE.selection === 0 && d === DIRECTION.backwards) {
		highlight(DIRECTION.remove);
		STATE.selection = elements.length - 1;
		highlight(DIRECTION.none);

	// Highlighting forwards or backwards with an element on the relevant side
	} else {
		highlight(DIRECTION.remove);
		STATE.selection += d;
		highlight(DIRECTION.none);
	}

	if (checkShow()) {
		scroll(STATE.selection, document.getElementsByTagName(SHOW_TITLE_TAG)[0], elements, columns);
	} else {
		scroll(STATE.selection, null, elements, columns);
	}
}

/**
 * 5 (select) was pressed
 */
function select() {
	if (checkList()) {
		if (STATE.menu) {
			getElements()[STATE.selection].click();
		} else {
			getElements()[STATE.selection].getElementsByTagName("a")[0].click();
		}
	} else if (checkShow()) {
		if (STATE.menu) {

		} else {
			getElements()[STATE.selection].getElementsByTagName("button")[2].click();
		}
	}
}

/**
 * 6 (right arrow) was pressed
 */
function right() {
	if (checkList()) {
		highlight(DIRECTION.forwards);
	}
}

/**
 * 4 (left arrow) was pressed
 */
function left() {
	if (checkList()) {
		highlight(DIRECTION.backwards);
	}
}

/**
 * 8 (up arrow) was pressed
 */
function up() {
	if (checkList()) {
		if (!STATE.menu && STATE.selection < MY_LIST_COLUMNS) {
			toggleMenu();
		} else {
			highlight(DIRECTION.up);
		}
	} else if (checkShow()) {
		highlight(DIRECTION.up);
	}

}

/**
 * 2 (down arrow) was pressed
 */
function down() {
	if (checkList()) {
		if (STATE.menu) {
			toggleMenu();
		} else {
			highlight(DIRECTION.down);
		}
	} else if (checkShow()) {
		highlight(DIRECTION.down);
	}
}

/**
 * Scrolls the page so the selected element if visible
 * @param index of elements to scroll to
 * @param defaultPosition to scroll to if in the top row
 * @param onScrollPosition to scroll to if not the top row
 * @param rowLength number of columns in the row
 */
function scroll(index, defaultPosition, onScrollPosition, rowLength) {
	if (index < rowLength) {
		try {
			defaultPosition.scrollIntoView();
		} catch (TypeError) {
			window.scrollTo(0, 0);
		}
	} else {
		onScrollPosition[index - 1].scrollIntoView();
	}
}

function back() {
	document.getElementsByClassName(VIDEO_CLOSE_CLASS)[0].click();
}

/**
 * Makes the video fullscreen
 */
function fullscreen() {
	document.getElementsByClassName(VIDEO_FULLSCREEN_CLASS)[0].click();
}

/**
 * Navigates to the list page
 */
function list() {
	document.getElementsByClassName(MY_LIST_BUTTON_CLASS)[0].click();
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
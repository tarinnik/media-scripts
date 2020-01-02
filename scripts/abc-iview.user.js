// ==UserScript==
// @name                ABC iview
// @namespace           tarinnik.github.io/media
// @version             3.3.2
// @include             https://iview.abc.net.au/*
// @icon                https://iview.abc.net.au/favicon.ico
// ==/UserScript==

const BACKGROUND_COLOUR = "background:#326060";
const HOME_PAGE_CLASS = "iv-1JC6x iv-6HDyC iv-csH9g iv-3f8vH";
const VIDEO_TAG = "article";
const ROOT_URL = "https://iview.abc.net.au/";
const HOME_SECTION_CLASS = "flickity-enabled is-draggable";
const HOME_VIDEO_SELECT_CLASS = "iv-2xRQL";
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
const SHOW_SEASON_SELECTOR = "seriesSelectorButton";
const SHOW_SEASON_BUTTONS = "seriesSelectorMenu";
const VIDEO_FULLSCREEN_CLASS = "jw-icon-fullscreen";
const VIDEO_CLOSE_CLASS = "iv-1LlPw iv-3bAEn iv-Xjw7_ iconLarge iv-3mcSv iv-2Ba9R";

let STATE = {
	selection: 0,
	menu: false,
	videoSelection: 0,
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
		case '.':
			break;
		case '+':
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
 * Checks if the current page is the home page
 * @return {boolean} if the current page is the home page
 */
function checkHome() {
	return window.location.href === ROOT_URL;
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
	// My list or watch history
	if (checkList()) {
		if (STATE.menu) {
			return document.getElementsByClassName(MY_LIST_MENU_CLASS)[0].getElementsByTagName("a");
		} else {
			return document.getElementsByTagName(VIDEO_TAG);
		}

	// Episode page
	} else if (checkShow()) {
		if (STATE.menu) {
			return document.getElementById(SHOW_SEASON_BUTTONS).childNodes;
		} else {
			let e = [];
			e.push(document.getElementsByClassName(SHOW_MAIN_VIDEO_CLASS)[0]);
			let episodes = document.getElementsByClassName(SHOW_EPISODE_VIDEO_CLASS)[0].getElementsByTagName(VIDEO_TAG);
			for (let i = 0; i < episodes.length; i++) {
				e.push(episodes[i]);
			}
			return e;
		}

	// Home page
	} else if (checkHome()) {
		// Selecting a video, not a category
		if (STATE.menu) {
			let e = [];
			let elements = document.getElementsByClassName(HOME_SECTION_CLASS)[STATE.videoSelection].getElementsByTagName("a");
			for (let i = 0; i < elements.length; i++) {
				e.push(elements[i].getElementsByClassName(HOME_VIDEO_SELECT_CLASS)[0]);
			}
			return e;
		} else {
			let e = [];
			let sections = document.getElementsByClassName(HOME_SECTION_CLASS);
			e.push(sections[0]);
			for (let i = 1; i < sections.length; i++) {
				e.push(sections[i].getElementsByTagName("a")[0].getElementsByClassName(HOME_VIDEO_SELECT_CLASS)[0]);
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
 * Swaps STATE.videoSelection and STATE.selection
 */
function swapState() {
	let temp = STATE.selection;
	STATE.selection = STATE.videoSelection;
	STATE.videoSelection = temp;
}

/**
 * Removes the highlighting of a video on the home page
 */
function removeHomeVideoHighlight() {
	if (STATE.menu) {
		swapState();
		highlight(DIRECTION.remove);
		swapState();
		STATE.videoSelection = 0;
		STATE.menu = false;
	}
}

function scrollVideos(d) {
	if (checkHome()) {
		if (d === DIRECTION.forwards && STATE.selection % MY_LIST_COLUMNS === 0 && STATE.selection > 0) {
			getElements()[STATE.selection].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[2].click();
		} else if (d === DIRECTION.backwards && STATE.selection % MY_LIST_COLUMNS === 3) {
			getElements()[STATE.selection].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[1].click();
		}
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
	if (checkList()) {
		if (STATE.menu) {
			getElements()[STATE.selection].click();
		} else {
			getElements()[STATE.selection].getElementsByTagName("a")[0].click();
		}
	} else if (checkShow()) {
		if (STATE.menu) {
			getElements()[STATE.selection].click();
			toggleMenu();
		} else {
			getElements()[STATE.selection].getElementsByTagName("button")[2].click();
		}
	} else if (checkHome()) {
		if (STATE.menu) {
			swapState();
		}
		if (STATE.videoSelection === 0) {
			getElements()[0].getElementsByTagName('a')[0].click();
		} else {
			getElements()[STATE.selection].parentNode.parentNode.click();
		}
	}
}

/**
 * 6 (right arrow) was pressed
 */
function right() {
	if (checkList()) {
		highlight(DIRECTION.forwards);
	} else if (checkHome()) {
		swapState();
		STATE.menu = true;
		highlight(DIRECTION.forwards);
		scrollVideos(DIRECTION.forwards);
		swapState();
	}
}

/**
 * 4 (left arrow) was pressed
 */
function left() {
	if (checkList()) {
		highlight(DIRECTION.backwards);
	} else if (checkHome()) {
		swapState();
		STATE.menu = true;
		highlight(DIRECTION.backwards);
		scrollVideos(DIRECTION.backwards);
		swapState();
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
	} else if (checkHome()) {
		removeHomeVideoHighlight();
		highlight(DIRECTION.backwards);
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
	} else if (checkHome()) {
		removeHomeVideoHighlight();
		highlight(DIRECTION.forwards);
	}
}

/**
 * Scrolls the page so the selected element if visible
 */
function scroll() {
	let columns = getColumns();
	let defaultPosition;
	let elements = getElements();
	if (checkList()) {
		defaultPosition = null;
	} else if (checkShow()) {
		if (STATE.menu) {
			return;
		} else {
			defaultPosition = document.getElementsByTagName(SHOW_TITLE_TAG)[0];
		}
	} else if (checkHome()) {
		if (STATE.menu) {
			return;
		} else {
			defaultPosition = null;
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
 * Selects the season selector
 */
function seasons() {
	if (checkShow()) {
		getElements()[0].scrollIntoView();
		document.getElementById(SHOW_SEASON_SELECTOR).click();
		toggleMenu();
	}
}

/**
 * Closes the video if one is open, otherwise goes to the home page
 */
function back() {
	if (document.getElementsByTagName("video").length !== 0) {
		document.getElementsByClassName(VIDEO_CLOSE_CLASS)[0].click();
	} else {
		document.getElementsByClassName(HOME_PAGE_CLASS)[0].click();
	}
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
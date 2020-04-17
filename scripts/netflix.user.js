// ==UserScript==
// @name        Netflix
// @namespace   tarinnik.github.io/media
// @version	    1.1
// @include	    https://www.netflix.com/*
// @icon        https://www.netflix.com/favicon.ico
// ==/UserScript==

const BACKGROUND_COLOUR = "background:#bf180f;padding:10px";
const PROFILE_URL = "/ProfilesGate";
const PROFILE_CLASS = "profile";
const HOME_URL = "https://www.netflix.com/browse";
const HOME_BILLBOARD_CLASS = "billboard-links button-layer forward-leaning";
const HOME_VIDEO_ROW_CLASS = "lolomoRow lolomoRow_title_card";
const HOME_VIDEO_CLASS = "slider-item";
const HOME_BIG_ROW_CLASS = "lolomoBigRow";
const HOME_MENU_CLASS = "jawBoneCommon";
const HOME_VIDEO_PLAY_CLASS = "jawbone-actions";
const HOME_VIDEO_PLAY_INVISIBLE_CLASS = "visually-hidden";
const HOME_EPISODES_CLASS = "episodeWrapper";
const HOME_SEASON_CLASS = "label";
const HOME_SEASON_ITEM_CLASS = "sub-menu-item";
const HOME_VIDEO_MENU_CLASS = "menu";
const HOME_VIDEO_CLOSE_CLASS = "close-button icon-close";
const WATCH_URL = "https://www.netflix.com/watch";
const WATCH_CLOSE_CLASS = "touchable PlayerControls--control-element nfp-button-control " +
		"circle-control-button button-nfplayerExit tooltip-button tooltip-button-pos-bottom " +
		"tooltip-button-align-right";
const WATCH_CLOSE_CLASS_2 = "touchable PlayerControls--control-element nfp-button-control " +
		"default-control-button button-nfplayerBack tooltip-button tooltip-button-pos-center " +
		"tooltip-button-align-right";
const WATCH_PLAY_CLASS = "button-nfplayerPlay";
const WATCH_PAUSE_CLASS = "button-nfplayerPause";
const WATCH_FULLSCREEN_CLASS = "button-nfplayerFullscreen";
const WATCH_WINDOWED_CLASS = "button-nfplayerWindowed";
const WATCH_SKIP_CREDITS_CLASS = "skip-credits";
const LIST_URL = "https://www.netflix.com/browse/my-list";
const LIST_VIDEO_ROW_CLASS = "rowContainer rowContainer_title_card";
const SHOW_URL = "https://www.netflix.com/title";
const SEARCH_URL = "https://www.netflix.com/search?q=";
const SEARCH_TEXT = "Search: ";

let STATE = {
	selection: 0,
	menu: false,
	videoSection: false,
	videoSelection: 0,
	oldSelection: 0,
	oldVideoSelection: 0,
	season: false,
	search: false,
	numSameKeyPresses: 0,
	lastKeyPressed: '',
	searchQuery: "",
	changingChar: ''
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
	if (checkSearch()) {
		document.getElementsByClassName("searchInput")[0].getElementsByTagName("input")[0].blur();
	}
	newPage();
});

function newPage() {
	STATE.selection = 0;
	STATE.videoSelection = 0;
	STATE.menu = false;

	highlight(DIRECTION.none);
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
	if (!checkAll()) {
		return;
	}

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
			break;
		case '+':
			season();
			break;
		case '-':
			changeProfile();
			break;
		case '*':
			break;
		case '/':
			refresh();
			break;
	}
}

function search() {
	let d = document.createElement("div");
	d.id = "search";
	document.getElementsByTagName("body")[0].insertBefore(d,
		document.getElementById("appMountPoint"));
	let t = document.createElement("h1");
	t.innerHTML = SEARCH_TEXT;
	t.id = "query";
	t.style.paddingLeft = "10px";
	d.appendChild(t);
	window.scrollTo(0, 0);
	STATE.search = true;
}

function searchKey(key) {
	if (key === "Enter") {
		let q = STATE.searchQuery + STATE.changingChar;
		resetSearch();
		window.location = SEARCH_URL + q;
	} else if (key === '-') {
		if (STATE.changingChar !== '') {
			STATE.changingChar = '';
			STATE.lastKeyPressed = '';
			STATE.numSameKeyPresses = 0;
		} else if (STATE.searchQuery.length !== 0) {
			STATE.searchQuery = STATE.searchQuery.slice(0, length - 1);
		}
	} else if (key === '+') {
		resetSearch();
		document.getElementById("search").remove();
	} else if (key !== STATE.lastKeyPressed || key === '.') {
		STATE.searchQuery += STATE.changingChar;
		STATE.changingChar = '';
		STATE.lastKeyPressed = key;
		STATE.numSameKeyPresses = 0;
	}

	let num = parseInt(key);
	if (!isNaN(num)) {
		let len = searchLetters[num].length;
		STATE.changingChar = searchLetters[num][STATE.numSameKeyPresses % len];
		STATE.numSameKeyPresses++;
	}

	document.getElementById("query").innerHTML = SEARCH_TEXT + STATE.searchQuery + STATE.changingChar;
}

function resetSearch() {
	STATE.searchQuery = "";
	STATE.changingChar = '';
	STATE.lastKeyPressed = '';
	STATE.numSameKeyPresses = 0;
	STATE.search = false;
}

function checkProfile() {
	return document.getElementsByClassName(PROFILE_CLASS).length !== 0;
}

/**
 * Checks if the current page is the home page
 * @return {boolean} if the current page is the home page
 */
function checkHome() {
	return window.location.href === HOME_URL && !checkProfile() &&
			!checkVideoPlayOptions() && !checkVideoEpisodesOptions();
}

function checkVideoOptions() {
	return document.getElementsByClassName(HOME_MENU_CLASS).length !== 0;
}

function checkVideoPlayOptions() {
	return document.getElementsByClassName(HOME_VIDEO_PLAY_CLASS).length !== 0;
}

function checkVideoEpisodesOptions() {
	return document.getElementsByClassName(HOME_EPISODES_CLASS).length !== 0;
}

/**
 * Checks if the current page is the watchlist
 * @returns {boolean} if the current page is my list
 */
function checkList() {
	return window.location.href === LIST_URL &&
		!checkVideoPlayOptions() && !checkVideoEpisodesOptions();
}

/**
 * Checks if the current page is the show page
 * @returns {boolean} if the current page is the show page
 */
function checkShow() {
	return window.location.href.slice(0, SHOW_URL.length) === SHOW_URL;
}

/**
 * Checks if the current page is the video
 * @returns {boolean} if the current page is the video
 */
function checkWatch() {
	return window.location.href.slice(0, WATCH_URL.length) === WATCH_URL;
}

function checkSearch() {
	return window.location.href.slice(0, SEARCH_URL.length) === SEARCH_URL &&
		!checkVideoPlayOptions() && !checkVideoEpisodesOptions();
}

function checkAll() {
	return checkHome() || checkVideoOptions() || checkVideoEpisodesOptions() || checkVideoPlayOptions() ||
			checkList() || checkShow() || checkWatch() || checkSearch() || checkProfile();
}

/**
 * Gets the elements that are to be selected
 */
function getElements() {
	if (checkProfile()) {
		return document.getElementsByClassName(PROFILE_CLASS);
	} else if(checkHome()) {
		if (STATE.videoSection) {
			let a = [];
			let j = (document.getElementsByClassName(HOME_BILLBOARD_CLASS)[0].childNodes[0].classList.
					contains(HOME_VIDEO_PLAY_INVISIBLE_CLASS)) ? 1 : 0;
			a.push(document.getElementsByClassName(HOME_BILLBOARD_CLASS)[0].childNodes[j]);
			let e = document.getElementsByClassName(HOME_VIDEO_ROW_CLASS);
			for (let i = 0; i < e.length; i++) {
				if (e[i].classList.contains(HOME_BIG_ROW_CLASS)) {
					a.push(e[i].getElementsByClassName(HOME_BILLBOARD_CLASS)[0].childNodes[0]);
				} else {
					a.push(e[i].getElementsByClassName(HOME_VIDEO_CLASS)[0]);
				}
			}
			return a;
		} else {
			if (STATE.videoSelection === 0) {
				let a = [];
				let e = document.getElementsByClassName(HOME_BILLBOARD_CLASS)[0].getElementsByTagName('a');
				for (let i = 0; i < e.length; i++) {
					if (!e[i].classList.contains(HOME_VIDEO_PLAY_INVISIBLE_CLASS)) {
						a.push(e[i]);
					}
				}
				return a;
			} else {
				let e = document.getElementsByClassName(HOME_VIDEO_ROW_CLASS)[STATE.videoSelection - 1];
				if (e.classList.contains(HOME_BIG_ROW_CLASS)) {
					return e.getElementsByClassName(HOME_BILLBOARD_CLASS)[0].getElementsByTagName('a');
				} else {
					return e.getElementsByClassName(HOME_VIDEO_CLASS);
				}
			}
		}
	} else if (checkVideoOptions() && STATE.menu && !STATE.season) {
		return document.getElementsByClassName(HOME_VIDEO_MENU_CLASS)[0].getElementsByTagName('li');
	} else if (checkVideoPlayOptions()) {
		let a = [];
		let e = document.getElementsByClassName(HOME_VIDEO_PLAY_CLASS)[0].getElementsByTagName('a');
		for (let i = 0; i < e.length; i++) {
			if (!e[i].classList.contains(HOME_VIDEO_PLAY_INVISIBLE_CLASS)) {
				a.push(e[i]);
			}
		}
		return a;
	} else if (checkVideoEpisodesOptions()) {
		if (STATE.season) {
			return document.getElementsByClassName(HOME_SEASON_ITEM_CLASS);
		} else {
			return document.getElementsByClassName(HOME_EPISODES_CLASS)[0].getElementsByClassName(HOME_VIDEO_CLASS);
		}
	} else if (checkList() || checkSearch()) {
		if (STATE.videoSection) {
			let a = [];
			let e = document.getElementsByClassName(LIST_VIDEO_ROW_CLASS);
			for (let i = 0; i < e.length; i++) {
				a.push(e[i].getElementsByClassName(HOME_VIDEO_CLASS)[0]);
			}
			return a;
		} else {
			return document.getElementsByClassName(LIST_VIDEO_ROW_CLASS)[STATE.videoSelection].
					getElementsByClassName(HOME_VIDEO_CLASS);
		}
	} else if (checkShow()) {

	}
}

/**
 * Gets the number of columns the elements have
 * @returns {number} number of columns
 */
function getColumns() {
	return 1;
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

function swapSelection() {
	let tmp = STATE.selection;
	STATE.selection = STATE.videoSelection;
	STATE.videoSelection = tmp;
}

/**
 * 5 (select) was pressed
 */
function select() {
	if (checkProfile()) {
		getElements()[STATE.selection].getElementsByTagName('a')[0].click();
		newPage();
	} else if (checkHome()) {
		highlight(DIRECTION.remove);
		let e = getElements();
		if (e.length === 3) {
			e[STATE.selection].click();
		} else {
			e[STATE.selection].getElementsByTagName('a')[0].click();
		}
		STATE.oldSelection = STATE.selection;
		STATE.oldVideoSelection = STATE.videoSelection;
		newPage();
	} else if (checkVideoPlayOptions()) {
		if (STATE.menu) {
			getElements()[STATE.selection].getElementsByTagName('a')[0].click();
		} else {
			getElements()[STATE.selection].click();
			newPage();
		}
	} else if (checkVideoEpisodesOptions()) {
		if (STATE.season) {
			getElements()[STATE.selection].getElementsByTagName('a')[0].click();
			STATE.season = false;
			STATE.selection = 0;
			highlight(DIRECTION.none);
		} else {
			getElements()[STATE.selection].getElementsByTagName('a')[0].click();
		}
	} else if (checkVideoOptions()) {
		getElements()[STATE.selection].getElementsByTagName('a')[0].click();
	} else if (checkList() || checkSearch()) {
		highlight(DIRECTION.remove);
		getElements()[STATE.selection].getElementsByTagName('a')[0].click();
		STATE.oldSelection = STATE.selection;
		STATE.oldVideoSelection = STATE.videoSelection;
		newPage();
	} else if (checkShow()) {

	} else if (checkWatch()) {
		if (document.getElementsByClassName(WATCH_SKIP_CREDITS_CLASS).length > 0) {
			document.getElementsByClassName(WATCH_SKIP_CREDITS_CLASS)[0].getElementsByTagName('a')[0].click();
		}
	}
}

/**
 * 6 (right arrow) was pressed
 */
function right() {
	if (checkProfile()) {
		highlight(DIRECTION.forwards);
	} else if (checkHome()) {
		highlight(DIRECTION.forwards);
	} else if (checkVideoPlayOptions() || checkVideoEpisodesOptions() ||(checkVideoOptions() && STATE.menu)) {
		highlight(DIRECTION.forwards);
	} else if (checkList() || checkSearch()) {
		highlight(DIRECTION.forwards);
	} else if (checkShow()) {

	}
}

/**
 * 4 (left arrow) was pressed
 */
function left() {
	if (checkProfile()) {
		highlight(DIRECTION.backwards);
	} else if (checkHome()) {
		highlight(DIRECTION.backwards);
	} else if (checkVideoPlayOptions() || checkVideoEpisodesOptions() ||(checkVideoOptions() && STATE.menu)) {
		highlight(DIRECTION.backwards);
	} else if (checkList() || checkSearch()) {
		highlight(DIRECTION.backwards);
	} else if (checkShow()) {

	}
}

/**
 * 8 (up arrow) was pressed
 */
function up() {
	if (checkHome() || checkList() || checkSearch()) {
		STATE.videoSection = true;
		highlight(DIRECTION.remove);
		STATE.selection = 0;
		swapSelection();
		highlight(DIRECTION.backwards);
		swapSelection();
		STATE.videoSection = false;
	} else if (checkVideoPlayOptions() || checkVideoEpisodesOptions()) {
		if (STATE.season) {
			highlight(DIRECTION.backwards);
		} else if (STATE.menu) {
			highlight(DIRECTION.remove);
			STATE.selection = 0;
			STATE.menu = false;
			highlight(DIRECTION.none);
		}
	} else if (checkList()) {
		// Used in the checkHome() branch cause it's the same
	} else if (checkShow()) {

	}
}

/**
 * 2 (down arrow) was pressed
 */
function down() {
	if (checkHome() || checkList() || checkSearch()) {
		STATE.videoSection = true;
		highlight(DIRECTION.remove);
		STATE.selection = 0;
		swapSelection();
		highlight(DIRECTION.forwards);
		swapSelection();
		STATE.videoSection = false;
	} else if (checkVideoPlayOptions() || checkVideoEpisodesOptions()) {
		if (STATE.season) {
			highlight(DIRECTION.forwards);
		} else if (!STATE.menu) {
			highlight(DIRECTION.remove);
			STATE.selection = 0;
			STATE.menu = true;
			highlight(DIRECTION.none);
		}
	} else if (checkList()) {
		// Used in the checkHome() branch cause it's the same
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
	if (checkProfile()) {
		return;
	} else if (checkHome()) {
		if (!STATE.videoSection) {
			return;
		}
	} else if (checkVideoOptions()) {
		return;
	} else if (checkList() || checkSearch()) {
		if (!STATE.videoSection) {
			return;
		}
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
 * Goes to the profile select menu
 */
function changeProfile() {
	window.location = PROFILE_URL;
}

/**
 * Selects the season menu
 */
function season() {
	if (checkVideoEpisodesOptions()) {
		highlight(DIRECTION.remove);
		STATE.season = !STATE.season;
		document.getElementsByClassName(HOME_SEASON_CLASS)[0].click();
		STATE.selection = 0;
		highlight(DIRECTION.none);
	}
}

/**
 * Toggles the play state of the video
 */
function playpause() {
	if (checkWatch()) {
		if (document.getElementsByClassName(WATCH_PLAY_CLASS).length !== 0) {
			document.getElementsByClassName(WATCH_PAUSE_CLASS)[0].click();
		} else {
			document.getElementsByClassName(WATCH_PLAY_CLASS)[0].click();
		}
	}
}

/**
 * Makes the video fullscreen
 */
function fullscreen() {
	if (checkWatch()) {
		if (document.getElementsByClassName(WATCH_FULLSCREEN_CLASS).length > 0) {
			document.getElementsByClassName(WATCH_FULLSCREEN_CLASS)[0].click();
		} else {
			document.getElementsByClassName(WATCH_WINDOWED_CLASS)[0].click();
		}
	}
}

/**
 * Closes the video if one is open, otherwise goes to the home page
 */
function back() {
	console.log(checkVideoOptions());
	if (checkWatch()) {
		try {
			document.getElementsByClassName(WATCH_CLOSE_CLASS)[0].click();
		} catch(TypeError) {}
		try {
			document.getElementsByClassName(WATCH_CLOSE_CLASS_2)[0].click();
		} catch(TypeError) {}
	} else if (checkShow()) {
		window.location = HOME_URL;
	} else if (checkVideoOptions()) {
		console.log('Close video details');
		document.getElementsByClassName(HOME_VIDEO_CLOSE_CLASS)[0].click();
		STATE.selection = STATE.oldSelection;
		STATE.videoSelection = STATE.oldVideoSelection;
		STATE.menu = false;
		highlight(DIRECTION.none);
	} else {
		window.location = HOME_URL;
	}
}

/**
 * Navigates to the list page
 */
function list() {
	if (!checkWatch()) {
		window.location = LIST_URL;
	}
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
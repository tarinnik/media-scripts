// ==UserScript==
// @name     	Youtube
// @namespace	tarinnik.github.io/media
// @version  	0.2
// @include		https://www.youtube.com/*
// @icon		https://youtube.com/favicon.ico
// ==/UserScript==

const BACKGROUND_COLOUR = "background:red";
const HOME_VIDEOS_ID = "contents";
const MENU_ID = "sections";
const SUB_VIDEOS_ID = "items";
const SUBSCRIPTION_BOX = "style-scope ytd-guide-renderer";
const SUBSCRIPTION_TAG_NAME = "style-scope ytd-guide-section-renderer";
const ROOT_URL = "https://www.youtube.com/";
const WATCH_URL = "https://www.youtube.com/watch?v=";
const SUBS_URL = "https://www.youtube.com/feed/subscriptions";
const CHANNEL_VIDEOS = "/videos";
const CHANNEL_URL_LENGTH = 31;
const EMBED_URL_LENGTH = 30;
const SCROLL_COLUMNS_TAG = "ytd-browse";
const SCROLL_COLUMNS_STYLE = "--ytd-rich-grid-items-per-row";

// Redirecting embeded youtube links to full youtube
if (window.location.href.slice(0, EMBED_URL_LENGTH) === "https://www.youtube.com/embed/") {
	let url = window.location.href;
	let videoID = url.slice(30, 41);
	window.location = WATCH_URL + videoID;
}

const SECTION = {
	homeVideos: 0,
	menu: 1,
	subVideos: 2,
};

const DIRECTION = {
	none: 0,
	forwards: 1,
	backwards: -1,
};

let STATE = {
	section: SECTION.homeVideos,
	selection: 0,
};

window.addEventListener('load', function () {
	checkLocation();
	highlight(DIRECTION.none);
});

document.addEventListener('keydown', function(event) {
	key(event);
});

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
			close();
			break;
		case '0':
			search();
			break;
		case 'Enter':
			playpause();
			break;
	}
}

function checkLocation() {
	switch (window.location.href) {
		case ROOT_URL:
			STATE.section = SECTION.homeVideos;
			break;
		case SUBS_URL:
			STATE.section = SECTION.subVideos;
			break;
	}
}

function checkHome() {
	return STATE.section === SECTION.homeVideos;
}

function checkMenu() {
	return STATE.section === SECTION.menu;
}

function checkSubs() {
	return STATE.section === SECTION.subVideos;
}

function getElements(section) {
	switch (section) {
		case SECTION.homeVideos:
			return document.getElementById(HOME_VIDEOS_ID).childNodes;
		case SECTION.menu:
			return document.getElementById(MENU_ID).childNodes;
		case SECTION.subVideos:
			return document.getElementById(SUB_VIDEOS_ID).childNodes;
	}
}

function getNumColumns() {
	let a = document.getElementsByTagName(SCROLL_COLUMNS_TAG)[0].getAttribute("style");
	let i = a.indexOf(SCROLL_COLUMNS_STYLE);
	a = a.slice(i, a.length);
	a = a.split(':')[1];
	return parseInt(a);
}

function scroll(index, defaultPosition, onScrollPosition, rowLength) {
	if (checkHome() || checkSubs()) {
		if (index < rowLength) {
			try {
				defaultPosition.scrollIntoView();
			} catch (TypeError) {
				window.scrollTo(0, 0);
			}
		} else {
			onScrollPosition[index - rowLength].scrollIntoView();
		}
	}
}

/**
 * Highlights the selected item
 * @param direction to highlight
 */
function highlight(direction) {
	let elements = getElements(STATE.section);
	if (STATE.selection === 0 && direction === DIRECTION.backwards) {
		if (checkHome() || checkSubs()) {
			elements[0].removeAttribute("style");
			STATE.section = SECTION.menu;
			STATE.selection = 0;
			highlight(DIRECTION.none);
		} else {
			STATE.selection = elements.length - 1;
			elements[0].removeAttribute("style");
			elements[STATE.selection].setAttribute("style", BACKGROUND_COLOUR);
		}
	} else if (STATE.selection === elements.length - 1 && direction === DIRECTION.forwards) {
		STATE.selection = 0;
		elements[elements.length - 1].removeAttribute("style");
		elements[STATE.selection].setAttribute("style", BACKGROUND_COLOUR);
	} else {
		STATE.selection += direction;
		elements[STATE.selection - direction].removeAttribute("style");
		elements[STATE.selection].setAttribute("style", BACKGROUND_COLOUR);
	}
	if (checkHome() || checkSubs()) {
		scroll(STATE.selection, null, getElements(STATE.section), getNumColumns());
	}
}

function right() {
	if (checkHome() || checkSubs()) {
		highlight(DIRECTION.forwards);
	} else if (checkMenu()) {
		getElements(STATE.section)[STATE.selection].removeAttribute("style");
		checkLocation();
		STATE.selection = 0;
		highlight(DIRECTION.none);
	}
}

function left() {
	if (checkHome() || checkSubs()) {
		highlight(DIRECTION.backwards);
	}
}

function up() {
	if (checkMenu()) {
		highlight(DIRECTION.backwards);
	}
}

function down() {
	if (checkMenu()) {
		highlight(DIRECTION.forwards);
	}
}

function select() {
	if (checkHome() || checkSubs()) {
		getElements(STATE.section)[STATE.selection].getElementsByTagName("a")[0].click();
	}
}

function home() {
	window.location = "https://tarinnik.github.io/media/";
}
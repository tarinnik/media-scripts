// ==UserScript==
// @name     	Youtube
// @namespace	tarinnik.github.io/media
// @version  	0.1
// @include		https://www.youtube.com/*
// @icon		https://youtube.com/favicon.ico
// ==/UserScript==

const BACKGROUND_COLOUR = "background:red";
const HOME_VIDEOS_ID = "contents";
const SUBSCRIPTION_BOX = "style-scope ytd-guide-renderer";
const SUBSCRIPTION_TAG_NAME = "style-scope ytd-guide-section-renderer";
const ROOT_URL = "https://www.youtube.com/";
const WATCH_URL = "https://www.youtube.com/watch?v=";
const RECENTS_URL = "https://www.youtube.com/feed/subscriptions";
const CHANNEL_VIDEOS = "/videos";
const CHANNEL_URL_LENGTH = 31;
const EMBED_URL_LENGTH = 30;

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

function getElements(section) {
	switch (section) {
		case SECTION.homeVideos:
			return document.getElementById(HOME_VIDEOS_ID).childNodes;
		case SECTION.menu:
			return;
		case SECTION.subVideos:
			return;
	}
}

/**
 * Highlights the selected item
 * @param direction to highlight
 */
function highlight(direction) {
	let elements = getElements(STATE.section);
	if (STATE.selection === 0 && direction === DIRECTION.backwards) {
		STATE.selection = elements.length - 1;
		elements[0].removeAttribute("style");
		elements[STATE.selection].setAttribute("style", BACKGROUND_COLOUR);
	} else if (STATE.selection === elements.length - 1 && direction === DIRECTION.forwards) {
		STATE.selection = 0;
		elements[elements.length - 1].removeAttribute("style");
		elements[STATE.selection].setAttribute("style", BACKGROUND_COLOUR);
	} else {
		STATE.selection += direction;
		elements[STATE.selection - direction].removeAttribute("style");
		elements[STATE.selection].setAttribute("style", BACKGROUND_COLOUR);
	}
}

function right() {
	highlight(DIRECTION.forwards);
}

function left() {
	highlight(DIRECTION.backwards);
}

function select() {
	getElements(STATE.section)[STATE.selection].getElementsByTagName("a")[0].click();
}

function home() {
	window.location = "https://tarinnik.github.io/media/";
}
// ==UserScript==
// @name     	Youtube
// @namespace	tarinnik.github.io/media
// @version  	0.3
// @include		https://www.youtube.com/*
// @icon		https://youtube.com/favicon.ico
// ==/UserScript==

const BACKGROUND_COLOUR = "background:red";
const HOME_VIDEOS_ID = "contents";
const MENU_ID = "sections";
const SUB_VIDEOS_ID = "items";
const HOME_ID = "logo";
const SUBSCRIPTION_BOX = "style-scope ytd-guide-renderer";
const SUBSCRIPTION_TAG_NAME = "style-scope ytd-guide-section-renderer";
const ROOT_URL = "https://www.youtube.com/";
const WATCH_URL = "https://www.youtube.com/watch?v=";
const SUBS_URL = "https://www.youtube.com/feed/subscriptions";
const CHANNEL_URL = "https://www.youtube.com/channel"
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
	none: -1,
	homeVideos: 0,
	menu: 1,
	subVideos: 2,
	watch: 3,
	channel: 4,
	trending: 5,
};

const DIRECTION = {
	none: 0,
	forwards: 1,
	backwards: -1,
};

let STATE = {
	section: SECTION.homeVideos,
	selection: 0,
	menuExpanded: false,
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
	let url = window.location.href;
	if (url === ROOT_URL) {
		STATE.section = SECTION.homeVideos;
	} else if (url === SUBS_URL) {
		STATE.section = SECTION.subVideos;
	} else if (url.slice(0, CHANNEL_URL_LENGTH) === CHANNEL_URL) {
		STATE.section = SECTION.channel;
	} else {
		STATE.section = SECTION.none;
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

function getMenuElement(main) {
	let a = [];
	let b = main[0].getElementsByTagName("div")[0].childNodes;
	for (let i = 0; i < 3; i++) {
		a.push(b[i]);
	}
	a.push(b[3].getElementsByTagName("div")[0]);
	for (let i = 0; i < 5; i++) {
		a.push(b[3].getElementsByTagName("div")[2].getElementsByTagName("ytd-guide-entry-renderer")[i]);
	}

	let subs = main[1].getElementsByTagName("div")[0].childNodes;
	if (!STATE.menuExpanded) {
		for (let i = 0; i < subs.length; i++) {
			a.push(subs[i]);
		}
	} else {
		for (let i = 0; i < subs.length - 1; i++) {
			a.push(subs[i]);
		}
		let moreSubs = subs[subs.length -1].getElementsByTagName("div")[2].childNodes;
		for (let i = 0; i < moreSubs.length; i++) {
			a.push(moreSubs[i]);
		}
		a.push(subs[subs.length -1].getElementsByTagName("div")[1].childNodes[3]);
	}

	return a;
}

function getElements(section) {
	switch (section) {
		case SECTION.homeVideos:
			return document.getElementById(HOME_VIDEOS_ID).childNodes;
		case SECTION.menu:
			return getMenuElement(document.getElementById(MENU_ID).childNodes);
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
	} else if (checkMenu()) {
		let elements = getElements(STATE.section);
		if (STATE.selection === elements.length - 1) {
			if (STATE.menuExpanded) {
				elements[STATE.selection].click();
				STATE.menuExpanded = !STATE.menuExpanded;
				elements = getElements(STATE.section);
				STATE.selection = elements.length - 1;
			} else {
				elements[STATE.selection].getElementsByTagName("ytd-guide-entry-renderer")[0].click();
				STATE.menuExpanded = !STATE.menuExpanded;
			}
			elements[STATE.selection].removeAttribute("style");
			highlight(DIRECTION.none);
		} else {
			elements[STATE.selection].click();
			STATE.selection = 0;
			setTimeout(function () {
				checkLocation();
			}, 750);
		}
	}
}

function close() {
	document.getElementById(HOME_ID).click();
	STATE.section = SECTION.homeVideos;
	STATE.selection = 0;
}

function home() {
	window.location = "https://tarinnik.github.io/media/";
}
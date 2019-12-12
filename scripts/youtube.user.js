// ==UserScript==
// @name     	Youtube
// @namespace	tarinnik.github.io/media
// @version  	0.6.1
// @include		https://www.youtube.com/*
// @icon		https://youtube.com/favicon.ico
// ==/UserScript==

const BACKGROUND_COLOUR = "background:red";
const PAGE_ID = "page-manager";
const BROWSE_VIDEOS_TAG = "ytd-browse";
const PAGE_ATTRIBUTE = "page-subtype";
const HOME_VIDEOS_SUBTYPE = "home";
const MENU_ID = "sections";
const HOME_ID = "logo";
const SUB_TAG_1 = "ytd-grid-renderer";
const SUB_TAG_2 = "div";
const SUB_COLUMN_TAG = "ytd-two-column-browse-results-renderer";
const SECTION_TAG_NAME = "ytd-rich-section-renderer";
const ROOT_URL = "https://www.youtube.com/";
const WATCH_URL = "https://www.youtube.com/watch?v=";
const WATCH_URL_LENGTH = 32;
const SUBS_URL = "https://www.youtube.com/feed/subscriptions";
const CHANNEL_URL = "https://www.youtube.com/channel";
const CHANNEL_URL_LENGTH = 31;
const EMBED_URL_LENGTH = 30;
const SCROLL_COLUMNS_TAG = "ytd-browse";
const SCROLL_COLUMNS_STYLE = "--ytd-rich-grid-items-per-row";
const LEFT_PLAYER_CONTROLS_CLASS = "ytp-left-controls";
const PLAY_INDEX = 1;
const RIGHT_PLAYER_CONTROLS_CLASS = "ytp-right-controls";
const THEATRE_INDEX = 6;
const FULLSCREEN_INDEX = 8;

// Redirecting embeded youtube links to full youtube
if (window.location.href.slice(0, EMBED_URL_LENGTH) === "https://www.youtube.com/embed/") {
	let url = window.location.href;
	let videoID = url.slice(30, 41);
	window.location = WATCH_URL + videoID;
}

const DIRECTION = {
	remove: 'r',
	none: 0,
	forwards: 1,
	backwards: -1,
	up: 2,
	down: 3,
};

let STATE = {
	selection: 0,
	inMenu: false,
	menuExpanded: false,
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
			theatre();
			break;
		case '+':
			fullscreen();
			break;
		case '-':
			close();
			break;
		case 'Enter':
			playpause();
			break;
		case '/':
			refresh();
			break;
	}
}

function newPage() {
	setTimeout(function () {
		STATE.selection = 0;
		highlight(DIRECTION.none);
	}, 500);
}

function checkHome() {
	return window.location.href === ROOT_URL && !checkMenu();
}

function checkMenu() {
	return STATE.inMenu;
}

function checkSubs() {
	return window.location.href === SUBS_URL && !checkMenu();
}

function checkWatch() {
	return window.location.href.slice(0, WATCH_URL_LENGTH) === WATCH_URL;
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

function getSubElements() {
	let a = [];
	let sections = document.getElementsByTagName(SUB_TAG_1);
	for (let i = 0; i < sections.length; i++) {
		let videos = sections[i].getElementsByTagName(SUB_TAG_2)[0].childNodes;
		for (let j = 0; j < videos.length; j++) {
			a.push(videos[j]);
		}
	}
	return a;
}


function getElements() {
	if (checkHome()) {
		let elements = document.getElementById(PAGE_ID).getElementsByTagName(BROWSE_VIDEOS_TAG);
		for (let i = 0; i < elements.length; i++) {
			if (elements[i].getAttribute(PAGE_ATTRIBUTE) === HOME_VIDEOS_SUBTYPE) {
				let more = elements[i].getElementsByTagName("ytd-rich-grid-renderer")[0].getElementsByTagName("div");
				for (let j = 0; j < more.length; j++) {
					if (more[j].getAttribute("id") === "contents") {
						return more[j].childNodes;
					}
				}
			}
		}
	} else if (checkMenu()) {
		return getMenuElement(document.getElementById(MENU_ID).childNodes);
	} else if (checkSubs()) {
		return getSubElements();
	}
}

function getNumColumns() {
	if (checkHome()) {
		let a = document.getElementsByTagName(SCROLL_COLUMNS_TAG)[0].getAttribute("style");
		let i = a.indexOf(SCROLL_COLUMNS_STYLE);
		a = a.slice(i, a.length);
		a = a.split(':')[1];
		return parseInt(a);
	} else if (checkSubs()) {
		let e = document.getElementsByTagName(SUB_COLUMN_TAG)[0].getAttribute("class");
		let i = e.indexOf("grid");
		return parseInt(e.slice(i, e.length - 1).split('-')[1]);
	}
}

function sectionElement(direction) {
	let elements = getElements();
	if (direction === DIRECTION.none) {
		return (elements[STATE.selection].localName === SECTION_TAG_NAME) ? 0 : -1;
	}
	let rowLength = getNumColumns();
	let i;
	let s = false;
	for (i = 1; i < rowLength; i++) {
		if (elements[STATE.selection + (direction * i)].localName === SECTION_TAG_NAME) {
			s = true;
			break;
		}
	}
	return (s) ? i : -1;

}

function scroll(index, defaultPosition, onScrollPosition, rowLength) {
	if (index < rowLength) {
		try {
			defaultPosition.scrollIntoView();
		} catch (TypeError) {
			window.scrollTo(0, 0);
		}
	} else {
		let i = sectionElement(DIRECTION.backwards);
		let scrollNum = (i === -1) ? rowLength : i;
		onScrollPosition[index - scrollNum].scrollIntoView();
	}
}

/**
 * Highlights the selected item
 * @param direction to highlight
 */
function highlight(direction) {
	let elements = getElements();
	if (direction === DIRECTION.remove) {
		elements[STATE.selection].removeAttribute("style");
	} else if (STATE.selection === 0 && direction === DIRECTION.backwards) {
		if (checkHome() || checkSubs()) {
			elements[0].removeAttribute("style");
			STATE.inMenu = true;
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

	// Direction up or down, but only if left and right are unavailable
	} else if (direction === DIRECTION.up || direction === DIRECTION.down) {
		let multiplier = (direction === DIRECTION.up) ? -1 : 1;
		let s = (direction === DIRECTION.up) ? sectionElement(DIRECTION.backwards) : sectionElement(DIRECTION.forwards);
		if (s !== -1) {
			elements[STATE.selection].removeAttribute("style");
			STATE.selection += (s * multiplier);
			elements[STATE.selection].setAttribute("style", BACKGROUND_COLOUR);
		} else if (direction === DIRECTION.down && sectionElement(DIRECTION.none) === 0) {
			highlight(DIRECTION.forwards);
		} else {
			elements[STATE.selection].removeAttribute("style");
			STATE.selection += (getNumColumns() * multiplier);
			elements[STATE.selection].setAttribute("style", BACKGROUND_COLOUR);
		}
	} else {
		STATE.selection += direction;
		elements[STATE.selection - direction].removeAttribute("style");
		elements[STATE.selection].setAttribute("style", BACKGROUND_COLOUR);
	}
	if (checkHome() || checkSubs()) {
		scroll(STATE.selection, null, getElements(), getNumColumns());
	} else if (checkMenu()) {
		scroll(STATE.selection, null, getElements(), 1);
	}
}

function right() {
	if (checkMenu()) {
		getElements()[STATE.selection].removeAttribute("style");
		STATE.selection = 0;
		STATE.inMenu = false;
		highlight(DIRECTION.none);
	} else if (checkHome() || checkSubs()) {
		highlight(DIRECTION.forwards);
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
	} else if (checkHome() || checkSubs()) {
		highlight(DIRECTION.up);
	}
}

function down() {
	if (checkMenu()) {
		highlight(DIRECTION.forwards);
	} else if (checkHome() || checkSubs()) {
		highlight(DIRECTION.down);
	}
}

function select() {
	if (checkHome() || checkSubs()) {
		getElements()[STATE.selection].getElementsByTagName("a")[0].click();
	} else if (checkMenu()) {
		let elements = getElements();
		if (STATE.selection === elements.length - 1) {
			if (STATE.menuExpanded) {
				elements[STATE.selection].click();
				STATE.menuExpanded = false;
				elements = getElements();
				STATE.selection = elements.length - 1;
			} else {
				elements[STATE.selection].getElementsByTagName("ytd-guide-entry-renderer")[0].click();
				elements[STATE.selection].removeAttribute("style");
				STATE.menuExpanded = true;
				highlight(DIRECTION.none);
			}
		} else {
			highlight(DIRECTION.remove);
			STATE.inMenu = false;
			elements[STATE.selection].click();
			newPage();
		}
	}
}

function fullscreen() {
	document.getElementsByClassName(RIGHT_PLAYER_CONTROLS_CLASS)[0].childNodes[FULLSCREEN_INDEX].click();
}

function theatre() {
	document.getElementsByClassName(RIGHT_PLAYER_CONTROLS_CLASS)[0].childNodes[THEATRE_INDEX].click();
}

function playpause() {
	document.getElementsByClassName(LEFT_PLAYER_CONTROLS_CLASS)[0].childNodes[PLAY_INDEX].click();
}

function close() {
	if (checkWatch()) {
		window.history.go(-1);
		newPage();
	} else {
		try {
			highlight(DIRECTION.remove);
		} catch (Error) {}
		document.getElementById(HOME_ID).getElementsByTagName("a")[0].click();
		STATE.inMenu = false;
		newPage();
	}
}

function home() {
	window.location = "https://tarinnik.github.io/media/";
}

function refresh() {
	window.location = window.location.href;
}
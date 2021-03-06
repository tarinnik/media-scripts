// ==UserScript==
// @name     	Youtube
// @namespace	tarinnik.github.io/media
// @version  	0.11.2
// @include     https://www.youtube.com/*
// @icon        https://youtube.com/favicon.ico
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
const CHANNEL_URL = "https://www.youtube.com/user";
const CHANNEL_URL_2 = "https://www.youtube.com/channel";
const EMBED_URL_LENGTH = 30;
const SCROLL_COLUMNS_TAG = "ytd-browse";
const SCROLL_COLUMNS_STYLE = "--ytd-rich-grid-items-per-row";
const LEFT_PLAYER_CONTROLS_CLASS = "ytp-left-controls";
const PLAY_INDEX = 1;
const RIGHT_PLAYER_CONTROLS_CLASS = "ytp-right-controls";
const THEATRE_BUTTON_CLASS = "ytp-size-button";
const FULLSCREEN_BUTTON_CLASS = "ytp-fullscreen-button";
const SEARCH_ID = "search-form";
const SEARCH_URL = "https://www.youtube.com/results?search_query=";
const SEARCH_URL_LENGTH = 45;
const SEARCH_VIDEOS_TAG = "ytd-search";
const VIDEO_TAG = "ytd-video-renderer";
const CHANNEL_TAB_ID = "tabsContent";
const CHANNEL_TAB_ITEMS_TAG = "paper-tab";
const CHANNEL_VIDEOS_TAG_1 = "ytd-grid-renderer";
const CHANNEL_VIDEOS_TAG_2 = "ytd-grid-video-renderer";
const CHANNEL_PLAYLIST_TAG = "ytd-grid-playlist-renderer";
const MINIPLAYER_CLOSE = "ytp-miniplayer-close-button ytp-button";
const TRENDING_URL = "https://www.youtube.com/feed/trending";
const TRENDING_TAG1 = "ytd-expanded-shelf-contents-renderer";
const TRENDING_TAG2 = "ytd-video-renderer";
const TRENDING_SECTION_TAG = "ytd-channel-list-sub-menu-avatar-renderer";

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

const CHANNEL_LOCATION = {
	none: 0,
	home: '',
	home2: 'featured',
	videos: 'videos',
	playlists: 'playlists',
	community: 'community',
	channels: 'channels',
	about: 'about',
};

let STATE = {
	selection: 0,
	inMenu: false,
	menuExpanded: false,
	channelMenu: true,
	search: false,
	numSameKeyPresses: 0,
	lastKeyPressed: '',
	searchQuery: "",
	changingChar: ''
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

window.addEventListener('load', function () {
	highlight(DIRECTION.none);
});

document.addEventListener('keydown', function(event) {
	key(event);
});

function key(event) {
	if (document.activeElement.tagName === "INPUT") return;

	if (STATE.search) {
		searchKey(event.key);
		return;
	}

	switch (event.key) {
		case '1':
			console.log("1 pressed");
			list();
			break;
		case '2':
			console.log("2 pressed");
			down();
			break;
		case '3':
			console.log("3 pressed");
			break;
		case '4':
			console.log("4 pressed");
			left();
			break;
		case '5':
			console.log("5 pressed");
			select();
			break;
		case '6':
			console.log("6 pressed");
			right();
			break;
		case '7':
			console.log("7 pressed");
			home();
			break;
		case '8':
			console.log("8 pressed");
			up();
			break;
		case '9':
			console.log("9 pressed");
			break;
		case '0':
			console.log("0 pressed");
			search();
			break;
		case '.':
			console.log(". pressed");
			theatre();
			break;
		case '+':
			console.log("+ pressed");
			fullscreen();
			break;
		case '-':
			console.log("- pressed");
			close();
			break;
		case 'Enter':
			console.log("enter pressed");
			playpause();
			break;
		case '/':
			console.log("/ pressed");
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

function checkTrending() {
	return window.location.href.slice(0, TRENDING_URL.length) === TRENDING_URL && !checkMenu();
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

function checkSearch() {
	return window.location.href.slice(0, SEARCH_URL_LENGTH) === SEARCH_URL;
}

function checkChannel() {
	return window.location.href.slice(0, CHANNEL_URL.length) === CHANNEL_URL ||
			window.location.href.slice(0, CHANNEL_URL_2.length) === CHANNEL_URL_2;
}

function checkChannelLocation() {
	let location = window.location.href.split('/')[5];
	if (location === CHANNEL_LOCATION.home) {
		return CHANNEL_LOCATION.home;
	} else if (location === CHANNEL_LOCATION.home2) {
		return CHANNEL_LOCATION.home2;
	} else if (location === CHANNEL_LOCATION.videos) {
		return CHANNEL_LOCATION.videos;
	} else if (location === CHANNEL_LOCATION.playlists) {
		return CHANNEL_LOCATION.playlists;
	} else {
		return CHANNEL_LOCATION.none;
	}
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

function getChannelElements() {
	// Channel menu
	if (STATE.channelMenu) {
		let e = document.getElementById(CHANNEL_TAB_ID).getElementsByTagName(CHANNEL_TAB_ITEMS_TAG);
		let final = [];
		for (let i = 0; i < e.length - 1; i++) {
			final.push(e[i]);
		}
		return final;
	}
	let l = checkChannelLocation();
	switch (l) {
		case CHANNEL_LOCATION.videos:
			let e = document.getElementsByTagName(SUB_COLUMN_TAG);
			for (let i = 0; i < e.length; i++) {
				if (e[i].getAttribute("page-subtype") === "channels") {
					return e[i].getElementsByTagName(CHANNEL_VIDEOS_TAG_1)[0].getElementsByTagName(CHANNEL_VIDEOS_TAG_2);
				}
			}
			break;
		case CHANNEL_LOCATION.playlists:
			return document.getElementsByTagName(SUB_COLUMN_TAG)[0].getElementsByTagName(CHANNEL_PLAYLIST_TAG);
	}
}

function getTrendingElements() {
	if (STATE.channelMenu) {
		return document.getElementsByTagName(TRENDING_SECTION_TAG);
	} else {
		return document.getElementsByTagName(TRENDING_TAG1)[0].getElementsByTagName(TRENDING_TAG2);
	}
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
	} else if (checkSearch()) {
		return document.getElementById(PAGE_ID).getElementsByTagName(SEARCH_VIDEOS_TAG)[0].getElementsByTagName(VIDEO_TAG);
	} else if (checkChannel()) {
		return getChannelElements();
	} else if (checkTrending()) {
		return getTrendingElements();
	}
}

function getNumColumns() {
	if (checkHome()) {
		let a = document.getElementsByTagName(SCROLL_COLUMNS_TAG)[0].getAttribute("style");
		let i = a.indexOf(SCROLL_COLUMNS_STYLE);
		a = a.slice(i, a.length);
		a = a.split(':')[1];
		return parseInt(a);
	} else if (checkSubs() || checkChannel()) {
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

	//Scrolling
	if (checkHome() || checkSubs() || (checkChannel() && !STATE.channelMenu)) {
		scroll(STATE.selection, null, getElements(), getNumColumns());
	} else if (checkSearch() || (checkTrending() && !STATE.channelMenu)) {
		scroll(STATE.selection, null, getElements(), 1);
	} else if (checkMenu()) {
		scroll(STATE.selection, getElements()[0], getElements(), 1);
	}
}

function right() {
	if (checkMenu()) {
		getElements()[STATE.selection].removeAttribute("style");
		STATE.selection = 0;
		STATE.inMenu = false;
		highlight(DIRECTION.none);
	} else if (checkHome() || checkSubs() || checkChannel()) {
		highlight(DIRECTION.forwards);
	} else if (checkTrending() && STATE.channelMenu) {
		highlight(DIRECTION.forwards);
	}
}

function left() {
	if (checkHome() || checkSubs() || checkChannel()) {
		highlight(DIRECTION.backwards);
	} else if (checkTrending()) {
		if (STATE.selection === 0 && STATE.channelMenu) {
			highlight(DIRECTION.remove);
			STATE.inMenu = true;
			highlight(DIRECTION.none);
		} else if (checkTrending() && STATE.channelMenu){
			highlight(DIRECTION.backwards);
		}
	}
}

function up() {
	if (checkMenu() || checkSearch()) {
		highlight(DIRECTION.backwards);
	} else if (checkHome() || checkSubs()) {
		highlight(DIRECTION.up);
	} else if (checkChannel()) {
		if (!STATE.channelMenu && STATE.selection < getNumColumns()) {
			highlight(DIRECTION.remove);
			STATE.channelMenu = true;
			if (checkChannelLocation() === CHANNEL_LOCATION.videos) STATE.selection = 1;
			else if (checkChannelLocation() === CHANNEL_LOCATION.playlists) STATE.selection = 2;
			highlight(DIRECTION.none);
		} else if (!STATE.channelMenu) {
			highlight(DIRECTION.up);
		}
	} else if (checkTrending()) {
		if (!STATE.channelMenu && STATE.selection === 0) {
			highlight(DIRECTION.remove);
			STATE.channelMenu = true;
			highlight(DIRECTION.none);
		} else if (!STATE.channelMenu) {
			highlight(DIRECTION.backwards);
		}
	}
}

function down() {
	if (checkMenu() || checkSearch()) {
		highlight(DIRECTION.forwards);
	} else if (checkHome() || checkSubs()) {
		highlight(DIRECTION.down);
	} else if (checkChannel()) {
		if (STATE.channelMenu && (checkChannelLocation() === CHANNEL_LOCATION.videos ||
				checkChannelLocation() === CHANNEL_LOCATION.playlists)) {
			highlight(DIRECTION.remove);
			STATE.channelMenu = false;
			STATE.selection = 0;
			highlight(DIRECTION.none);
		} else if (!STATE.channelMenu) {
			highlight(DIRECTION.down);
		}
	} else if (checkTrending()) {
		if (STATE.channelMenu) {
			highlight(DIRECTION.remove);
			STATE.channelMenu = false;
			STATE.selection = 0;
			highlight(DIRECTION.none);
		} else {
			highlight(DIRECTION.forwards);
		}
	}
}

function select() {
	if (checkHome() || checkSubs() || checkSearch()) {
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

	// Channel selection
	} else if (checkChannel()) {
		if (STATE.channelMenu) {
			getElements()[STATE.selection].click();
		} else {
			getElements()[STATE.selection].getElementsByTagName("a")[0].click();
		}
	} else if (checkTrending()) {
		getElements()[STATE.selection].getElementsByTagName("a")[0].click();
		highlight(DIRECTION.remove);
		newPage();
	}
}

function fullscreen() {
	document.getElementsByClassName(RIGHT_PLAYER_CONTROLS_CLASS)[0].getElementsByClassName(FULLSCREEN_BUTTON_CLASS)[0].click();
	console.log("fullscreen");
}

function theatre() {
	document.getElementsByClassName(RIGHT_PLAYER_CONTROLS_CLASS)[0].getElementsByClassName(THEATRE_BUTTON_CLASS)[0].click();
	console.log("theatre");
}

function playpause() {
	document.getElementsByClassName(LEFT_PLAYER_CONTROLS_CLASS)[0].childNodes[PLAY_INDEX].click();
	console.log("play/pause");
}

function close() {
	if (checkWatch()) {
		window.history.go(-1);
		newPage();
	} else if (document.getElementsByClassName(MINIPLAYER_CLOSE)[0].offsetParent !== null) {
		document.getElementsByClassName(MINIPLAYER_CLOSE)[0].click();
	} else {
		try {
			highlight(DIRECTION.remove);
		} catch (Error) {}
		document.getElementById(HOME_ID).getElementsByTagName("a")[0].click();
		STATE.inMenu = false;
		newPage();
	}
	console.log("closed");
}

function search() {
	document.getElementById(SEARCH_ID).setAttribute("style", BACKGROUND_COLOUR);
	STATE.search = true;
	console.log("search");
}

function searchKey(key) {
	if (key === "Enter") {
		let query = document.getElementById(SEARCH_ID).getElementsByTagName("input")[0].value;
		resetSearch();
		window.location = SEARCH_URL + query;
	} else if (key === '-') {
		if (STATE.changingChar !== '') {
			STATE.changingChar = '';
			STATE.lastKeyPressed = '';
			STATE.numSameKeyPresses = 0;
		} else if (STATE.searchQuery.length !== 0) {
			STATE.searchQuery = STATE.searchQuery.slice(0, length - 1);
		}
	} else if (key === '*') {
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

	document.getElementById(SEARCH_ID).getElementsByTagName("input")[0].value = STATE.searchQuery + STATE.changingChar;
}

function resetSearch() {
	STATE.searchQuery = "";
	STATE.changingChar = '';
	STATE.lastKeyPressed = '';
	STATE.numSameKeyPresses = 0;
	STATE.search = false;
	document.getElementById(SEARCH_ID).removeAttribute("style");
}

function home() {
	window.location = "https://tarinnik.github.io/media/";
}

function refresh() {
	window.location = window.location.href;
}

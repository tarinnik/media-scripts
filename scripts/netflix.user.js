// ==UserScript==
// @name        Netflix
// @namespace   tarinnik.github.io/media
// @version	    0.12
// @include	    https://www.netflix.com/*
// @icon        https://www.netflix.com/favicon.ico
// ==/UserScript==

const BACKGROUND_COLOUR = "background:#bf180f;padding:10px";
const LOGO_CLASS = "logo";
const PROFILES_CLASS = "profile";
const BROWSE_BILLBOARD_CLASS = "billboard-links button-layer forward-leaning";
const BROWSE_BILLBOARD_ROW_CLASS = "lolomoRow lolomoRow_title_card lolomoBigRow";
const VIDEO_ROW_CLASS = "lolomoRow lolomoRow_title_card";
const VIDEO_CLASS = "slider-item";
const VIDEO_OPTIONS_CLASS = "jawbone-actions";
const VIDEO_OPTIONS_MENU_CLASS = "menu";
const VIDEO_SELECT_CLOSE_CLASS = "close-button";
const VIDEO_CLOSE_CLASS1 = "touchable PlayerControls--control-element " +
		"nfp-button-control circle-control-button button-nfplayerExit " +
		"tooltip-button tooltip-button-pos-bottom tooltip-button-align-right";
const VIDEO_CLOSE_CLASS2 = "touchable PlayerControls--control-element " +
		"nfp-button-control default-control-button button-nfplayerBack " +
		"tooltip-button tooltip-button-pos-center tooltip-button-align-right";
const VIDEO_EPISODE_CLASS = "episodeWrapper";
const PLAY_CLASS = "touchable PlayerControls--control-element nfp-button-control " +
		"default-control-button button-nfplayerPlay";
const PAUSE_CLASS = "touchable PlayerControls--control-element nfp-button-control " +
		"default-control-button button-nfplayerPause";
const PLAY_INVISIBLE_CLASS = "visually-hidden  playLink";
const FULLSCREEN_CLASS = "touchable PlayerControls--control-element nfp-button-control " +
	"default-control-button button-nfplayerFullscreen";
const WINDOWED_CLASS = "touchable PlayerControls--control-element nfp-button-control " +
	"default-control-button button-nfplayerWindowed";
const MY_LIST_ROW_CLASS = "rowContainer_title_card";
const SEARCH_URL = "https://www.netflix.com/search?q=";
const SEARCH_TEXT = "Search: ";

let STATE = {
	main: 0,
	selection: -1,
	section: -1,
	// 0 is play, add to list
	// 1 is overview, episodes
	// 2 is episode selection
	videoOptions: 0,
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

let selection = -1;
let section = -1;
let billboard = false;

document.addEventListener('keydown', function(event) {
	key(event);
});

window.addEventListener('load', function () {
	if (window.location.href.slice(0, 30) === "https://www.netflix.com/search") {
		document.getElementsByClassName("searchInput")[0].getElementsByTagName("input")[0].blur();
	}
});

function getElement(name) {
	switch (name) {
		// Video options when clicking on a video (play, add to list, like)
		case VIDEO_OPTIONS_CLASS:
			let e = [];
			let elements = document.getElementsByClassName(name)[0].getElementsByTagName("a");
			for (let i = 0; i < elements.length; i++) {
				if (elements[i].getAttribute("class") !== PLAY_INVISIBLE_CLASS) {
					e.push(elements[i]);
				}
			}
			return e;
		// Bottom menu on video options (episodes, overview)
		case VIDEO_OPTIONS_MENU_CLASS:
			return document.getElementsByClassName(name)[0].childNodes;
		case VIDEO_EPISODE_CLASS:
			return document.getElementsByClassName(name)[0].getElementsByClassName("slider-item");
		case PLAY_CLASS:
			return document.getElementsByClassName(name)[0];
		case PAUSE_CLASS:
			return document.getElementsByClassName(name)[0];
	}
}

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
			account_switch();
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
		case 'Enter':
			playpause();
			break;
		case '+':
			fullscreen();
			break;
		case '-':
			close();
			break;
		case '/':
			refresh();
			break;
	}
}

function checkProfile() {
	return document.getElementsByClassName(PROFILES_CLASS).length !== 0;
}

function checkBrowse() {
	let url = window.location.href;
	return url.length - 6 === url.indexOf("browse");
}

function checkVideoOptions() {
	return document.getElementsByClassName("jawBoneContent open").length !== 0;
}

function checkEpisodes() {
	return document.getElementsByClassName(VIDEO_EPISODE_CLASS).length !== 0;
}

function checkWatch() {
	return window.location.href.indexOf("watch") !== -1;
}

function checkMyList() {
    let url = window.location.href;
    return (url.indexOf("my-list") === url.length - 7) || (url.slice(0, 30) === "https://www.netflix.com/search");
}

/**
 * Toggles the focus on the video options section
 */
function toggleVideoOptions() {
	if (STATE.videoOptions === 0) {
		getElement(VIDEO_OPTIONS_CLASS)[selection].removeAttribute("style");
		STATE.videoOptions = 1;
		getElement(VIDEO_OPTIONS_MENU_CLASS)[0].setAttribute("style", BACKGROUND_COLOUR);
	} else if (STATE.videoOptions === 1) {
		if (checkEpisodes()) {
			STATE.videoOptions = 2;
		} else {
			getElement(VIDEO_OPTIONS_MENU_CLASS)[selection].removeAttribute("style");
			STATE.videoOptions = 0;
			getElement(VIDEO_OPTIONS_CLASS)[0].setAttribute("style", BACKGROUND_COLOUR);
		}
	} else {
		STATE.videoOptions = 1;
	}
	selection = 0;
}

function enterVideoRow(browse) {
    let row;
    if (browse === 1) {
        row = VIDEO_ROW_CLASS;
    } else {
        row = MY_LIST_ROW_CLASS;
    }

	let rowIdName = "row-" + (section + browse);
	let element = document.getElementById(rowIdName).getElementsByClassName(VIDEO_CLASS);
	if (selection === -1) {
		document.getElementsByClassName(row)[section].removeAttribute("style");
	}
	return element;
}

function list() {
    selection = -1;
    section = -1;
    document.getElementsByClassName("navigation-tab")[4].getElementsByTagName("a")[0].click();
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

function account_switch() {
	window.location = "https://www.netflix.com/ProfilesGate";
}

function billboardSelect(index) {
	let element = document.getElementsByClassName(BROWSE_BILLBOARD_CLASS)[index].getElementsByTagName("a");
	let d = [];
	for (let i = 0; i < element.length; i++) {
		if (element[i].getAttribute("class") !== PLAY_INVISIBLE_CLASS) {
			d.push(element[i]);
		}
	}
	return d;
}

function findBillboardIndex(element) {
	element.removeAttribute("style");
	let e = document.getElementsByClassName(BROWSE_BILLBOARD_ROW_CLASS);
	let i;
	for (i = 0; i < e.length; i++) {
		if (element === e[i]) {
			return i;
		}
	}
}

function right() {
	//Profile select
	if (checkProfile()) {
		next(document.getElementsByClassName(PROFILES_CLASS));
	} else if (checkBrowse()) {
		if (section === -1) {
			next(billboardSelect(0));
		} else {
			let element = document.getElementsByClassName(VIDEO_ROW_CLASS)[section];
			if (element.className === BROWSE_BILLBOARD_ROW_CLASS) {
				let i = findBillboardIndex(element);
				billboard = true;
				next(billboardSelect(i + 1));
			} else {
				next(enterVideoRow(1));
			}
		}
	} else if (checkVideoOptions()) {
		if (STATE.videoOptions === 0) {
			next(getElement(VIDEO_OPTIONS_CLASS));
		} else if (STATE.videoOptions === 1) {
			next(getElement(VIDEO_OPTIONS_MENU_CLASS));
		} else {
			next(getElement(VIDEO_EPISODE_CLASS));
		}
	} else if (checkMyList()) {
        next(enterVideoRow(0));
    }
}

function left() {
	//Profile select
	if (checkProfile()) {
		previous(document.getElementsByClassName(PROFILES_CLASS));
	} else if (checkBrowse()) {
		if (section === -1) {
			previous(billboardSelect(0));
		} else {
			let element = document.getElementsByClassName(VIDEO_ROW_CLASS)[section];
			if (element.className === BROWSE_BILLBOARD_ROW_CLASS) {
				let i = findBillboardIndex(element);
				billboard = true;
				previous(billboardSelect(i + 1));
			} else {
				previous(enterVideoRow(1));
			}		}
	} else if (checkVideoOptions()) {
		if (STATE.videoOptions === 0) {
			previous(getElement(VIDEO_OPTIONS_CLASS));
		} else if (STATE.videoOptions === 1) {
			previous(getElement(VIDEO_OPTIONS_MENU_CLASS));
		} else {
			previous(getElement(VIDEO_EPISODE_CLASS));
		}
	} else if (checkMyList()) {
        previous(enterVideoRow(0));
    }
}

function removeHighlight(s) {
	if (section !== -1 && selection !== -1 && !billboard) {
		billboard = false;
		let rowIdName = "row-" + (section + s);
		document.getElementById(rowIdName).getElementsByClassName(VIDEO_CLASS)[selection].removeAttribute("style");
	}
}

function up() {
	if (!checkProfile()) {
		if (checkBrowse()) {
			removeHighlight(1);
			selection = section;
			previous(document.getElementsByClassName(VIDEO_ROW_CLASS));
			let defaultPos = document.getElementsByClassName("info-wrapper")[0];
			scroll(selection, defaultPos, document.getElementsByClassName(VIDEO_ROW_CLASS), 1);
			section = selection;
			selection = -1;

		// Toggles between the play video options and episodes section
		} else if (checkVideoOptions()) {
			toggleVideoOptions();

		} else if (checkMyList()) {
			removeHighlight(0);
            selection = section;
            previous(document.getElementsByClassName(MY_LIST_ROW_CLASS));
            const defaultPosition = document.getElementsByClassName("pinning-header")[0];
            scroll(selection, defaultPosition, document.getElementsByClassName(MY_LIST_ROW_CLASS), 1);
            section = selection;
            selection = -1;
        }
	}
}

function down() {
	if (!checkProfile()) {
		if (checkBrowse()) {
			removeHighlight(1);
			selection = section;
			next(document.getElementsByClassName(VIDEO_ROW_CLASS));
			let defaultPos = document.getElementsByClassName("info-wrapper")[0];
			scroll(selection, defaultPos, document.getElementsByClassName(VIDEO_ROW_CLASS), 1);
			section = selection;
			selection = -1;

		// Toggles between the play video options and episodes section
		} else if (checkVideoOptions()) {
			toggleVideoOptions();

		} else if (checkMyList()) {
			removeHighlight(0);
		    selection = section;
		    next(document.getElementsByClassName(MY_LIST_ROW_CLASS));
		    const defaultPosition = document.getElementsByClassName("pinning-header")[0];
		    scroll(selection, defaultPosition, document.getElementsByClassName(MY_LIST_ROW_CLASS), 1);
		    section = selection;
		    selection = -1;
        }
	}
}

/**
 * Select the currently highlighted option
 */
function select() {
	// Profile to sign in as
	if (checkProfile()) {
		document.getElementsByClassName(PROFILES_CLASS)[selection].
				getElementsByTagName("a")[0].click();
		selection = -1;
		section = -1;

	// Selecting the row expands the list
	} else if (checkBrowse()) {
		if (selection === -1) {
			let link = document.getElementsByClassName(VIDEO_ROW_CLASS)[section].getElementsByTagName("h2")[0].getElementsByTagName("a");
			if (link.length !== 0) {
				link[0].click();
			}
		} else if (section === -1) {
			billboardSelect(0)[selection].click();
		} else if (billboard) {
			let i = findBillboardIndex(document.getElementsByClassName(VIDEO_ROW_CLASS)[section]);
			billboardSelect(i + 1)[selection].click();

		// Selecting a video in a row
		} else {
			let rowIdName = "row-" + (section + 1);
			document.getElementsByClassName(VIDEO_CLASS)[selection].removeAttribute("style");
			document.getElementById(rowIdName).getElementsByClassName(VIDEO_CLASS)[selection].
					getElementsByTagName("a")[0].click();
			selection = 0;
			getElement(VIDEO_OPTIONS_CLASS)[selection].setAttribute("style", BACKGROUND_COLOUR);
		}

	// Selecting an option in the video popup after selecting a video from a row
	} else if (checkVideoOptions()) {
		if (STATE.videoOptions === 0) {
			getElement(VIDEO_OPTIONS_CLASS)[selection].click();
			selection = -1;
		} else if (STATE.videoOptions === 1) {
			getElement(VIDEO_OPTIONS_MENU_CLASS)[selection].getElementsByTagName("a")[0].click();
			selection = -1;
		} else {
			getElement(VIDEO_EPISODE_CLASS)[selection].getElementsByTagName("a")[0].click();
			selection = -1;
		}
	} else if (checkMyList()) {
		document.getElementsByClassName(MY_LIST_ROW_CLASS)[section].
		getElementsByClassName(VIDEO_CLASS)[selection].
		getElementsByTagName("a")[0].click();
		selection = -1;
	}
}

/**
 * Closes the current option or video
 */
function close() {
	if (checkVideoOptions()) {
		document.getElementsByClassName(VIDEO_SELECT_CLOSE_CLASS)[0].click();
	} else if (checkWatch()) {
		try {
			document.getElementsByClassName(VIDEO_CLOSE_CLASS1)[0].click();
		} catch (TypeError) {}
		try {
			document.getElementsByClassName(VIDEO_CLOSE_CLASS2)[0].click();
		} catch (TypeError) {}
	} else {
		STATE.section = -1;
		STATE.selection = -1;
		selection = -1;
		section = -1;
		document.getElementsByClassName(LOGO_CLASS)[0].click();
	}
}

function fullscreen() {
	if (document.getElementsByClassName(FULLSCREEN_CLASS).length !== 0) {
		document.getElementsByClassName(FULLSCREEN_CLASS)[0].click();
	} else {
		document.getElementsByClassName(WINDOWED_CLASS)[0].click();
	}
}

function playpause() {
	if (checkWatch()) {
		if (document.getElementsByClassName(PLAY_CLASS).length !== 0) {
			getElement(PAUSE_CLASS).click();
		} else {
			getElement(PLAY_CLASS).click();
		}
	}
}

function next(elements) {
	// First video
	if (selection === -1) {
		selection++;
		elements[selection].setAttribute("style", BACKGROUND_COLOUR);
	}

	//End of available elements
	else if (selection >= elements.length - 1) {
		elements[0].setAttribute("style", BACKGROUND_COLOUR);
		elements[selection].removeAttribute("style");
		selection = 0;
	} else {
		selection++;
		elements[selection].setAttribute("style", BACKGROUND_COLOUR);
		elements[selection - 1].removeAttribute("style");
	}


}

function previous(elements) {
	//First video
	if (selection === -1 || selection === 0) {
		selection = elements.length - 1;
		elements[selection].setAttribute("style", BACKGROUND_COLOUR);
		elements[0].removeAttribute("style");
	} else {
		selection--;
		elements[selection].setAttribute("style", BACKGROUND_COLOUR);
		elements[selection + 1].removeAttribute("style");
	}


}

function scroll(index, defaultPosition, onScrollPosition, rowLength) {
	if (index < rowLength) {
		try {
			defaultPosition.scrollIntoView();
		} catch (TypeError) {}
	} else {
		onScrollPosition[index - rowLength].scrollIntoView();
	}
}

function home() {
	window.location = "https://tarinnik.github.io/media/";
}

function refresh() {
	window.location = window.location.href;
}
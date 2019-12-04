// ==UserScript==
// @name        Netflix
// @namespace   tarinnik.github.io/gmscripts
// @version	    0.9.1
// @include	    https://www.netflix.com/*
// @icon        https://www.netflix.com/favicon.ico
// ==/UserScript==

const BACKGROUND_COLOUR = "background:#bf180f";
const PROFILES_CLASS = "profile";
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
const FULLSCREEN_CLASS = "touchable PlayerControls--control-element nfp-button-control " +
	"default-control-button button-nfplayerFullscreen";
const WINDOWED_CLASS = "touchable PlayerControls--control-element nfp-button-control " +
	"default-control-button button-nfplayerWindowed";
const MY_LIST_ROW_CLASS = "rowContainer_title_card";

let STATE = {
	main: 0,
	selection: -1,
	section: -1,
	videoOptions: 0
};

let selection = -1;
let section = -1;

document.addEventListener('keydown', function(event) {
	key(event);
});

function getElement(name) {
	switch (name) {
		// Video options when clicking on a video (play, add to list, like)
		case VIDEO_OPTIONS_CLASS:
			return document.getElementsByClassName(name)[0].getElementsByTagName("a");
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
			break;
		case 'Enter':
			playpause();
			break;
		case '+':
			account_switch();
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
    return url.indexOf("my-list") === url.length - 7;
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

function account_switch() {
	window.location = "https://www.netflix.com/ProfilesGate";
}

function right() {
	//Profile select
	if (checkProfile()) {
		next(document.getElementsByClassName(PROFILES_CLASS));
	} else if (checkBrowse()) {
		next(enterVideoRow(1));
	} else if (checkVideoOptions()) {
		if (STATE.videoOptions === 0) {
			next(document.getElementsByClassName(VIDEO_OPTIONS_CLASS)[0].getElementsByTagName("a"));
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
		previous(enterVideoRow(1));
	} else if (checkVideoOptions()) {
		if (STATE.videoOptions === 0) {
			previous(document.getElementsByClassName(VIDEO_OPTIONS_CLASS)[0].getElementsByTagName("a"));
		} else if (STATE.videoOptions === 1) {
			previous(getElement(VIDEO_OPTIONS_MENU_CLASS));
		} else {
			previous(getElement(VIDEO_EPISODE_CLASS));
		}
	} else if (checkMyList()) {
        previous(enterVideoRow(0));
    }
}

function up() {
	if (!checkProfile()) {
		if (checkBrowse()) {
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
	} else if (checkMyList()) {
        document.getElementsByClassName(MY_LIST_ROW_CLASS)[section].
                getElementsByClassName(VIDEO_CLASS)[selection].
                getElementsByTagName("a")[0].click();
        selection = -1;

	// Selecting the row expands the list
	} else if (checkBrowse()) {
		if (selection === -1) {
			let link = document.getElementsByClassName(VIDEO_ROW_CLASS)[section].
					getElementsByTagName("h2")[0].
					getElementsByTagName("a");
			if (link.length !== 0) {
				link[0].click();
			}


		// Selecting a video in a row
		} else {
			let rowIdName = "row-" + (section + 1);
			document.getElementsByClassName(VIDEO_CLASS)[selection].removeAttribute("style");
			document.getElementById(rowIdName).getElementsByClassName(VIDEO_CLASS)[selection].
					getElementsByTagName("a")[0].click();
			selection = -1;
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
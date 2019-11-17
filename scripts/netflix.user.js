// ==UserScript==
// @name     	Netflix
// @namespace   tarinnik.github.io/gmscripts
// @version		0.4
// @include		https://www.netflix.com/*
// @icon		https://www.netflix.com/favicon.ico
// ==/UserScript==

const BACKGROUND_COLOUR = "background:#bf180f";
const PROFILES_CLASS = "profile";
const VIDEO_ROW_CLASS = "lolomoRow lolomoRow_title_card";
const VIDEO_CLASS = "slider-item";
const VIDEO_OPTIONS_CLASS = "jawbone-actions";

const movement = {
	SELECTION: 1,
	SECTION: 2
};

let selection = -1;
let section = -1;

document.addEventListener('keydown', function(event) {
	key(event);
});

function key(event) {
	switch (event.key) {
		case '1':
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
	return document.getElementsByClassName(VIDEO_OPTIONS_CLASS).length !== 0;
}

function enterVideoRow() {
	let rowIdName = "row-" + (section + 1);
	let element = document.getElementById(rowIdName).getElementsByClassName(VIDEO_CLASS);
	if (selection === -1) {
		document.getElementsByClassName(VIDEO_ROW_CLASS)[section].removeAttribute("style");
	}
	return element;
}

function right() {
	//Profile select
	if (checkProfile()) {
		next(document.getElementsByClassName(PROFILES_CLASS));
	} else if (checkBrowse()) {
		next(enterVideoRow());
	} else if (checkVideoOptions()) {
		next(document.getElementsByClassName(VIDEO_OPTIONS_CLASS)[0].getElementsByTagName("a"));
	}
}

function left() {
	//Profile select
	if (checkProfile()) {
		previous(document.getElementsByClassName(PROFILES_CLASS));
	} else if (checkBrowse()) {
		previous(enterVideoRow());
	} else if (checkVideoOptions()) {
		previous(document.getElementsByClassName(VIDEO_OPTIONS_CLASS)[0].getElementsByTagName("a"));
	}
}

function up() {
	if (!checkProfile()) {
		selection = section;
		if (checkBrowse()) {
			previous(document.getElementsByClassName(VIDEO_ROW_CLASS));
			let defaultPos = document.getElementsByClassName("info-wrapper")[0];
			scroll(selection, defaultPos, document.getElementsByClassName(VIDEO_ROW_CLASS), 1);
		}
		section = selection;
		selection = -1;
	}
}

function down() {
	if (!checkProfile()) {
		selection = section;
		if (window.location.href.indexOf("my-list") !== -1) {

		} else if (checkBrowse()) {
			next(document.getElementsByClassName(VIDEO_ROW_CLASS));
			let defaultPos = document.getElementsByClassName("info-wrapper")[0];
			scroll(selection, defaultPos, document.getElementsByClassName(VIDEO_ROW_CLASS), 1);
		}
		section = selection;
		selection = -1;
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
	} else if (window.location.href.indexOf("my-list") !== -1) {

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
			document.getElementById(rowIdName).getElementsByClassName(VIDEO_CLASS)[selection].
					getElementsByTagName("a")[0].click();
			selection = -1;
			section = 0;
		}

	// Selecting an option in the video popup after selecting a video from a row
	} else if (checkVideoOptions()) {
		document.getElementsByClassName(VIDEO_OPTIONS_CLASS)[0].
		getElementsByTagName("a")[selection].click();
		selection = -1;


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
	window.history.go(0 - (window.history.length - 1));
}
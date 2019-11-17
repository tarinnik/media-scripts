// ==UserScript==
// @name     	Netflix
// @namespace   tarinnik.github.io/gmscripts
// @version		0.3
// @include		https://www.netflix.com/*
// @icon		https://www.netflix.com/favicon.ico
// ==/UserScript==

const BACKGROUND_COLOUR = "background:#bf180f";
const PROFILES_CLASS = "profile";
const VIDEO_ROW_CLASS = "lolomoRow lolomoRow_title_card";

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

function check_profile() {
	return document.getElementsByClassName(PROFILES_CLASS).length !== 0;
}

function right() {
	//Profile select
	if (check_profile()) {
		next(document.getElementsByClassName(PROFILES_CLASS));
	}
}

function left() {
	//Profile select
	if (check_profile()) {
		previous(document.getElementsByClassName(PROFILES_CLASS));
	}
}

function up() {
	if (!check_profile()) {
		selection = section;
		if (window.location.href.indexOf("browse") !== -1) {
			previous(document.getElementsByClassName(VIDEO_ROW_CLASS));
		}
		section = selection;
		selection = -1;
	}
}

function down() {
	if (!check_profile()) {
		selection = section;
		if (window.location.href.indexOf("my-list") !== -1) {

		} else if (window.location.href.indexOf("browse") !== -1) {
			next(document.getElementsByClassName(VIDEO_ROW_CLASS));
		}
		section = selection;
		selection = -1;
	}
}

function select() {
	if (check_profile()) {
		document.getElementsByClassName(PROFILES_CLASS)[selection].
				getElementsByTagName("a")[0].click();
		selection = -1;
		section = -1;
	} else if (window.location.href.indexOf("my-list") !== -1) {

	} else if (window.location.href.indexOf("browse") !== -1) {
		if (section !== -1) {
			let link = document.getElementsByClassName(VIDEO_ROW_CLASS)[section].
					getElementsByTagName("h2")[0].
					getElementsByTagName("a");
			if (link.length !== 0) {
				link[0].click();
			}
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

	let defaultPos = document.getElementsByClassName("info-wrapper")[0];
	scroll(selection, defaultPos, elements, 1);
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

	let defaultPos = document.getElementsByClassName("info-wrapper")[0];
	scroll(selection, defaultPos, elements, 1);
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
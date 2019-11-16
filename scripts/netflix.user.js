// ==UserScript==
// @name     	Netflix
// @namespace   tarinnik.github.io/gmscripts
// @version		0.1
// @include		https://www.netflix.com/*
// @icon		https://www.netflix.com/favicon.ico
// ==/UserScript==

const PROFILES_CLASS = "profile";
const BACKGROUND_COLOUR = "background:#bf180f";

let selection = -1;

document.addEventListener('keydown', function(event) {
	key(event);
});

function key(event) {
	switch (event.key) {
		case '1':
			break;
		case '2':
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
			break;
		case '9':
			break;
		case '0':
			break;
	}
}


function right() {
	//Profile select
	if (document.getElementsByClassName(PROFILES_CLASS).length !== 0) {
		next(document.getElementsByClassName(PROFILES_CLASS));
	}
}

function left() {
	//Profile select
	if (document.getElementsByClassName(PROFILES_CLASS).length !== 0) {
		previous(document.getElementsByClassName(PROFILES_CLASS));
	}
}

function select() {
	if (document.getElementsByClassName(PROFILES_CLASS).length !== 0) {
		document.getElementsByClassName(PROFILES_CLASS)[selection].
				getElementsByTagName("a")[0].click();
	}
}

function next(section) {
	// First video
	if (selection === -1) {
		selection++;
		section[selection].setAttribute("style", BACKGROUND_COLOUR);
	}

	//End of available elements
	else if (selection >= section.length - 1) {
		section[0].setAttribute("style", BACKGROUND_COLOUR);
		section[selection].removeAttribute("style");
		selection = 0;
	} else {
		selection++;
		section[selection].setAttribute("style", BACKGROUND_COLOUR);
		section[selection - 1].removeAttribute("style");
	}
}

function previous(section) {
	//First video
	if (selection === -1 || selection === 0) {
		selection = section.length - 1;
		section[selection].setAttribute("style", BACKGROUND_COLOUR);
		section[0].removeAttribute("style");
	} else {
		selection--;
		section[selection].setAttribute("style", BACKGROUND_COLOUR);
		section[selection + 1].removeAttribute("style");
	}
}

function home() {
	window.history.go(0 - (window.history.length - 1));
}
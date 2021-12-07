// ==UserScript==
// @name        Stan
// @namespace   tarinnik.github.io/media
// @version     0.1.0
// @include     https://play.stan.com.au/*
// @icon        https://www.stan.com.au/favicon.ico
// ==/UserScript==

const BACKGROUND_COLOUR = "";
const HOME_URL = "";
const LIST_URL = "";
const SHOW_URL = "";
const SEARCH_URL = "";
const WATCH_FULLSCREEN_CLASS = "vjs-fs-control vjs-control vjs-control-secondary vjs-button";
const WATCH_BACK_BUTTON = "vjs-back-player-control vjs-control vjs-control-secondary vjs-button";
const WATCH_PLAY_PAUSE = "vjs-play-control vjs-control vjs-button vjs-paused";

let STATE = {
    selection: 0,
    menu: false,
    videoSelection: 0,
    season: false,
    search: false,
    numSameKeyPresses: 0,
    lastKeyPressed: '',
    searchQuery: "",
    changingChar: '',
};

const DIRECTION = {
    remove: 'r',
    none: 0,
    forwards: 1,
    backwards: -1,
    up: -2,
    down: 2,
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

/**
 * Triggered when the page loads
 */
window.addEventListener('load', function() {

});

/**
 * Triggered when a key is pressed
 */
document.addEventListener('keydown', function(event) {
    key(event);
});

/**
 * Determines the key press
 * @param event that was triggered
 */
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
            back();
            break;
        case '0':
            search();
            break;
        case 'Enter':
            playpause();
            break;
        case '.':
            break;
        case '+':
            seasons();
            break;
        case '-':
            break;
        case '*':
            break;
        case '/':
            refresh();
            break;
    }
}

/**
 * Checks if the current page is the home page
 * @return {boolean} if the current page is the home page
 */
function checkHome() {

}

/**
 * Checks if the current page is the watchlist
 * @returns {boolean} if the current page is my list
 */
function checkList() {

}

/**
 * Checks if the current page is the show page
 * @returns {boolean} if the current page is the show page
 */
function checkShow() {

}

/**
 * Checks if the current page is the video
 * @returns {boolean} if the current page is the video
 */
function checkWatch() {
    return document.getElementsByClassName(WATCH_FULLSCREEN_CLASS).length > 0;
}

/**
 * Gets the elements that are to be selected
 */
function getElements() {
    if (checkHome()) {

    } else if (checkList()) {

    } else if (checkShow()) {

    }
}

/**
 * Gets the number of columns the elements have
 * @returns {number} number of columns
 */
function getColumns() {
    if (checkHome()) {

    } else {
        return 1;
    }
}

/**
 * Highlights an element
 * @param d direction to highlight in
 */
function highlight(d) {
    let elements = getElements();
    let columns = getColumns();

    // Highlight the current element
    if (d === DIRECTION.none) {
        elements[STATE.selection].setAttribute("style", BACKGROUND_COLOUR);

        // Remove the highlight from the current element
    } else if (d === DIRECTION.remove) {
        elements[STATE.selection].removeAttribute("style");

        // Highlight forward but at the end of the elements
    } else if (STATE.selection === elements.length - 1 && d === DIRECTION.forwards) {
        return;

        // Highlight backwards but at the start of the elements
    } else if (STATE.selection === 0 && d === DIRECTION.backwards) {
        return;

        // Highlights the element in the row above or below
    } else if (d === DIRECTION.up || d === DIRECTION.down) {
        if (d === DIRECTION.up && STATE.selection < columns) {
            return;
        }
        highlight(DIRECTION.remove);
        let multiplier = d / 2;
        if (d === DIRECTION.down) {
            if (STATE.selection >= elements.length - columns) {
                STATE.selection = elements.length - 1;
                highlight(DIRECTION.none);
                return;
            }
        }
        STATE.selection += (columns * multiplier);
        highlight(DIRECTION.none);

        // Highlighting forwards or backwards with an element on the relevant side
    } else {
        highlight(DIRECTION.remove);
        STATE.selection += d;
        highlight(DIRECTION.none);
    }

    scroll();
}

/**
 * 5 (select) was pressed
 */
function select() {
    if (checkHome()) {

    } else if (checkList()) {

    } else if (checkShow()) {

    }
}

/**
 * 6 (right arrow) was pressed
 */
function right() {
    if (checkHome()) {

    } else if (checkList()) {

    } else if (checkShow()) {

    }
}

/**
 * 4 (left arrow) was pressed
 */
function left() {
    if (checkHome()) {

    } else if (checkList()) {

    } else if (checkShow()) {

    }
}

/**
 * 8 (up arrow) was pressed
 */
function up() {
    if (checkHome()) {

    } else if (checkList()) {

    } else if (checkShow()) {

    }
}

/**
 * 2 (down arrow) was pressed
 */
function down() {
    if (checkHome()) {

    } else if (checkList()) {

    } else if (checkShow()) {

    }
}

/**
 * Scrolls the page so the selected element if visible
 */
function scroll() {
    let columns = getColumns();
    let defaultPosition;
    let elements = getElements();
    if (checkHome()) {

    } else if (checkList()) {

    } else if (checkShow()) {

    }

    if (STATE.selection < columns) {
        try {
            defaultPosition.scrollIntoView();
        } catch (TypeError) {
            window.scrollTo(0, 0);
        }
    } else {
        elements[STATE.selection - columns].scrollIntoView();
    }
}

/**
 * Selects the season menu
 */
function season() {

}

/**
 * Toggles the play state of the video
 */
function playpause() {
    document.getElementsByClassName(WATCH_PLAY_PAUSE)[0].click();
}

/**
 * Makes the video fullscreen
 */
function fullscreen() {
    document.getElementsByClassName(WATCH_FULLSCREEN_CLASS)[0].click();
}

/**
 * Closes the video if one is open, otherwise goes to the home page
 */
function back() {
    if (checkWatch()) {
        document.getElementsByClassName(WATCH_BACK_BUTTON)[0].click();
    } else {
        window.location = HOME_URL;
    }
}

/**
 * Navigates to the list page
 */
function list() {
    window.location = LIST_URL;
}

/**
 * Goes back to the media home page
 */
function home() {
    window.location = "https://tarinnik.github.io/media/";
}

/**
 * Refreshes the page
 */
function refresh() {
    window.location = window.location.href;
}

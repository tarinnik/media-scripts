// ==UserScript==
// @name     	Prime Video
// @namespace	tarinnik.github.io/media
// @version  	0.1
// @include		https://www.primevideo.com/*
// @icon		https://www.primevideo.com/favicon.ico
// ==/UserScript==

const BACKGROUND_COLOUR = "background:#1a7ee1;color:white;padding:7px";
const HOME_URL = "https://www.primevideo.com";
const HOME_URL_2 = "https://www.primevideo.com/storefront/home/";
const LIST_URL = "https://www.primevideo.com/watchlist";
const LIST_MENU_CLASS = "_3KCmhW dvui-tab";
const LIST_VIDEO_CLASS = "UaW15H";
const SHOW_URL = "https://www.primevideo.com/detail";
const SHOW_MENU_CLASS = "_2eqhmo _2Zapp7 _38qi5F";
const SHOW_VIDEO_CLASS = "js-node-episode-container";

let STATE = {
    selection: 0,
    menu: false,
    videoSelection: 0,
};

const DIRECTION = {
    remove: 'r',
    none: 0,
    forwards: 1,
    backwards: -1,
    up: -2,
    down: 2,
};

/**
 * Triggered when the page loads
 */
window.addEventListener('load', function() {
    if (checkHome()) {

    } else if (checkList() || checkShow()) {
        STATE.menu = true;
    }
    highlight(DIRECTION.none);
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
            seasons();
            break;
        case '0':
            search();
            break;
        case '.':
            break;
        case '+':
            fullscreen();
            break;
        case '-':
            back();
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
    return window.location.href.slice(0, HOME_URL_2.length) === HOME_URL_2 || window.location.href === HOME_URL;
}

/**
 * Checks if the current page is the watchlist
 * @returns {boolean} if the current page is my list
 */
function checkList() {
    return window.location.href.slice(0, LIST_URL.length) === LIST_URL;
}

/**
 * Checks if the current page is the show page
 * @returns {boolean} if the current page is the show page
 */
function checkShow() {
    return window.location.href.slice(0, SHOW_URL.length) === SHOW_URL;
}

/**
 * Gets the elements that are to be selected
 */
function getElements() {
    if (checkHome()) {

    } else if (checkList()) {
        if (STATE.menu) {
            return document.getElementsByClassName(LIST_MENU_CLASS);
        } else {
            return document.getElementsByClassName(LIST_VIDEO_CLASS);
        }
    } else if (checkShow()) {
        if (STATE.menu) {
            return document.getElementsByClassName(SHOW_MENU_CLASS)[0].childNodes;
        } else {
            return document.getElementsByClassName(SHOW_VIDEO_CLASS);
        }
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

    if (checkShow() && !STATE.menu) {
        elements[STATE.selection].style.padding = "";
    }
}

/**
 * 5 (select) was pressed
 */
function select() {
    if (checkHome()) {

    } else if (checkList()) {
        if (STATE.menu) {
            getElements()[STATE.selection].click();
        } else {
            getElements()[STATE.selection].getElementsByTagName("a")[0].click();
        }
    } else if (checkShow()) {
        if (STATE.menu) {
            if (STATE.selection) {
                getElements()[STATE.selection].getElementsByTagName("button")[0].click();
            } else {
                getElements()[STATE.selection].getElementsByTagName("a")[0].click();
            }
        } else {
            getElements()[STATE.selection].getElementsByTagName("a")[0].click();
        }
    }
}

/**
 * 6 (right arrow) was pressed
 */
function right() {
    if (checkHome()) {

    } else if (checkList()) {
        highlight(DIRECTION.forwards);
    } else if (checkShow() && STATE.menu) {
        highlight(DIRECTION.forwards);
    }
}

/**
 * 4 (left arrow) was pressed
 */
function left() {
    if (checkHome()) {

    } else if (checkList()) {
        highlight(DIRECTION.backwards);
    } else if (checkShow() && STATE.menu) {
        highlight(DIRECTION.backwards);
    }
}

/**
 * 8 (up arrow) was pressed
 */
function up() {
    if (checkHome()) {

    } else if (checkList()) {

    } else if (checkShow()) {
        if (!STATE.menu && STATE.selection === 0) {
            toggleMenu();
        } else if (!STATE.menu) {
            highlight(DIRECTION.backwards);
        }
    }
}

/**
 * 2 (down arrow) was pressed
 */
function down() {
    if (checkHome()) {

    } else if (checkList()) {
        if (STATE.menu) {
            toggleMenu();
        }
    } else if (checkShow()) {
        if (STATE.menu) {
            toggleMenu();
        } else {
            highlight(DIRECTION.forwards);
        }
    }
}

/**
 * Scrolls the page so the selected element if visible
 */
function scroll() {
    if (STATE.menu) {
        window.scrollTo(0, 0);
        return;
    }

    let columns = getColumns();
    let defaultPosition;
    let elements = getElements();

    if (checkHome()) {

    } else if (checkList()) {

    } else if (checkShow()) {
        defaultPosition = document.getElementsByClassName(SHOW_MENU_CLASS)[0];
    }

    if (STATE.selection < columns) {
        try {
            defaultPosition.scrollIntoView();
        } catch (TypeError) {
            window.scrollTo(0, 0);
        }
    } else {
        elements[STATE.selection - 1].scrollIntoView();
    }
}

/**
 * Toggles the menu
 */
function toggleMenu() {
    highlight(DIRECTION.remove);
    STATE.menu = !STATE.menu;
    STATE.selection = 0;
    highlight(DIRECTION.none);
}

/**
 * Closes the video if one is open, otherwise goes to the home page
 */
function back() {
    window.location = HOME_URL;
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
// ==UserScript==
// @name        Apple TV+
// @namespace   tarinnik.github.io/media
// @version     0.2
// @include     https://tv.apple.com/*
// @icon        https://tv.apple.com/favicon.ico
// ==/UserScript==

const BACKGROUND_COLOUR = "background:grey";
const HOME_BUTTON_CLASS = "ember-view nav-header__logo nav-header__tv-plus-logo";
const HOME_SCROLL_CLASS = "landing__header__next-arrow";
const HOME_VIDEO_CLASS = "landing__main__section";
const LIST_URL = "";
const SHOW_MENU_CLASS = "product-header__content__buttons";
const SHOW_VIDEO_CLASS = "shelf-grid__list";
const SHOW_NEXT_CLASS = "shelf-grid-nav__arrow shelf-grid-nav__arrow--next ember-view";
const SHOW_PREVIOUS_CLASS = "shelf-grid-nav__arrow shelf-grid-nav__arrow--previous ember-view";
const SEARCH_URL = "";

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
    newPage();
});

/**
 * Triggered when a key is pressed
 */
document.addEventListener('keydown', function(event) {
    key(event);
});

function newPage() {
    setTimeout(function() {
        STATE.selection = 0;
        STATE.menu = true;
        STATE.videoSelection = 0;
        if (checkShow()) {
            waitForLoad();
        }
    }, 1000);
}

function waitForLoad() {
    let t = setInterval(function() {
        if (getElements().length !== 0) {
            clearInterval(t);
            highlight(DIRECTION.none);
        }
    }, 200);
}

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
    return document.getElementsByClassName(HOME_SCROLL_CLASS).length !== 0;
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
    return window.location.href.indexOf("show") !== -1;
}

/**
 * Checks if the current page is the video
 * @returns {boolean} if the current page is the video
 */
function checkWatch() {

}

/**
 * Gets the elements that are to be selected
 */
function getElements() {
    if (checkHome()) {
        let a = [];
        let e = document.getElementsByClassName(HOME_VIDEO_CLASS);
        let length = e.length - 1;
        a.push(document.getElementsByClassName(HOME_SCROLL_CLASS)[0]);
        for (let i = 0; i < length; i++) {
            a.push(e[i]);
        }
        return a;
    } else if (checkList()) {

    } else if (checkShow()) {
        if (STATE.menu) {
            return document.getElementsByClassName(SHOW_MENU_CLASS)[0].getElementsByTagName("button");
        } else {
            return document.getElementsByClassName(SHOW_VIDEO_CLASS)[0].getElementsByTagName("li");
        }
    }
}

/**
 * Gets the number of columns the elements have
 * @returns {number} number of columns
 */
function getColumns() {
    return 1;
}

function getShowColumns() {
    let e = getComputedStyle(document.getElementsByClassName(SHOW_VIDEO_CLASS)[0]).getPropertyValue("grid-auto-columns");
    let i = e.indexOf('(');
    return Math.round(100 / parseInt(e.slice(i + 1)));
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
        if (STATE.selection === 0) {
            getElements()[0].click();
            STATE.selection++;
        } else {
            getElements()[STATE.selection].getElementsByTagName('a')[1].click();
            newPage();
        }
    } else if (checkList()) {

    } else if (checkShow()) {
        if (STATE.menu) {
            getElements()[STATE.selection].click();
        } else {
            getElements()[STATE.selection].getElementsByTagName('a')[0].click();
        }
        newPage();
    }
}

/**
 * 6 (right arrow) was pressed
 */
function right() {
    if (checkHome()) {

    } else if (checkList()) {

    } else if (checkShow()) {
        if (!STATE.menu) {
            highlight(DIRECTION.forwards);
            let i = getShowColumns();
            if (STATE.selection % i === 0) {
                document.getElementsByClassName(SHOW_NEXT_CLASS)[0].click();
            }
        }
    }
}

/**
 * 4 (left arrow) was pressed
 */
function left() {
    if (checkHome()) {

    } else if (checkList()) {

    } else if (checkShow()) {
        if (!STATE.menu) {
            highlight(DIRECTION.backwards);
            let i = getShowColumns();
            if (STATE.selection % i === i - 1) {
                document.getElementsByClassName(SHOW_PREVIOUS_CLASS)[0].click();
            }
        }

    }
}

/**
 * 8 (up arrow) was pressed
 */
function up() {
    if (checkHome()) {
        highlight(DIRECTION.backwards);
    } else if (checkList()) {

    } else if (checkShow()) {
        if (STATE.menu) {
            highlight(DIRECTION.backwards);
        } else {
            highlight(DIRECTION.remove);
            STATE.selection = 1;
            STATE.menu = true;
            highlight(DIRECTION.none);
            window.scrollTo(0, 0);
        }
    }
}

/**
 * 2 (down arrow) was pressed
 */
function down() {
    if (checkHome()) {
        highlight(DIRECTION.forwards);
    } else if (checkList()) {

    } else if (checkShow()) {
        if (STATE.menu && STATE.selection + 1 !== getElements().length) {
            highlight(DIRECTION.forwards);
        } else if (STATE.menu) {
            highlight(DIRECTION.remove);
            STATE.selection = 0;
            getElements()[0].scrollIntoView();
            STATE.menu = false;
            highlight(DIRECTION.none);
        }
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
        return;
    }

    if (STATE.selection < columns) {
        try {
            defaultPosition.scrollIntoView();
        } catch (TypeError) {
            window.scrollTo(0, 0);
        }
    } else {
        if (checkHome()) {
            columns = 0;
        }
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

}

/**
 * Makes the video fullscreen
 */
function fullscreen() {

}

/**
 * Closes the video if one is open, otherwise goes to the home page
 */
function back() {
    if (checkWatch()) {

    } else {
        document.getElementsByClassName(HOME_BUTTON_CLASS)[0].click();
        newPage();
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
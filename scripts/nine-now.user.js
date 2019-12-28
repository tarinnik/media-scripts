// ==UserScript==
// @name        9 Now
// @namespace   tarinnik.github.io/media
// @version     0.4
// @include     https://www.9now.com.au/*
// @icon        https://www.9now.com.au/favicon.ico
// ==/UserScript==

const BACKGROUND_COLOUR = "background:#0084cc";
const PROGRESS_BAR_ID = "nprogress";
const HOME_URL = "https://www.9now.com.au/";
const LIST_URL = "https://www.9now.com.au/history";
const LIST_VIDEO_CLASS = "w8sfks";
const SHOW_PAGE_CLASS = "eU6_I- _30dEKg _3E_qvM";
const SHOW_MENU_CLASS = "_mz6c8 _2G1QMe";
const SHOW_VIDEO_CLASS = "_1V5tPK";
const SHOW_SEASONS_CLASS = "_2nf_Sj";
const EPISODES_URL = "episodes";
const EPISODES_VIDEO_CLASS = "w8sfks";
const WATCH_CLOSE_CLASS = "_1J_y-U _2FfdXJ";
const WATCH_CONTINUE_CLASS = "_2j6a2o _2RxD6t";
const FULLSCREEN_CLASS = "vjs-fullscreen-control vjs-custom-fullscreen vjs-control";
const PLAY_PAUSE_CLASS = "vjs-play-control vjs-control vjs-button";
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
    waitForLoad();
});

/**
 * Triggered when a key is pressed
 */
document.addEventListener('keydown', function(event) {
    key(event);
});

/**
 * Waits for the page to load
 */
function waitForLoad() {
    if (checkList()) {
        let timer = window.setInterval(function() {
            if (document.getElementsByClassName(LIST_VIDEO_CLASS).length !== 0) {
                window.clearInterval(timer);
                newPage();
            }
        }, 200);
    } else {
        let timer = window.setInterval(function() {
            if (!document.getElementById(PROGRESS_BAR_ID)) {
                window.clearInterval(timer);
                newPage();
            }
        }, 200);
    }
}

/**
 * Prepares the page
 */
function newPage() {
    STATE.selection = 0;
    STATE.menu = false;
    STATE.videoSelection = 0;

    if (checkShow()) {
        STATE.menu = true;
    }

    highlight(DIRECTION.none);
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

}

/**
 * Checks if the current page is the watchlist
 * @returns {boolean} if the current page is my list
 */
function checkList() {
    return window.location.href === LIST_URL;
}

/**
 * Checks if the current page is the show page
 * @returns {boolean} if the current page is the show page
 */
function checkShow() {
    return document.getElementsByClassName(SHOW_PAGE_CLASS).length !== 0;
}

/**
 * Checks if the current page is the video
 * @returns {boolean} if the current page is the video
 */
function checkWatch() {
    return document.getElementsByClassName(WATCH_CLOSE_CLASS).length !== 0;
}

/**
 * Checks if the current page is the episodes page
 * @returns {boolean} if the current page is the episodes page
 */
function checkEpisodes() {
    let url = window.location.href;
    return url.slice(url.length - EPISODES_URL.length) === EPISODES_URL;
}

/**
 * Gets the elements that are to be selected
 */
function getElements() {
    if (checkHome()) {

    } else if (checkList()) {
        return document.getElementsByClassName(LIST_VIDEO_CLASS);
    } else if (checkShow()) {
        if (STATE.menu) {
            return document.getElementsByClassName(SHOW_MENU_CLASS);
        } else {
            return document.getElementsByClassName(SHOW_VIDEO_CLASS)[STATE.videoSelection].childNodes;
        }
    } else if (checkEpisodes()) {
        return document.getElementsByClassName(EPISODES_VIDEO_CLASS);
    } else if (checkWatch()) {
        return document.getElementsByClassName(WATCH_CONTINUE_CLASS)[0].childNodes;
    }
}

/**
 * Gets the number of columns the elements have
 * @returns {number} number of columns
 */
function getColumns() {
    if (checkHome()) {

    } else if (checkList() || (checkShow() && !STATE.menu) || checkEpisodes()) {
        let a = getElements()[0];
        let aWidth = getComputedStyle(a, null).getPropertyValue("width");
        return Math.round(innerWidth / parseInt(aWidth));
    } else {
        return 1;
    }
}

function getNextPageElements() {
    if (checkShow()) {
        return getElements()[0].parentElement.parentElement.parentElement.childNodes;
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
        getElements()[STATE.selection].getElementsByTagName("a")[0].click();
        waitForLoad();
    } else if (checkShow()) {
        if (STATE.menu) {
            getElements()[STATE.selection].click();
        } else {
            getElements()[STATE.selection].getElementsByTagName("a")[0].click();
        }
        waitForLoad();
    } else if (checkEpisodes()) {
        getElements()[STATE.selection].getElementsByTagName('a')[0].click();
        waitForLoad();
    } else if (checkWatch() && document.getElementsByClassName(WATCH_CONTINUE_CLASS).length !== 0) {
        getElements()[STATE.selection].click();
    }
}

/**
 * 6 (right arrow) was pressed
 */
function right() {
    if (checkHome()) {

    } else if (checkList()) {
        highlight(DIRECTION.forwards);
    } else if (checkShow()) {
        highlight(DIRECTION.forwards);
        if (!STATE.menu && STATE.selection !== 0 && STATE.selection % getColumns() === 0) {
            getNextPageElements()[2].getElementsByTagName("a")[0].click();
        }
    } else if (checkEpisodes()) {
        highlight(DIRECTION.forwards);
    } else if (checkWatch() && document.getElementsByClassName(WATCH_CONTINUE_CLASS).length !== 0) {
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
    } else if (checkShow()) {
        highlight(DIRECTION.backwards);
        if (!STATE.menu && STATE.selection !== 0 && STATE.selection % getColumns() === 3) {
            getNextPageElements()[1].getElementsByTagName("a")[0].click();
        }
    } else if (checkEpisodes()) {
        highlight(DIRECTION.backwards);
    } else if (checkWatch() && document.getElementsByClassName(WATCH_CONTINUE_CLASS).length !== 0) {
        highlight(DIRECTION.backwards);
    }
}

/**
 * 8 (up arrow) was pressed
 */
function up() {
    if (checkHome()) {

    } else if (checkList()) {
        highlight(DIRECTION.up);
    } else if (checkShow()) {
        if (!STATE.menu && STATE.videoSelection === 0) {
            toggleMenu();
        } else if (!STATE.menu && STATE.videoSelection === 1) {
            highlight(DIRECTION.remove);
            STATE.videoSelection = 0;
            STATE.selection = 0;
            highlight(DIRECTION.none);
        }
    } else if (checkEpisodes()) {
        highlight(DIRECTION.up);
    }
}

/**
 * 2 (down arrow) was pressed
 */
function down() {
    if (checkHome()) {

    } else if (checkList()) {
        highlight(DIRECTION.down);
    } else if (checkShow()) {
        if (STATE.menu) {
            toggleMenu();
        } else if (STATE.videoSelection === 0) {
            highlight(DIRECTION.remove);
            STATE.videoSelection = 1;
            STATE.selection = 0;
            highlight(DIRECTION.none);
        }
    } else if (checkEpisodes()) {
        highlight(DIRECTION.down);
    }
}

function toggleMenu() {
    highlight(DIRECTION.remove);
    STATE.selection = 0;
    STATE.menu = !STATE.menu;
    highlight(DIRECTION.none);
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
        if (STATE.menu) {
            window.scrollTo(0, 0);
        } else if (STATE.videoSelection === 0) {
            STATE.menu = true;
            getElements()[0].scrollIntoView();
            STATE.menu = false;
        } else {
            STATE.videoSelection = 0;
            getElements()[0].scrollIntoView();
            STATE.videoSelection = 1;
        }
        return;
    } else if (checkWatch()) {
        return;
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
function seasons() {
    if (checkShow()) {
        document.getElementsByClassName(SHOW_SEASONS_CLASS)[0].click();
        waitForLoad();
    }
}

/**
 * Toggles the play state of the video
 */
function playpause() {
    document.getElementsByClassName(PLAY_PAUSE_CLASS)[0].click();
}

/**
 * Makes the video fullscreen
 */
function fullscreen() {
    if (checkWatch()) {
        document.getElementsByClassName(FULLSCREEN_CLASS)[0].click();
    }
}

/**
 * Closes the video if one is open, otherwise goes to the home page
 */
function back() {
    if (checkWatch()) {
        document.getElementsByClassName(WATCH_CLOSE_CLASS)[0].getElementsByTagName("a")[0].click();
    } else {
        window.location = HOME_URL;
    }
    waitForLoad();
}

/**
 * Navigates to the list page
 */
function list() {
    window.location = LIST_URL;
    waitForLoad();
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
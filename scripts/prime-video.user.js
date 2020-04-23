// ==UserScript==
// @name     	Prime Video
// @namespace	tarinnik.github.io/media
// @version  	0.7.1
// @include		https://www.primevideo.com/*
// @icon		https://www.primevideo.com/favicon.ico
// ==/UserScript==

const BACKGROUND_COLOUR = "background:#1a7ee1;color:white;padding:7px";
const HOME_URL = "https://www.primevideo.com/";
const HOME_URL_2 = "https://www.primevideo.com/storefront/home/";
const HOME_BANNER_CLASS = "_2JV8iu";
const HOME_VIDEO_ROW_CLASS = "_1gQKv6 u-collection tst-collection";
const LIST_URL = "https://www.primevideo.com/mystuff/watchlist";
const LIST_MENU_CLASS = "mA3s3y g1TQVQ";
const LIST_VIDEO_CLASS = "D0Lu_p";
const SHOW_URL = "https://www.primevideo.com/detail";
const SHOW_MENU_CLASS = "_2eqhmo _2Zapp7 _38qi5F";
const SHOW_VIDEO_CLASS = "js-node-episode-container";
const SHOW_SEASON_ID = "av-droplist-av-atf-season-selector";
const SHOW_SEASON_ITEMS_CLASS = "_17a9Oy";
const WATCH_FULLSCREEN_CLASS = "fullscreenButton";
const WATCH_PLAY_ICON_CLASS = "playIcon";
const WATCH_CLOSE_CLASS = "imageButton";
const SEARCH_URL = "https://www.primevideo.com/search/?phrase=";
const SEARCH_ID = "pv-search-nav";
const SEARCH_VIDEO_CLASS = "av-grid-beard";
const AD_SKIP_BUTTON_CLASS = "adSkipButton skippable";
const NEXT_UP_CARD_CLASS = "nextUpCard";

let STATE = {
    selection: 0,
    menu: false,
    season: false,
    videoSection: false,
    videoSelection: 0,
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
    return window.location.href.slice(0, SHOW_URL.length) === SHOW_URL &&
            !checkWatch();
}

/**
 * Checks if the current page is the video
 * @returns {boolean} if the current page is the video
 */
function checkWatch() {
    return document.getElementsByTagName("body")[0].style.overflow === "hidden";
}

/**
 * Checks if the current page is the search page
 * @returns {boolean} if the current page is the search page
 */
function checkSearch() {
    return window.location.href.slice(0, SEARCH_URL.length) === SEARCH_URL;
}

/**
 * Gets the elements that are to be selected
 */
function getElements() {
    if (checkHome()) {
        if (STATE.videoSelection === 0 && !STATE.videoSection) {
            return document.getElementsByClassName(HOME_BANNER_CLASS)[0].getElementsByTagName("button");
        } else {
            if (STATE.videoSection) {
                let rows = document.getElementsByClassName(HOME_VIDEO_ROW_CLASS);
                let a = [];
                for (let i = 0; i < rows.length; i++) {
                    a.push(rows[i].getElementsByTagName("li")[0]);
                }
                return a;
            } else {
                return document.getElementsByClassName(HOME_VIDEO_ROW_CLASS)[STATE.videoSelection].
                        getElementsByTagName("li");
            }
        }
    } else if (checkList()) {
        if (STATE.menu) {
            return document.getElementsByClassName(LIST_MENU_CLASS)[1].getElementsByTagName('a');
        } else {
            return document.getElementsByClassName(LIST_VIDEO_CLASS);
        }
    } else if (checkShow()) {
        if (STATE.season) {
            return document.getElementsByClassName(SHOW_SEASON_ITEMS_CLASS)[0].getElementsByTagName("li");
        } else if (STATE.menu) {
            let l = document.getElementsByClassName(SHOW_MENU_CLASS)[0].childNodes;
            if (l[1].childNodes.length > 1) {
                let a = [];
                a.push(l[0]);
                let e =  l[1].childNodes;
                for (let i = 0; i < e.length; i++) {
                    a.push(e[i]);
                }
                return a;
            } else {
                return l;
            }
        } else {
            return document.getElementsByClassName(SHOW_VIDEO_CLASS);
        }
    } else if (checkSearch()) {
        return document.getElementsByClassName(SEARCH_VIDEO_CLASS);
    }
}

/**
 * Gets the number of columns the elements have
 * @returns {number} number of columns
 */
function getColumns() {
    if (checkHome()) {
        return 1;
    } else if (checkList() && !STATE.menu) {
        let a = document.getElementsByClassName(LIST_VIDEO_CLASS)[0].parentElement;
        let columns = window.getComputedStyle(a, null).getPropertyValue("grid-template-columns");
        return columns.split(" ").length;
    } else if (checkSearch()) {
        let a = document.getElementsByClassName(SEARCH_VIDEO_CLASS)[0].parentElement;
        let columns = window.getComputedStyle(a, null).getPropertyValue("grid-template-columns");
        return columns.split(" ").length;
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
        if (STATE.videoSelection === 0) {
            let banner = document.getElementsByClassName(HOME_BANNER_CLASS)[0].
                    getElementsByTagName("ul")[0];
            let style = banner.getAttribute("style");
            let i = style[style.indexOf('(') + 1];
            if (i === '-') {
                i = style[style.indexOf('(') + 2];
            }
            banner.getElementsByTagName("li")[i].getElementsByTagName("a")[0].click();
        } else {
            getElements()[STATE.selection].getElementsByTagName("a")[0].click();
        }
    } else if (checkList()) {
        if (STATE.menu) {
            getElements()[STATE.selection].click();
        } else {
            getElements()[STATE.selection].getElementsByTagName("a")[0].click();
        }
    } else if (checkShow()) {
        if (STATE.season) {
            getElements()[STATE.selection].getElementsByTagName("a")[0].click();
        } else if (STATE.menu) {
            if (STATE.selection) {
                getElements()[STATE.selection].getElementsByTagName("button")[0].click();
            } else {
                getElements()[STATE.selection].getElementsByTagName("a")[0].click();
            }
        } else {
            getElements()[STATE.selection].getElementsByTagName("a")[0].click();
        }
    } else if (checkSearch()) {
        getElements()[STATE.selection].getElementsByTagName("a")[0].click();
    } else if (checkWatch()) {
        if (document.getElementsByClassName(AD_SKIP_BUTTON_CLASS).length !== 0) {
            document.getElementsByClassName(AD_SKIP_BUTTON_CLASS)[0].click();
        } else if (document.getElementsByClassName(NEXT_UP_CARD_CLASS).length !== 0) {
            document.getElementsByClassName(NEXT_UP_CARD_CLASS)[0].click();
        }
    }
}

/**
 * 6 (right arrow) was pressed
 */
function right() {
    if (checkHome()) {
        if (STATE.videoSelection === 0) {
            getElements()[getElements().length - 1].click();
        } else {
            highlight(DIRECTION.forwards);
            scrollVideos(DIRECTION.forwards);
        }
    } else if (checkList()) {
        highlight(DIRECTION.forwards);
    } else if (checkShow() && STATE.menu) {
        highlight(DIRECTION.forwards);
    } else if (checkSearch()) {
        highlight(DIRECTION.forwards);
    }
}

/**
 * 4 (left arrow) was pressed
 */
function left() {
    if (checkHome()) {
        if (STATE.videoSelection === 0) {
            getElements()[0].click();
        } else {
            highlight(DIRECTION.backwards);
            scrollVideos(DIRECTION.backwards);
        }
    } else if (checkList()) {
        highlight(DIRECTION.backwards);
    } else if (checkShow() && STATE.menu) {
        highlight(DIRECTION.backwards);
    } else if (checkSearch()) {
        highlight(DIRECTION.backwards);
    }
}

/**
 * 8 (up arrow) was pressed
 */
function up() {
    if (checkHome()) {
        highlight(DIRECTION.remove);
        swapSelection();
        highlight(DIRECTION.backwards);
        swapSelection();
        STATE.selection = 0;
    } else if (checkList()) {
        if (!STATE.menu) {
            if (STATE.selection < getColumns()) {
                toggleMenu();
            } else {
                highlight(DIRECTION.up);
            }
        }
    } else if (checkShow()) {
        if (STATE.season) {
            highlight(DIRECTION.backwards);
        } else if (!STATE.menu && STATE.selection === 0) {
            toggleMenu();
        } else if (!STATE.menu) {
            highlight(DIRECTION.backwards);
        }
    } else if (checkSearch()) {
        highlight(DIRECTION.up);
    }
}

/**
 * 2 (down arrow) was pressed
 */
function down() {
    if (checkHome()) {
        highlight(DIRECTION.remove);
        swapSelection();
        highlight(DIRECTION.forwards);
        swapSelection();
        STATE.selection = 0;
    } else if (checkList()) {
        if (STATE.menu) {
            toggleMenu();
        } else {
            highlight(DIRECTION.down);
        }
    } else if (checkShow()) {
        if (STATE.season) {
            highlight(DIRECTION.forwards);
        } else if (STATE.menu) {
            if (document.getElementsByClassName(SHOW_VIDEO_CLASS).length !== 0) {
                toggleMenu();
            }
        } else {
            highlight(DIRECTION.forwards);
        }
    } else if (checkSearch()) {
        highlight(DIRECTION.down);
    }
}

function scrollVideos(d) {
    let a = getElements()[0];
    console.log(a);
    let num = Math.floor(window.innerWidth / parseInt(window.getComputedStyle(a).getPropertyValue("width")));
    console.log(num);
    let e = a.parentElement.parentElement.getElementsByTagName("button");
    console.log(e);
    if (d === DIRECTION.forwards && STATE.selection % num === 0 && STATE.selection !== 0) {
        if (e.length === 2) {
            e[1].click();
        } else if (e.length === 1 && e[0].getAttribute("aria-label") === "Right") {
            e[0].click();
        }
    } else if (d === DIRECTION.backwards && STATE.selection % num === num - 1) {
        if (e.length === 2) {
            e[0].click();
        } else if (e.length === 1 && e[0].getAttribute("aria-label") === "Left") {
            e[0].click();
        }
    }
}

function swapSelection() {
    let temp = STATE.videoSelection;
    STATE.videoSelection = STATE.selection;
    STATE.selection = temp;
    STATE.videoSection = !STATE.videoSection;
}

/**
 * Scrolls the page so the selected element if visible
 */
function scroll() {
    if (STATE.menu || STATE.season) {
        window.scrollTo(0, 0);
        return;
    } else if (!STATE.videoSection && checkHome()) {
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
        elements[STATE.selection - columns].scrollIntoView();
    }
}

/**
 * Starts the search
 */
function search() {
    STATE.search = true;
    document.getElementById(SEARCH_ID).setAttribute("style", BACKGROUND_COLOUR);
}

function searchKey(key) {
    if (key === "Enter") {
        window.location = SEARCH_URL + STATE.searchQuery + STATE.changingChar;
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

    document.getElementById(SEARCH_ID).value = STATE.searchQuery + STATE.changingChar;
}

/**
 * Resets the search
 */
function resetSearch() {
    STATE.searchQuery = "";
    STATE.changingChar = '';
    STATE.lastKeyPressed = '';
    STATE.numSameKeyPresses = 0;
    STATE.search = false;
    document.getElementById(SEARCH_ID).removeAttribute("style");
}

/**
 * Selects the season menu
 */
function seasons() {
    if (document.getElementById(SHOW_SEASON_ID)) {
        highlight(DIRECTION.remove);
        STATE.selection = 0;
        STATE.season = !STATE.season;
        window.scrollTo(0, 0);
        document.getElementById(SHOW_SEASON_ID).click();
        highlight(DIRECTION.none);
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

function playpause() {
    let video = document.getElementsByTagName("video")[0];
    if (document.getElementsByClassName(WATCH_PLAY_ICON_CLASS).length !== 0) {
        video.play();
    } else {
        video.pause();
    }
}

function fullscreen() {
    if (checkWatch()) {
        document.getElementsByClassName(WATCH_FULLSCREEN_CLASS)[0].click();
    }
}

/**
 * Closes the video if one is open, otherwise goes to the home page
 */
function back() {
    if (checkWatch()) {
        let e = document.getElementsByClassName(WATCH_CLOSE_CLASS);
        e[e.length - 1].click();
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
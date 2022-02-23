// ==UserScript==
// @name        Netflix
// @namespace   tarinnik.github.io/media
// @version	    2.0
// @include	    https://www.netflix.com/*
// @icon        https://www.netflix.com/favicon.ico
// ==/UserScript==

class Stream {
    STATE = {
        verticalSelection: 0,
        horizontalSelection: 0,
        seasonSelection: 0,
        menuSelection: 0,
        menu: false,
        season: false,
        search: false,
        numSameKeyPresses: 0,
        lastKeyPressed: '',
        searchQuery: "",
        changingChar: '',
    };

    DIRECTION = {
        remove: 'r',
        none: 0,
        right: 1,
        left: -1,
        up: -2,
        down: 2,
    };

    searchLetters = [
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

    constructor(names) {
        this.elementNames = names;
    }

    key(event) {
        if (this.STATE.search) {
            this.searchKey(event.key);
            return;
        }

        switch (event.key) {
            case '1':
                this.list();
                break;
            case '2':
                this.down();
                break;
            case '3':
                this.fullscreen();
                break;
            case '4':
                this.left();
                break;
            case '5':
                this.select();
                break;
            case '6':
                this.right();
                break;
            case '7':
                this.home();
                break;
            case '8':
                this.up();
                break;
            case '9':
                this.back();
                break;
            case '0':
                this.search();
                break;
            case 'Enter':
                this.playpause();
                break;
            case '.':
                break;
            case '+':
                this.season();
                break;
            case '-':
                this.changeProfile();
                break;
            case '*':
                break;
            case '/':
                this.refresh();
                break;
        }
    }

    search() {
        let s = document.createElement("div");
        s.id = "new_search";
        let body = document.getElementsByTagName("body")[0];
        body.insertBefore(s, body.children[0]);
        let title = document.createElement("h1");
        title.innerHTML = this.elementNames.searchPhrase;
        title.id = "query";
        title.style.paddingLeft = "10px";
        title.style.paddingTop = "10px";
        title.style.background = "black";
        title.style.height = "50px";
        title.style.color = "white";
        s.appendChild(title);
        window.scrollTo(0, 0);
        this.STATE.search = true;
    }

    searchKey(key) {
        if (key === "Enter") {
            let q = this.STATE.searchQuery + this.STATE.changingChar;
            this.resetSearch();
            window.location = this.elementNames.searchURL + q;
        } else if (key === '-') {
            if (this.STATE.changingChar !== '') {
                this.STATE.changingChar = '';
                this.STATE.lastKeyPressed = '';
                this.STATE.numSameKeyPresses = 0;
            } else if (this.STATE.searchQuery.length !== 0) {
                this.STATE.searchQuery = this.STATE.searchQuery.slice(0, length - 1);
            }
        } else if (key === '+') {
            this.resetSearch();
            document.getElementById("new_search").remove();
        } else if (key !== this.STATE.lastKeyPressed || key === '.') {
            this.STATE.searchQuery += this.STATE.changingChar;
            this.STATE.changingChar = '';
            this.STATE.lastKeyPressed = key;
            this.STATE.numSameKeyPresses = 0;
        }

        let num = parseInt(key);
        if (!isNaN(num)) {
            let len = this.searchLetters[num].length;
            this.STATE.changingChar = this.searchLetters[num][this.STATE.numSameKeyPresses % len];
            this.STATE.numSameKeyPresses++;
        }

        document.getElementById("query").innerHTML = this.elementNames.searchPhrase + this.STATE.searchQuery + this.STATE.changingChar;
    }

    resetSearch() {
        this.STATE.searchQuery = "";
        this.STATE.changingChar = '';
        this.STATE.lastKeyPressed = '';
        this.STATE.numSameKeyPresses = 0;
        this.STATE.search = false;
    }

    /**
     * Checks if the current page is the profile selection page
     */
    isProfile() {}

    /**
     * Checks if the current page is the home page
     * @return {boolean} if the current page is the home page
     */
    isHome() {}

    /**
     * Checks if the current page is the watchlist
     * @returns {boolean} if the current page is my list
     */
    isList() {}

    /**
     * Checks if the current page is the show page
     * @returns {boolean} if the current page is the show page
     */
    isShow() {}

    /**
     * Checks if the current page is the video
     * @returns {boolean} if the current page is the video
     */
    isWatch() {}

    /**
     * Checks if the current page is the search page
     * @returns {boolean} if the current page is the search page
     */
    isSearch() {}

    /**
     * Gets the elements that are to be selected
     */
    getElements() {
        if (this.isProfile()) {
            return this.getProfileElements();
        } else if (this.isHome()) {
            return this.getHomeElements();
        } else if (this.isList()) {
            return this.getListElements();
        } else if (this.isShow()) {
            return this.getShowElements();
        } else if (this.isWatch()) {
            return this.getWatchElements();
        } else if (this.isSearch()) {
            return this.getSearchElements();
        }
    }

    /**
     * Gets the elements from the profile page
     */
    getProfileElements() {}

    /**
     * Gets the elements from the home page
     */
    getHomeElements() {}

    /**
     * Gets the elements from the list page
     */
    getListElements() {}

    /**
     * Gets the elements from the show page
     */
    getShowElements() {}

    /**
     * Gets the elements from the watch page
     */
    getWatchElements() {}

    /**
     * Gets the elements from the search page
     */
    getSearchElements() {}

    /**
     * Gets the number of columns
     */
    getColumns() {
        return 1;
    }

    /**
     * Highlights an element
     * @param d direction to highlight in
     */
    highlight(d) {
        let elements = this.getElements();
        let columns = this.getColumns();

        if (d === this.DIRECTION.none) { // Highlight the current element
            this.highlightElement(elements);
        } else if (d === this.DIRECTION.remove) { // Removes the highlight from the current element
            this.unHighlightElement(elements);
        } else if (d === this.DIRECTION.up || d === this.DIRECTION.down) { // Highlight the element in the row above or below
            let rowLength = elements[this.STATE.verticalSelection].length;
            if ((d === this.DIRECTION.up && this.STATE.verticalSelection === 0) ||
                        (d === this.DIRECTION.down && this.STATE.verticalSelection === elements.length - 1)) {
                    return;
            }
            if (this.STATE.season) {
                this.unHighlightElement(elements);
                this.STATE.seasonSelection += d/2;
                this.highlightElement(elements);
            }
            if (rowLength !== undefined) { // 2D
                this.unHighlightElement(elements)
                let nextRow = this.STATE.verticalSelection + d/2;
                if (elements[nextRow].length - 1 < this.STATE.horizontalSelection) {
                    this.STATE.horizontalSelection = elements[nextRow].length - 1;
                }
                this.STATE.verticalSelection = nextRow;
                this.highlightElement(elements);
            } else { // 1D
                this.unHighlightElement(elements);
                this.STATE.verticalSelection += d/2;
                this.highlightElement(elements);
            }
        } else { // Left or right an element
            let rowLength = elements[this.STATE.verticalSelection].length;
            if (rowLength !== undefined) { // 2D
                if ((d === this.DIRECTION.right && this.STATE.horizontalSelection === rowLength - 1) ||
                        (d === this.DIRECTION.left && this.STATE.horizontalSelection === 0)) {
                    return;
                }
                this.unHighlightElement(elements);
                this.STATE.horizontalSelection += d;
                this.highlightElement(elements);
            } else { // 1D
                if ((d === this.DIRECTION.left && this.STATE.verticalSelection === 0) ||
                        (d === this.DIRECTION.right && this.STATE.verticalSelection === elements.length - 1)) {
                    return;
                }
                this.unHighlightElement(elements);
                this.STATE.verticalSelection += d;
                this.highlightElement(elements);
            }
        }

        this.scroll();
    }

    highlightElement(elements) {
        try {
            Object.assign(elements[this.STATE.verticalSelection][this.STATE.horizontalSelection].style, this.elementNames.highlightColour);
        } catch (err) {
            Object.assign(elements[this.STATE.verticalSelection].style, this.elementNames.highlightColour);
        }
    }

    unHighlightElement(elements) {
        try {
            elements[this.STATE.verticalSelection][this.STATE.horizontalSelection].style.removeProperty("background");
            elements[this.STATE.verticalSelection][this.STATE.horizontalSelection].style.removeProperty("padding");
        } catch (e) {
            elements[this.STATE.verticalSelection].style.removeProperty("background");
            elements[this.STATE.verticalSelection].style.removeProperty("padding");
        }
    }

    select() {
        let elements = this.getElements();
        if (elements[this.STATE.verticalSelection].length !== undefined) {
            let link = elements[this.STATE.verticalSelection][this.STATE.horizontalSelection].getElementsByTagName("a");
            if (link.length !== 0) {
                link[0].click();
            }
        } else {
            let link = elements[this.STATE.verticalSelection].getElementsByTagName("a");
            if (link.length !== 0) {
                link[0].click();
            }
        }
        this.reset();
    }

    reset() {
        this.STATE.verticalSelection = 0;
        this.STATE.horizontalSelection = 0;
        this.STATE.seasonSelection = 0;
        this.STATE.menuSelection = 0;
    }

    up() {
        this.highlight(this.DIRECTION.up);
    }

    down() {
        this.highlight(this.DIRECTION.down);
    }

    left() {
        this.highlight(this.DIRECTION.left);
        this.horizontalScroll(this.DIRECTION.left);
    }

    right() {
        this.highlight(this.DIRECTION.right);
        this.horizontalScroll(this.DIRECTION.right);
    }

    /**
     * Scrolls the page so the highlighted element is in view
     */
    scroll() {
        let elements = this.getElements();
        if (this.STATE.verticalSelection === 0) {
            window.scroll(0, 0);
        } else if (elements[this.STATE.verticalSelection - 1].length !== undefined) { // 2D
            elements[this.STATE.verticalSelection - 1][0].scrollIntoView();
        } else { // 1D
            elements[this.STATE.verticalSelection - 1].scrollIntoView();
        }
    }

    horizontalScroll(d) {}

    back() {
        if (this.isWatch()) {
            document.getElementsByClassName(this.elementNames.watchClose)[0].click();
        }
    }

    changeProfile() {}

    /**
     * Selects the season menu
     */
    season() {}

    /**
     * Toggles the play state of the video
     */
    playpause() {
        if (document.getElementsByClassName(this.elementNames.watchPlay).length !== 0) {
            document.getElementsByClassName(this.elementNames.watchPlay)[0].click();
        } else {
            document.getElementsByClassName(this.elementNames.watchPause)[0].click();
        }
    }

    /**
     * Makes the video fullscreen
     */
    fullscreen() {
        if (document.getElementsByClassName(this.elementNames.watchFullscreen).length !== 0) {
            document.getElementsByClassName(this.elementNames.watchFullscreen)[0].click();
        } else {
            document.getElementsByClassName(this.elementNames.watchWindowed)[0].click();
        }
    }

    /**
     * Navigates to the list page
     */
    list() {
        window.location = this.elementNames.listURL;
    }

    /**
     * Goes back to the media home page
     */
    home() {
        window.location = "https://tarinnik.github.io/media/";
    }

    /**
     * Refreshes the page
     */
    refresh() {
        window.location = window.location.href;
    }
}

const names = {
	highlightColour: {
		background: "#bf180f",
		padding: "10px",
	},
    profileElements: "profile",
    profileUrl: "/ProfilesGate",
    homeUrlContains: "browse",
    homeRowElements: "lolomoRow",
    homeColumnElements: "slider-item",
    showVisibleElement: "previewModal--container",
    showButtonElements: "buttonControls--container",
    showEpisodeElements: "episodeSelector-container",
    showCloseButton: "previewModal-close",
	watchUrlContains: "watch",
    watchButtons: "ltr-1enhvti",
    watchFullscreenIndex: 9,
    watchPlayer: "watch-video--player-view",
    searchURL: "https://www.netflix.com/search?q=",
    searchPhrase: "Search: ",
    searchRowElements: "rowContainer",
    searchColumnElements: "slider-item",
    searchBox: "searchInput",
};

class Netflix extends Stream {
	isProfile() {
        return document.getElementsByClassName(this.elementNames.profileElements).length !== 0;
    }

    isHome() {
        return window.location.href.includes(this.elementNames.homeUrlContains) && !this.isProfile() && !this.isShow();
    }

    isShow() {
        return document.getElementsByClassName(this.elementNames.showVisibleElement).length !== 0;
    }

    isSearch() {
        return window.location.href.includes(this.elementNames.searchURL) && !this.isShow();
    }

    isWatch() {
		return window.location.href.includes(this.elementNames.watchUrlContains);
	}

    getProfileElements() {
        return document.getElementsByClassName(this.elementNames.profileElements);
    }

    getHomeElements() {
        let elements = [];
        let rows = document.getElementsByClassName(this.elementNames.homeRowElements);
        for (let i = 0; i < rows.length; i++) {
            elements.push(rows[i].getElementsByClassName(this.elementNames.homeColumnElements));
        }
        return elements;
    }

    getShowElements() {
        let elements = [];
        let buttons = document.getElementsByClassName(this.elementNames.showButtonElements);
        elements.push(buttons[0].children);
        let episodes = document.getElementsByClassName(this.elementNames.showEpisodeElements);
        if (episodes.length !== 0) {
            for (let i = 0; i < episodes[0].children.length; i++) {
                elements.push(episodes[0].children[i]);
            }
        }
        return elements;
    }

    getSearchElements() {
        let elements = [];
        let rows = document.getElementsByClassName(this.elementNames.searchRowElements);
        for (let i = 0; i < rows.length; i++) {
            elements.push(rows[i].getElementsByClassName(this.elementNames.searchColumnElements));
        }
        return elements;
    }

    changeProfile() {
        window.location = this.elementNames.profileUrl;
    }

    select() {
        if (this.isShow()) {
            if (this.STATE.verticalSelection === 0) {
                this.getElements()[0][this.STATE.horizontalSelection].getElementsByTagName("button")[0].click();
            } else {
                this.getElements()[this.STATE.verticalSelection].click();
            }
        } else {
            this.unHighlightElement(this.getElements());
            super.select();
        }
    }

    fullscreen() {
		if (this.isWatch()) {
			document.getElementsByClassName(this.elementNames.watchPlayer)[0].focus();
            document.getElementsByClassName(this.elementNames.watchButtons)[this.elementNames.watchFullscreenIndex].click();
		}
	}

    back() {
        if (this.isShow()) {
            let button = document.getElementsByClassName(this.elementNames.showCloseButton)[0].children[0];
            let event = new MouseEvent('click', {bubbles: true, cancelable: true, view: window});
            button.dispatchEvent(event);
        }
    }
}

const netflix = new Netflix(names);

/**
 * Triggered when the page loads
 */
window.addEventListener('load', function() {
    if (netflix.isSearch()) {
        document.getElementById(netflix.elementNames.searchBox).blur();
    }
    netflix.highlightElement(netflix.getElements());
});

/**
 * Triggered when a key is pressed
 */
document.addEventListener('keydown', function(event) {
    netflix.key(event);
});

// ==UserScript==
// @name        Disney+
// @namespace   tarinnik.github.io/media
// @version     1.0
// @include     https://www.disneyplus.com/*
// @icon        https://www.disneyplus.com/favicon.ico
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
                break;
            case '*':
                break;
            case '/':
                this.refresh();
                break;
        }
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
        //element.removeAttribute("style");
    }

    select() {
        let elements = this.getElements();
        if (elements[this.STATE.verticalSelection].length !== undefined) {
            let link = elements[this.STATE.verticalSelection][this.STATE.horizontalSelection].getElementsByTagName("a");
            if (link.length !== 0) {
                link[0].click();
            }
        }
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
    scroll() {}

    horizontalScroll(d) {}

    search() {}

    back() {
        if (this.isWatch()) {
            document.getElementsByClassName(this.elementNames.watchClose)[0].click();
        }
    }

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
        background: "#00bfdd",
        padding: '5px'
    },
    navigationBar: "nav-list",
    watchUrlContains: "video",
    watchFullscreen: "fullscreen-icon",
    watchWindowed: "exit-fullscreen-icon",
    watchPlay: "play-pause-icon",
    watchPause: "play-pause-icon",
    watchClose: "back-arrow",
    listURL: "https://www.disneyplus.com/watchlist",
    listNavIndex: 3,
    homeURL: "https://www.disneyplus.com/",
    homeNavIndex: 1,
    homeUrlContains: "home",
    homeVerticalElements: "home-collection",
    homeHorizontalElements: "slick-slide",
    homeHorizontalVisibleElements: "slick-active",
    homeBrandElements: "gv2-asset",
    rowNextButton: "sc-iiUIRa iXgoSW slick-arrow slick-next",
    rowPreviousButton: "sc-iiUIRa eHvBfV slick-arrow slick-prev",
    brandUrlContains: "brand",
    brandVerticalElements: "brand-collection",
    brandHorizontalElements: "slick-slide",
    brandHorizontalVisibleElements: "slick-active",
    movieUrlContains: "movies",
    movieControlElements: "sc-fAJaQT xqbsA",
    showUrlContains: "series",
    showControlElements: "button button-play button-play--default ",
    showEpisodes: "slick-active",
}

class Disney extends Stream {
    isHome() {
        return window.location.href.includes(this.elementNames.homeUrlContains);
    }

    isWatch() {
        return window.location.href.includes(this.elementNames.watchUrlContains);
    }

    isBrand() {
        return window.location.href.includes(this.elementNames.brandUrlContains);
    }

    isMovie() {
        return window.location.href.includes(this.elementNames.movieUrlContains);
    }

    isShow() {
        return window.location.href.includes(this.elementNames.showUrlContains);
    }

    getElements() {
        let ans = super.getElements();
        if (ans === undefined) {
            if (this.isBrand()) {
                return this.getBrandElements();
            } else if (this.isMovie()) {
                return this.getMovieElements();
            }
        } else {
            return ans;
        }
    }

    getHomeElements() {
        let elements = [];
        let rows = document.getElementById(this.elementNames.homeVerticalElements).children;
        for (let i = 1; i < rows.length; i++) {
            if (i === 1) {
                elements.push(rows[i].getElementsByClassName(this.elementNames.homeBrandElements));
            } else {
                elements.push(rows[i].getElementsByClassName(this.elementNames.homeHorizontalElements));
            }
        }
        return elements;
    }

    getBrandElements() {
        let elements = [];
        let rows = document.getElementById(this.elementNames.brandVerticalElements).children;
        for (let i = 0; i < rows.length; i++) {
            elements.push(rows[i].getElementsByClassName(this.elementNames.brandHorizontalElements));
        }
        return elements;
    }

    getMovieElements() {
        let elements = [];
        let buttons = document.getElementsByClassName(this.elementNames.movieControlElements)[0].children;
        for (let i = 0; i < 2; i++) {
            elements.push(buttons[i]);
        }
        return elements;
    }

    getShowElements() {
        let elements = [];
        elements.push(document.getElementsByClassName(this.elementNames.showControlElements));
        let episodes = document.getElementsByClassName(this.elementNames.showEpisodes);
        let epArray = [];
        for (let i = 1; i < episodes.length; i++) {
            epArray.push(episodes[i]);
        }
        elements.push(epArray);
        return elements;
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
        super.select();
        if (this.isHome() && this.STATE.verticalSelection === 0) {
            console.log(this.getHomeElements()[0][this.STATE.horizontalSelection].children[0]);
            this.getHomeElements()[0][this.STATE.horizontalSelection].children[0].click();
        } else if (this.isMovie()) {
            this.getMovieElements()[this.STATE.verticalSelection].click();
        }
        this.newPage();
    }

    scroll() {
        let elements = this.getElements();
        if (elements[0].length !== undefined) {
            if (this.STATE.verticalSelection === 0) {
                window.scroll(0, 0);
            } else {
                elements[this.STATE.verticalSelection - 1][0].scrollIntoView();
            }
        }
    }

    horizontalScroll(d) {
        let elements = this.getElements();
        if (this.isHome() && elements[this.STATE.verticalSelection].length !== undefined && this.STATE.verticalSelection !== 0) {
            let vis = document.getElementById(this.elementNames.homeVerticalElements).children[this.STATE.verticalSelection + 1].getElementsByClassName(this.elementNames.homeHorizontalVisibleElements);
            if (d === this.DIRECTION.left) {
                if (vis[0] === elements[this.STATE.verticalSelection][this.STATE.horizontalSelection + 1]) {
                    document.getElementById(this.elementNames.homeVerticalElements).children[this.STATE.verticalSelection + 1].getElementsByClassName(this.elementNames.rowPreviousButton)[0].click();
                }
            } else {
                if (vis[vis.length - 1] === elements[this.STATE.verticalSelection][this.STATE.horizontalSelection - 1]) {
                    document.getElementById(this.elementNames.homeVerticalElements).children[this.STATE.verticalSelection + 1].getElementsByClassName(this.elementNames.rowNextButton)[0].click();
                }
            }
        } else if (this.isBrand() && elements[this.STATE.verticalSelection].length !== undefined) {
            let vis = document.getElementById(this.elementNames.brandVerticalElements).children[this.STATE.verticalSelection].getElementsByClassName(this.elementNames.brandHorizontalVisibleElements);
            if (d === this.DIRECTION.left) {
                if (vis[0] === elements[this.STATE.verticalSelection][this.STATE.horizontalSelection + 1]) {
                    document.getElementById(this.elementNames.brandVerticalElements).children[this.STATE.verticalSelection].getElementsByClassName(this.elementNames.rowPreviousButton)[0].click();
                }
            } else {
                if (vis[vis.length - 1] === elements[this.STATE.verticalSelection][this.STATE.horizontalSelection - 1]) {
                    document.getElementById(this.elementNames.brandVerticalElements).children[this.STATE.verticalSelection].getElementsByClassName(this.elementNames.rowNextButton)[0].click();
                }
            }
        }
    }

    list() {
        document.getElementById(this.elementNames.navigationBar).children[this.elementNames.listNavIndex].getElementsByTagName("a")[0].click();
    }

    newPage() {
        this.STATE.verticalSelection = 0;
        this.STATE.horizontalSelection = 0;
    }

    back() {
        super.back();
        if (!this.isWatch()) {
            document.getElementById(this.elementNames.navigationBar).children[this.elementNames.homeNavIndex].getElementsByTagName("a")[0].click();
        }
    }
}

const disney = new Disney(names);

/**
 * Triggered when the page loads
 */
window.addEventListener('load', function() {

});

/**
 * Triggered when a key is pressed
 */
document.addEventListener('keydown', function(event) {
    disney.key(event);
});


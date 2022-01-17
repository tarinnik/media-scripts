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
            if (rowLength !== undefined) {
                if ((d === this.DIRECTION.up && this.STATE.verticalSelection === 0) ||
                        (d === this.DIRECTION.down && this.STATE.verticalSelection === elements.length - 1)) {
                    return;
                }
                this.unHighlightElement(elements)
                let nextRow = this.STATE.verticalSelection + d/2;
                if (elements[nextRow].length - 1 < this.STATE.horizontalSelection) {
                    this.STATE.horizontalSelection = elements[nextRow].length - 1;
                }
                this.STATE.verticalSelection = nextRow;
                this.highlightElement(elements);2
            } else {
                // 1D
            }
        } else { // Left or right an element
            let rowLength = elements[this.STATE.verticalSelection].length;
            if (rowLength !== undefined) {
                if ((d === this.DIRECTION.right && this.STATE.horizontalSelection === rowLength - 1) ||
                        (d === this.DIRECTION.left && this.STATE.horizontalSelection === 0)) {
                    return;
                }
                this.unHighlightElement(elements);
                this.STATE.horizontalSelection += d;
                this.highlightElement(elements);
            } else {
                // 1D
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
    }

    right() {
        this.highlight(this.DIRECTION.right);
    }

    /**
     * Scrolls the page so the highlighted element is in view
     */
    scroll() {}

    search() {}

    back() {
        if (this.isWatch()) {
            document.getElementsByClassName(this.elementNames.watchClose)[0].click();
        } else {
            history.back();
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
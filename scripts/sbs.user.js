// ==UserScript==
// @name     	SBS
// @namespace   tarinnik.github.io/gmscripts
// @version	    1.2
// @include	    https://www.sbs.com.au/ondemand/*
// @icon        https://www.sbs.com.au/favicon.ico
// ==/UserScript==

if (typeof video_select === 'undefined') {
	var video_select = -1;
}

// Background colour
var selectionColour = "background:#6f521e";

let videoRestart = false;

//Scroll when loading page
if (window.location.href.slice(0,40) === "https://www.sbs.com.au/ondemand/program/") {
    //document.getElementsByClassName("text lighter text--seriesLarge video__detail__name ng-binding")[0].scrollIntoView();
    video_select = -1;
} else if (window.location.href === "https://www.sbs.com.au/ondemand/") {
    video_select = -1;
}

//
function scroll(video, firstPos, secondPos, firstPosNum) {
	if (video < firstPosNum) {
		document.getElementsByClassName(firstPos)[0].scrollIntoView();
	} else {
		document.getElementsByClassName(secondPos)[video-firstPosNum].scrollIntoView();
	}
}

function selectNext(className) {
	//If it's the first video
	if (video_select === -1) {
		video_select++;
		document.getElementsByClassName(className)[video_select].setAttribute("style", selectionColour);
	}

	//If it's the end of the available videos
	else if (video_select >= document.getElementsByClassName(className).length - 1) {
		document.getElementsByClassName(className)[0].setAttribute("style", selectionColour);
		document.getElementsByClassName(className)[video_select].removeAttribute("style");
		video_select = 0;
	}

	//Anything else
	else {
		video_select++;
		document.getElementsByClassName(className)[video_select].setAttribute("style", selectionColour);
		document.getElementsByClassName(className)[video_select - 1].removeAttribute("style");
	}
}

function selectPrevious(className) {
	var length = document.getElementsByClassName(className).length;

	//If it's the first video
	if (video_select === 0 || video_select === -1) {
		document.getElementsByClassName(className)[length - 1].setAttribute("style", selectionColour);
		document.getElementsByClassName(className)[0].removeAttribute("style");
		video_select = length - 1;
	}

	//Anything else
	else {
		video_select--;
		document.getElementsByClassName(className)[video_select].setAttribute("style", selectionColour);
		document.getElementsByClassName(className)[video_select + 1].removeAttribute("style");
	}
}

function favourites() {
    document.getElementsByClassName("favourite__dropdown dropdown ng-scope")[0].setAttribute("id", "favourites_dropdown");

    if (!!document.getElementsByClassName("favourite__dropdown dropdown ng-scope open")[0]) {
        document.getElementById("favourites_dropdown").removeAttribute("class");
        document.getElementById("favourites_dropdown").setAttribute("class", "favourite__dropdown dropdown ng-scope");
    } else {
        document.getElementById("favourites_dropdown").removeAttribute("class");
        document.getElementById("favourites_dropdown").setAttribute("class", "favourite__dropdown dropdown ng-scope open");
    }

}

function videoResumeRestart() {
	let elements = document.getElementById("video-player").contentDocument.childNodes[1].
			getElementsByClassName("tpButton");
	if (videoRestart === false) {
		elements[0].setAttribute("style", selectionColour);
		elements[1].removeAttribute("style");
		videoRestart = true;
	} else {
		elements[1].setAttribute("style", selectionColour);
		elements[0].removeAttribute("style");
		videoRestart = false;
	}
}
function playpause() {
	if (window.location.href.slice(0, 38) === "https://www.sbs.com.au/ondemand/video/") {
		document.getElementById("video-player").contentDocument.childNodes[1].
                getElementsByClassName("spcPlayPauseContainer")[0].click();
	}
}

// Key mappings
const map = {};
onkeydown = onkeyup = function(e){
	map[e.keyCode] = e.type === 'keydown';

	// CTRL + ALT + R - Recently viewed shows
	if ((map[17] && map[18] && map[82]) || map[97]) {
        favourites();
	}

	// CTRL + ALT + F - Fullscreen
	else if ((map[17] && map[18] && map[70]) || map[99]){
		document.getElementById("video-player").contentDocument.childNodes[1].
				getElementsByClassName("spcFullscreenButton")[0].click()
	}

	// CTRL + ALT + C - Close player
	else if ((map[17] && map[18] && map[67]) || map[105]) {
		window.location = "https://www.sbs.com.au/ondemand";
	}

	// CTRL + ALT + N - Highlight next video
	else if ((map[17] && map[18] && map[78]) || map[102]) {

	    if (window.location.href === "https://www.sbs.com.au/ondemand/") {
	        if (!!document.getElementsByClassName("favourite__dropdown dropdown ng-scope open")[0]) {
                selectNext("favourite__item");
            } else {
                document.getElementsByClassName("icon icon--m icon--right rn-carousel-control rn-carousel-control-next animation-all")[0].click();
            }
	    }

	    else if (window.location.href.slice(0,40) === "https://www.sbs.com.au/ondemand/program/") {
            selectNext("episode__details");
            scroll(video_select, "text lighter text--t2 latest-episode__detail__title", "episode__details", 1);
        } else if (window.location.href.slice(0, 38) === "https://www.sbs.com.au/ondemand/video/") {
			videoResumeRestart();
		}
	}

	// CTRL + ALT + M - Highlight previous video
	else if ((map[17] && map[18] && map[77]) || map[100]) {

	    if (window.location.href === "https://www.sbs.com.au/ondemand/") {
	        if (!!document.getElementsByClassName("favourite__dropdown dropdown ng-scope open")[0]) {
                selectPrevious("favourite__item");
            } else {
                document.getElementsByClassName("icon icon--m icon--left rn-carousel-control rn-carousel-control-prev animation-all")[0].click();
            }
	    }

	    else if (window.location.href.slice(0,40) === "https://www.sbs.com.au/ondemand/program/") {
            selectPrevious("episode__details");
            scroll(video_select, "text lighter text--t2 latest-episode__detail__title", "episode__details", 1);
        } else if (window.location.href.slice(0, 38) === "https://www.sbs.com.au/ondemand/video/") {
			videoResumeRestart();
		}

	}


	// CTRL + ALT + S - Select highlighted video
	else if ((map[17] && map[18] && map[83]) || map[101]) {

	    if (window.location.href === "https://www.sbs.com.au/ondemand/") {
	        if (!!document.getElementsByClassName("favourite__dropdown dropdown ng-scope open")[0]) {
	            document.getElementsByClassName("favourite__item")[video_select].getElementsByClassName("ng-binding")[0].click();
            } else {
                document.getElementsByClassName("text lighter preview-hero__title")[0].getElementsByClassName("ng-binding")[0].click();
            }
        }

	    else if (window.location.href.slice(0,40) === "https://www.sbs.com.au/ondemand/program/") {
            document.getElementsByClassName("episode__image")[video_select].getElementsByClassName("icon icon--play icon--xl icon--feature")[0].click();
        }

	    else if (window.location.href.slice(0,38) === "https://www.sbs.com.au/ondemand/video/") {
			let elements = document.getElementById("video-player").contentDocument.childNodes[1].
			getElementsByClassName("tpButton");
			if (elements.length === 0) {
				document.getElementById("video-player").contentDocument.childNodes[1].
						getElementsByClassName("tpPlayOverlay")[0].click();
			} else {
				if (videoRestart === false) {
					elements[1].click();
				} else {
					elements[0].click();
				}
			}
        }
	}

	else if (map[103]) {
		window.location = "https://tarinnik.github.io/media/";
	}

	else if (map[13]) {
		playpause();
	}


};


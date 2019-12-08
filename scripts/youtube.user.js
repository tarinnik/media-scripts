// ==UserScript==
// @name     	Youtube
// @namespace	tarinnik.github.io/gmscripts
// @version  	0.0.1
// @include		https://www.youtube.com/*
// @icon		https://youtube.com/favicon.ico
// ==/UserScript==

const BACKGROUND_COLOUR = "background:red";
const SUBSCRIPTION_BOX = "style-scope ytd-guide-renderer";
const SUBSCRIPTION_TAG_NAME = "style-scope ytd-guide-section-renderer";
const ROOT_URL = "https://www.youtube.com/";
const WATCH_URL = "https://www.youtube.com/watch?v=";
const RECENTS_URL = "https://www.youtube.com/feed/subscriptions";
const CHANNEL_VIDEOS = "/videos";
const CHANNEL_URL_LENGTH = 31;
const EMBED_URL_LENGTH = 30;

// Redirecting embeded youtube links to full youtube
if (window.location.href.slice(0, EMBED_URL_LENGTH) === "https://www.youtube.com/embed/") {
	let url = window.location.href;
	let videoID = url.slice(30, 41);
	window.location = WATCH_URL + videoID;
}

let STATE = {
	main: 0,
	section: 0,
	selection: 0,
};


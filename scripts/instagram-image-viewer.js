// ==UserScript==
// @name     Instagram Image Viewer
// @version  1
// @grant    none
// ==/UserScript==

var redirect = confirm("View image?");

if (redirect == true) {
	window.location = document.querySelector("meta[property='og:image']").getAttribute('content');
}


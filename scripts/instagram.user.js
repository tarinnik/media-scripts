// ==UserScript==
// @name     	Instagram
// @namespace	tarinnik.gitlab.io/gmscripts
// @version  	1.0.2
// @include		https://www.instagram.com/p/*
// ==/UserScript==

// Add the following domamin to the 'User Includes' section in the settings for this script:
// https://www.instagram.com/p/*

var redirect = confirm("View image?");

if (redirect == true) {
	window.location = document.querySelector("meta[property='og:image']").getAttribute('content');
}


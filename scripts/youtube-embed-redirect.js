// ==UserScript==
// @name     Youtube Emebeded Video Redirect
// @version  1
// @grant    none
// ==/UserScript==

// Add the following domain to the 'User Includes' section in the settings for this script:
// https://www.youtube.com/embed/*

var url = window.location.href;
var videoID = url.slice(30, 41);
var prefix = url.slice(0, 24);
var finalURL = prefix + "watch?v=" + videoID;
window.location = finalURL;


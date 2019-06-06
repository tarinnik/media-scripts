// ==UserScript==
// @name     	Netflix
// @namespace   tarinnik.gitlab.io/gmscripts
// @version		1.0.2
// @include		https://www.netflix.com/*
// @icon		https://www.netflix.com/favicon.ico
// ==/UserScript==


// Key mappings
var map = {};
onkeydown = onkeyup = function(e){
	map[e.keyCode] = e.type == 'keydown';

	// Netflix's default binding for fullscreen is CTRL+ALT+F

	// CTRL + ALT + C - Close player
	if (map[17] && map[18] && map[67] {
		document.getElementsByClassName("touchable PlayerControls--control-element nfp-button-control default-control-button button-nfplayerBack tooltip-button tooltip-button-pos-center tooltip-button-align-right")[0].click();
	}

}

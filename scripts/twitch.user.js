// ==UserScript==
// @name     	Twitch
// @namespace	tarinnik.gitlab.io/gmscripts
// @version  	1
// @include  	https://www.twitch.tv/*
// @icon 		https://twitch.tv/favicon.ico
// ==/UserScript==


//Toggle theatre mode
function theatre_mode() {
  document.getElementsByClassName("player-button qa-theatre-mode-button")[0].click();
}

//Toggle fullscreen mode
function fullscreen_mode() {
  document.getElementsByClassName("player-button qa-fullscreen-button pl-mg-r-1 pl-button__fullscreen--tooltip-left")[0].click();
}

// Key mappings
var map = {};
onkeydown = onkeyup = function(e){
  map[e.keyCode] = e.type == 'keydown';

  // CTRL + ALT + T - theatre mode
  if (map[17] && map[18] && map[84]) {
    theatre_mode();
  }
}

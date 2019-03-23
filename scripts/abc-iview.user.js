// ==UserScript==
// @name     	ABC iview
// @namespace 	https://tarinnik.github.io/gmscripts
// @version  	1
// @include  	https://iview.abc.net.au/*
// @grant    	none
// ==/UserScript==


// Key mappings
var map = {};
onkeydown = onkeyup = function(e){
 map[e.keyCode] = e.type == 'keydown';

  // CTRL + ALT + R - Recently viewed shows
  if (map[17] && map[18] && map[82]) {
    window.location = "https://iview.abc.net.au/your/recents";
  }
  // CTRL + ALT + P - Play main video
  else if (map[17] && map[18] && map[80]) {
   document.getElementsByClassName("iv-1yw_p")[0].click();
  }
  // CTRL + ALT + F - Fullscreen
  else if (map[17] && map[18] && map[70]){
   document.getElemetsByClassName("jw-video jw-reset")[0].mozRequestFullScreen();
  }
  // CTRL + ALT + C - Close player
  else if (map[17] && map[18] && map[67]) {
    document.getElementsByClassName("iv-PfJvL iv-3bAEn iv-2npVU iconLarge iv-1NR5s iv-25r32")[0].click();
  }
}


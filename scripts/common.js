// Common keybinds code

var map = {};
onkeydown = onkeyup = function(e){
	map[e.keyCode] = e.type == 'keydown';

	// CTRL + ALT + T - theatre mode
	if (map[17] && map[18] && map[84]) {
		theatre_mode();
	}

	// CTRL + ALT + F - Fullscreen
	if (map[17] && map[18] && map[70]) {
		fullscreen();
	}

	// CTRL + ALT + R - Recent videos
	if (map[17] && map[18] && map[82]) {
		recents();
	}

    // CTRL + ALT + O - Search
    if (map[17] && map[18] && map[79]) {
        search();
	}

	// CTRL + ALT + N - Highlight next video/streamer
	if (map[17] && map[18] && map[78]) {
	    selectNext();
	}

	// CTRL + ALT + M - Highlight previous video/streamer
	if (map[17] && map[18] && map[77]) {
        selectPrevious();
	}

	// CTRL + ALT + S - Select highlighted video
	if (map[17] && map[18] && map[83]) {
		selectVideo();
	}

	// CTRL + ALT + F - Fullscreen
	if (map[17] && map[18] && map[70]){
		fullscreen();
	}

	// CTRL + ALT + C - Close player
	if (map[17] && map[18] && map[67]) {
		closePlayer();
	}

}
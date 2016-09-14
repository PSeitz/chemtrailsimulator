function makeFullScreen(canvas){
    if (
    	document.fullscreenEnabled ||
    	document.webkitFullscreenEnabled ||
    	document.mozFullScreenEnabled ||
    	document.msFullscreenEnabled
    ) {
        if (canvas.requestFullscreen) {
        	canvas.requestFullscreen();
        } else if (canvas.webkitRequestFullscreen) {
        	canvas.webkitRequestFullscreen();
        } else if (canvas.mozRequestFullScreen) {
        	canvas.mozRequestFullScreen();
        } else if (canvas.msRequestFullscreen) {
        	canvas.msRequestFullscreen();
        }
    }
}

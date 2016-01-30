CanvasRenderingContext2D.prototype.sr = function(fn) {
	this.save();

	fn();

	this.restore();
};

HTMLElement.prototype.requestFullScreen = HTMLElement.prototype.requestFullScreen
	|| HTMLElement.prototype.requestFullscreen
	|| HTMLElement.prototype.webkitRequestFullScreen
	|| HTMLElement.prototype.webkitRequestFullscreen;

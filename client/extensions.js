CanvasRenderingContext2D.prototype.sr = function(fn) {
	this.save();

	fn();

	this.restore();
};

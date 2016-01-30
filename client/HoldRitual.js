function HoldRitual(game, config) {
	Ritual.apply(this, arguments);
	this.x = config.x;
	this.y = config.y;
	this.held = false;

	this.touchBound = this.touch.bind(this)
}

HoldRitual.prototype = Object.create(Ritual.prototype);

HoldRitual.prototype.activate = function() {
	Ritual.prototype.activate.apply(this, arguments);
	['touchstart', 'touchend', 'touchmove'].forEach(function(e) {
		this.game.canvas.addEventListener(e, this.touchBound);
	}, this);
};

HoldRitual.prototype.destroy = function() {
	Ritual.prototype.destroy.apply(this, arguments);
	['touchstart', 'touchend', 'touchmove'].forEach(function(e) {
		this.game.canvas.removeEventListener(e, this.touchBound);
	}, this);
};

HoldRitual.prototype.touch = function(e) {
	this.held = false;
	var px = this.x * this.game.canvasSize.w;
	var py = this.y * this.game.canvasSize.h;

	for(var i = 0; i < e.touches.length; i++) {
		var dist = distance(e.touches[i].clientX, e.touches[i].clientY, px, py);
		if(dist < this.circleRadius * this.game.canvasSize.min)
			this.held = true;
	}
};

HoldRitual.prototype.circleRadius = 0.075;

HoldRitual.prototype.isFulfilled = function() {
	return this.held;
};

HoldRitual.prototype.draw = function(ctx, canvasSize) {
	var radPix = this.circleRadius * canvasSize.min;

	var self = this;

	ctx.sr(function() {	
		ctx.beginPath();
		ctx.fillStyle = self.held ? 'white' : 'black';
		ctx.arc(self.x * canvasSize.w, self.y * canvasSize.h, radPix, 0, 2 * Math.PI, false);
		ctx.fill();
	});
};

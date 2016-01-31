function PinRitual() {
	Ritual.apply(this, arguments);

	this.touchBound = this.touch.bind(this);

	this.offset = 1;
	this.angle = this.config.angle;

	this.held = false;
}

PinRitual.prototype = Object.create(Ritual.prototype);

PinRitual.prototype.activate = function() {
	Ritual.prototype.activate.apply(this, arguments);
	['touchstart', 'touchend', 'touchmove'].forEach(function(type) {
		this.game.canvas.addEventListener(type, this.touchBound);
	}, this);
};

PinRitual.prototype.destroy = function() {
	Ritual.prototype.destroy.apply(this, arguments);
	['touchstart', 'touchend', 'touchmove'].forEach(function(type) {
		this.game.canvas.removeEventListener(type, this.touchBound);
	}, this);
};

PinRitual.prototype.isFulfilled = function() {
	return this.offset == 0;
};

PinRitual.prototype.headRadius = 0.01;
PinRitual.prototype.outerRadius = 0.8;
PinRitual.prototype.innerRadius = 0.08;
PinRitual.prototype.tolerance = 0.03;

PinRitual.prototype.draw = function(ctx, canvasSize) {
	var innerRadius = canvasSize.min * this.innerRadius / 2;
	var outerRadius = canvasSize.min * this.outerRadius / 2;
	
	var pinLength = (outerRadius - innerRadius) / 3;

	var insertionDistance = pinLength / 3;

	var actualOuterRadius = this.offset * (outerRadius - innerRadius) + innerRadius;

	var self = this;
	ctx.sr(function() {
		ctx.lineWidth = 4;
		ctx.translate(canvasSize.w/2, canvasSize.h/2)
		ctx.rotate(self.angle / 180 * Math.PI);
		ctx.beginPath();
		ctx.moveTo(actualOuterRadius + insertionDistance, 0);
		ctx.lineTo(Math.max(innerRadius, actualOuterRadius - pinLength), 0);
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
		ctx.stroke();
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;
		ctx.stroke();

		ctx.beginPath();
		ctx.arc(actualOuterRadius + insertionDistance, 0, self.headRadius * canvasSize.min * 2, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
		ctx.fill();
		ctx.beginPath();
		ctx.arc(actualOuterRadius + insertionDistance, 0, self.headRadius * canvasSize.min, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'black';
		ctx.fill();
	});
};

PinRitual.prototype.touch = function(e) {
	if(e.type == 'touchend') {
		this.held = false;
		return;
	}

	var innerRadius = this.game.canvasSize.min * this.innerRadius / 2;
	var outerRadius = this.game.canvasSize.min * this.outerRadius / 2;
	
	var pinLength = (outerRadius - innerRadius) / 3;
	var rads = this.angle / 180 * Math.PI;

	var insertionDistance = pinLength / 3;
	var actualOuterRadius = this.offset * (outerRadius - innerRadius) + innerRadius + insertionDistance;

	var x = e.touches[0].clientX - game.canvasSize.w/2;
	var y = e.touches[0].clientY - game.canvasSize.h/2;

	var tx = x * Math.cos(rads) + y * Math.sin(rads);
	var ty = x * Math.sin(rads) - y * Math.cos(rads);

	var dist = distance(tx, ty, actualOuterRadius, 0);

	var isInRange = dist < this.tolerance * this.game.canvasSize.min;

	if(e.type == 'touchstart' && isInRange)
		this.held = true;

	if(this.held)
		this.offset = Math.max(Math.min(1, 2 * tx / this.game.canvasSize.min), 0);
};

function RotationRitual(game, config) {
	Ritual.apply(this, arguments);
	this.targetAngle = config.targetAngle;
	this.actualAngle = 0;

	this.orientedBound = this.oriented.bind(this);

	this.axis = localStorage.getItem('axis') || 'gamma';

	this.heldSeconds = 0;
}

RotationRitual.prototype = Object.create(Ritual.prototype);

RotationRitual.prototype.activate = function() {
	Ritual.prototype.activate.apply(this, arguments);
	addEventListener('deviceorientation', this.orientedBound);
};

RotationRitual.prototype.tolerance = 2.5;
RotationRitual.prototype.targetSeconds = 1;

RotationRitual.prototype.tick = function(dt) {
	Ritual.prototype.tick.apply(this, arguments);

	if(!this.active)
		return;

	if(Math.abs(this.targetAngle - this.actualAngle) < this.tolerance)
		this.heldSeconds += dt / 1000;
	else
		this.heldSeconds = Math.max(0, this.heldSeconds - dt / 300);
};

RotationRitual.prototype.isFulfilled = function() {
	return this.heldSeconds >= this.targetSeconds;
};

RotationRitual.prototype.oriented = function(e) {
	this.actualAngle = e[this.axis];
	while(this.actualAngle > 180)
		this.actualAngle -= 360;
	while(this.actualAngle < -360)
		this.actualAngle += 360;
};

RotationRitual.prototype.draw = function(ctx, canvasSize) {
	var self = this;

	var r = canvasSize.min * 0.4;

	var shakeMagnitude = canvasSize.min * 0.01 * this.heldSeconds / this.targetSeconds;
	var shakeAngle = Math.random() * 2 * Math.PI;
	var shakeX = Math.cos(shakeAngle) * shakeMagnitude;
	var shakeY = Math.sin(shakeAngle) * shakeMagnitude;

	ctx.sr(function() {
		ctx.beginPath();

		ctx.lineWidth = 2;

		ctx.translate(canvasSize.w / 2, canvasSize.h / 2);
		ctx.arc(shakeX, shakeY, r, 0, 2 * Math.PI, false);
		ctx.stroke();

		shakeAngle = Math.random() * 2 * Math.PI;
		shakeX = Math.cos(shakeAngle) * shakeMagnitude;
		shakeY = Math.sin(shakeAngle) * shakeMagnitude;

		ctx.beginPath();
		for(var i = 0; i < 6; i++) {
			var angle = (4 * i + 0.5) * Math.PI/5 - (self.targetAngle / 180 * Math.PI);
			var x = Math.cos(angle) * r;
			var y = Math.sin(angle) * r;
			ctx.lineTo(x + shakeX, y + shakeY);
		}
		ctx.stroke();

		shakeAngle = Math.random() * 2 * Math.PI;
		shakeX = Math.cos(shakeAngle) * shakeMagnitude;
		shakeY = Math.sin(shakeAngle) * shakeMagnitude;

		ctx.beginPath();
		ctx.strokeStyle = '#800';
		for(var i = 0; i < 6; i++) {
			var angle = (4 * i + 0.5) * Math.PI/5 - (self.actualAngle / 180 * Math.PI);
			var x = Math.cos(angle) * r;
			var y = Math.sin(angle) * r;
			ctx.lineTo(x + shakeX, y + shakeY);
		}
		ctx.stroke();
	});
};

RotationRitual.prototype.destroy = function() {
	Ritual.prototype.destroy.apply(this, arguments);
	removeEventListener('deviceorientation', this.orientedBound);
};

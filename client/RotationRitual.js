var summoningCircle = document.createElement('img');
summoningCircle.src = 'images/summoning-circle.png';

var rotationSound = document.createElement('audio');
rotationSound.src = 'sounds/white-noise.ogg';

function RotationRitual(game, config) {
	Ritual.apply(this, arguments);
	this.targetAngle = Math.random() * 100 - 50;
	this.actualAngle = 0;

	this.orientedBound = this.oriented.bind(this);

	this.axis = localStorage.getItem('axis') || 'gamma';

	this.heldSeconds = 0;

	this.sound = rotationSound.cloneNode();

	addEventListener('deviceorientation', this.orientedBound);
}

RotationRitual.prototype = Object.create(Ritual.prototype);

RotationRitual.prototype.tolerance = 2.5;
RotationRitual.prototype.targetSeconds = 1;

RotationRitual.prototype.tick = function(dt) {
	Ritual.prototype.tick.apply(this, arguments);

	if(Math.abs(this.targetAngle - this.actualAngle) < this.tolerance) {
		if(this.heldSeconds == 0)
			this.sound.play();
		this.heldSeconds += dt / 1000;
	}
	else {
		this.heldSeconds = Math.max(0, this.heldSeconds - dt / 300);
		if(this.sound.currentTime) {
			this.sound.pause()
			this.sound.currentTime = 0;
		}
	}
};

RotationRitual.prototype.reset = function() {
	this.targetAngle = Math.random() * 100 - 50;
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

	if(!summoningCircle.width)
		return;

	var r = canvasSize.min * 0.8;
	var imageSize = summoningCircle.width;
	var scale = r / imageSize;

	var shakeMagnitude = canvasSize.min * 0.01 * this.heldSeconds / this.targetSeconds;
	var shakeAngle = Math.random() * 2 * Math.PI;
	var shakeX = Math.cos(shakeAngle) * shakeMagnitude;
	var shakeY = Math.sin(shakeAngle) * shakeMagnitude;

	ctx.sr(function() {
		ctx.translate(canvasSize.w / 2, canvasSize.h / 2);
		ctx.rotate(self.targetAngle / 180 * Math.PI);
		ctx.drawImage(summoningCircle, shakeX - imageSize * scale * 0.5, shakeY - imageSize * scale * 0.5, imageSize * scale, imageSize * scale);
		ctx.rotate(-self.targetAngle / 180 * Math.PI);
		ctx.rotate(self.actualAngle / 180 * Math.PI);
		ctx.drawImage(summoningCircle, shakeX - imageSize * scale * 0.5, shakeY - imageSize * scale * 0.5, imageSize * scale, imageSize * scale);
	});

};

RotationRitual.prototype.destroy = function() {
	Ritual.prototype.destroy.apply(this, arguments);
	removeEventListener('deviceorientation', this.orientedBound);
};

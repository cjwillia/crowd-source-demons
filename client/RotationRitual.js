function RotationRitual(game, targetAngle) {
	Ritual.apply(this, arguments);
	this.targetAngle = targetAngle;

	this.orientedBound = this.oriented.bind(this);

	addEventListener('deviceorientation', this.orientedBound);
}

RotationRitual.prototype = Object.create(Ritual.prototype);

RotationRitual.prototype.oriented = function(e) {
	this.lastE = e;
};

RotationRitual.prototype.draw = function(ctx, canvasSize) {
	var self = this;
	if(!this.lastE)
		return;

	ctx.sr(function() {
		ctx.font = '24px sans-serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'center';
		ctx.fillText([self.lastE.alpha, self.lastE.beta, self.lastE.gamma].map(Math.round).join(', '), canvasSize.w/2, canvasSize.h/2 );
	});
}

RotationRitual.prototype.destroy = function() {
	Ritual.prototype.destroy.apply(this, arguments);
	removeEventListener('deviceorientation', this.orientedBound);
};

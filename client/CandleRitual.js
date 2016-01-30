var candleSound = document.createElement('audio');
candleSound.src = 'sounds/candle.ogg';

function CandleRitual() {
	Ritual.apply(this, arguments);
	this.x = this.config.x;
	this.y = this.config.y;

	this.lit = false;

	this.sound = candleSound.cloneNode();

	this.touchBound = this.touch.bind(this);
}

CandleRitual.prototype = Object.create(Ritual.prototype);

CandleRitual.prototype.circleRadius = 0.05;
CandleRitual.prototype.width = 0.04;
CandleRitual.prototype.height = 0.1;
CandleRitual.prototype.wickWidth = 0.01;
CandleRitual.prototype.wickHeight = 0.02;

CandleRitual.prototype.activate = function() {
	Ritual.prototype.activate.apply(this, arguments);
	this.game.canvas.addEventListener('touchstart', this.touchBound);
};

CandleRitual.prototype.isFulfilled = function() {
	return this.lit;
};

CandleRitual.prototype.touch = function(e) {
	if(this.lit)
		return;

	for(var i = 0; i < e.touches.length; i++) {
		var touch = e.touches[i];
		var xpct = touch.clientX / this.owner.game.canvasSize.w;
		var ypct = touch.clientY / this.owner.game.canvasSize.h;
		var dist = distance(xpct, ypct, this.x, this.y);
		if(dist < this.circleRadius) {
			this.lit = true;
			this.sound.play();
		}
	}
};

CandleRitual.prototype.draw = function(ctx, canvasSize) {
	var radPix = this.circleRadius * canvasSize.min;
	var widthPix = this.width * canvasSize.min;
	var heightPix = this.height * canvasSize.min;

	var self = this;

	ctx.sr(function() {	

		//body
		ctx.beginPath();
		ctx.fillStyle = '#F88';
		ctx.fillRect(self.x * canvasSize.w - widthPix/2, self.y * canvasSize.h, widthPix, heightPix);
		ctx.fill();

		//wick
		ctx.beginPath();
		ctx.fillStyle = '#787878';
		ctx.fillRect(self.x * canvasSize.w - self.wickWidth * canvasSize.min / 2,
			self.y * canvasSize.h - self.wickHeight * canvasSize.min,
			self.wickWidth * canvasSize.min, self.wickHeight * canvasSize.min);
		ctx.fill();

		if(self.lit) {
			ctx.beginPath();
			ctx.fillStyle = 'white';
			ctx.arc(self.x * canvasSize.w, self.y * canvasSize.h, radPix, 0, 2 * Math.PI, false);
			ctx.fill();
		}
	});
};

CandleRitual.prototype.destroy = function() {
	Ritual.prototype.destroy.apply(this, arguments);
	this.game.canvas.removeEventListener('touchstart', this.touchBound);
};

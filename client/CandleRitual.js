var candleSound = document.createElement('audio');
candleSound.src = 'sounds/candle.ogg';

var unlitImage = document.createElement('img');
unlitImage.src = 'images/candle-unlit.png';

var litImage = document.createElement('img');
litImage.src = 'images/candle-lit.png';

function CandleRitual() {
	Ritual.apply(this, arguments);
	this.x = Math.random();
	this.y = Math.random();

	this.lit = false;

	this.sound = candleSound.cloneNode();

	this.touchBound = this.touch.bind(this);

	this.game.canvas.addEventListener('touchstart', this.touchBound);
}

CandleRitual.prototype = Object.create(Ritual.prototype);

CandleRitual.prototype.circleRadius = 0.05;
CandleRitual.prototype.width = 0.04;
CandleRitual.prototype.height = 0.1;
CandleRitual.prototype.wickWidth = 0.01;
CandleRitual.prototype.wickHeight = 0.02;

CandleRitual.prototype.isFulfilled = function() {
	return this.lit;
};

CandleRitual.prototype.touch = function(e) {
	if(this.lit)
		return;

	for(var i = 0; i < e.touches.length; i++) {
		var touch = e.touches[i];
		var xpct = touch.clientX / this.game.canvasSize.w;
		var ypct = touch.clientY / this.game.canvasSize.h;
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
	if(this.lit) {
		ctx.sr(function() {
			ctx.fillStyle = 'white';
			ctx.arc(self.x * canvasSize.w, self.y * canvasSize.h, 16, 0, 2 * Math.PI, false);
			ctx.fill();
		});
	}

	ctx.drawImage(this.lit ? litImage : unlitImage, this.x * canvasSize.w - 19, this.y * canvasSize.h - 6);
};

CandleRitual.prototype.reset = function() {
	Ritual.prototype.reset.apply(this, arguments);
	this.x = Math.random();
	this.y = Math.random();
	this.lit = false;
};

CandleRitual.prototype.destroy = function() {
	Ritual.prototype.destroy.apply(this, arguments);
	this.game.canvas.removeEventListener('touchstart', this.touchBound);
};

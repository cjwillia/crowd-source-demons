function CandleRitual(game, config) {
	Ritual.apply(this, arguments);
	this.candles = [];

	for(var i = 0; i < this.config.count; i++) {
		var candle = new Candle(Math.random(), Math.random())
		candle.owner = this;
		this.candles.push(candle);
	}

	this.touchBound = this.touch.bind(this);

}

CandleRitual.prototype = Object.create(Ritual.prototype);

CandleRitual.prototype.activate = function() {
	Ritual.prototype.activate.apply(this, arguments);
	game.canvas.addEventListener('touchstart', this.touchBound);
}

CandleRitual.prototype.draw = function() {
	for(var i = 0; i < this.candles.length; i++) {
		var candle = this.candles[i];
		candle.draw.apply(candle, arguments);
	}
};

CandleRitual.prototype.isFulfilled = function() {
	for(var i = 0; i < this.candles.length; i++)
		if(!this.candles[i].lit)
			return false;
	return true;
};

CandleRitual.prototype.touch = function() {
	for(var i = 0; i < this.candles.length; i++)
		this.candles[i].touch.apply(this.candles[i], arguments);
}

CandleRitual.prototype.destroy = function() {
	Ritual.prototype.destroy.apply(this, arguments);
	this.game.canvas.removeEventListener('touchstart', this.touchBound);
}

var candleSound = document.createElement('audio');
candleSound.src = 'sounds/candle.ogg';

function Candle(x, y) {
	this.x = x;
	this.y = y;

	this.lit = false;

	this.sound = candleSound.cloneNode();
}

Candle.prototype.circleRadius = 0.05;
Candle.prototype.width = 0.04;
Candle.prototype.height = 0.1;
Candle.prototype.wickWidth = 0.01;
Candle.prototype.wickHeight = 0.02;

Candle.prototype.touch = function(e) {
	if(this.lit)
		return;

	for(var i = 0; i < e.touches.length; i++) {
		var touch = e.touches[i];
		var xpct = touch.clientX / this.owner.game.canvasSize.w;
		var ypct = touch.clientY / this.owner.game.canvasSize.h;
		var dist = Math.sqrt(Math.pow(xpct - this.x, 2) + Math.pow(ypct - this.y, 2));
		if(dist < this.circleRadius) {
			this.lit = true;
			this.sound.play();
		}
	}
};

Candle.prototype.draw = function(ctx, canvasSize) {
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

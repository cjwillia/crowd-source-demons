function CandleRitual(id) {
	Ritual.apply(this, arguments);
	this.candles = [];

	for(var i = 0; i < 5; i++)
		this.candles.push(new Candle(Math.random(), Math.random()));
	
}

CandleRitual.prototype = Object.create(Ritual.prototype);

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


function Candle(x, y) {
	this.x = x;
	this.y = y;

	this.lit = false;
}

Candle.prototype.circleRadius = 0.05;

Candle.prototype.draw = function(ctx) {
	
};

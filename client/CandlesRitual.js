function CandlesRitual(game, config) {
	MetaRitual.apply(this, arguments);

	for(var i = 0; i < this.config.count; i++) {
		var candle = new CandleRitual(game, {x: Math.random(), y: Math.random()});
		candle.owner = this;
		this.subrituals.push(candle);
	}
}

CandlesRitual.prototype = Object.create(MetaRitual.prototype);


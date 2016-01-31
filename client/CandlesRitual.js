function CandlesRitual(game, config) {
	MetaRitual.apply(this, arguments);

	for(var i = 0; i < this.config.count; i++)
		this.subrituals.push(new CandleRitual(game));
}

CandlesRitual.prototype = Object.create(MetaRitual.prototype);

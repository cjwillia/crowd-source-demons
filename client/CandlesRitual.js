function CandlesRitual(game, config) {
	MetaRitual.apply(this, arguments);

	for(var i = 0; i < this.config.count; i++)
		this.subrituals.push(new CandleRitual(game, {x: Math.random(), y: Math.random()}));
}

CandlesRitual.prototype = Object.create(MetaRitual.prototype);

CandlesRitual.prototype.reset = function() {
	this.subrituals = this.subrituals.map(function(existing) {
		existing.destroy();
		return new CandleRitual(this.game, {x: Math.random(), y: Math.random()});
	}, this);
};

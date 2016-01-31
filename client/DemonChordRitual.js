function DemonChordRitual(game, config) {
	MetaRitual.apply(this, arguments);

	for(var i = 0; i < this.config.count; i++)
		this.subrituals.push(new HoldRitual(game, {x: Math.random(), y: Math.random(), soundIndex: i}));
}

DemonChordRitual.prototype = Object.create(MetaRitual.prototype);

DemonChordRitual.prototype.tick = function() {
	MetaRitual.prototype.tick.apply(this, arguments);

	var previousFulfilled = true;
	for(var i = 0; i < this.subrituals.length; i++) {
		this.subrituals[i].showing = previousFulfilled;
		previousFulfilled = this.subrituals[i].isFulfilled();
	}
};

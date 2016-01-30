function DemonChordRitual(game, config) {
	MetaRitual.apply(this, arguments);

	for(var i = 0; i < this.config.count; i++) {
		var hold = new HoldRitual(game, {x: Math.random(), y: Math.random()});
		hold.owner = this;
		this.subrituals.push(hold);
	}
}

DemonChordRitual.prototype = Object.create(MetaRitual.prototype);

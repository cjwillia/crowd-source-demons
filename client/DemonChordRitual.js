function DemonChordRitual(game, config) {
	MetaRitual.apply(this, arguments);

	for(var i = 0; i < this.config.count; i++)
		this.subrituals.push(new HoldRitual(game, {x: Math.random(), y: Math.random()}));
}

DemonChordRitual.prototype = Object.create(MetaRitual.prototype);

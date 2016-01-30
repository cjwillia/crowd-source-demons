function VoodooRitual() {
	MetaRitual.apply(this, arguments);

	for(var i = 0; i < this.config.count; i++)
		this.subrituals.push(new PinRitual(game, {angle: Math.random() * 2 * Math.PI}));
}

VoodooRitual.prototype = Object.create(MetaRitual.prototype);

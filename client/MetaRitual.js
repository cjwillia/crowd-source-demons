function MetaRitual(game, config) {
	Ritual.apply(this, arguments);
	this.subrituals = [];
}

MetaRitual.prototype = Object.create(Ritual.prototype);

MetaRitual.prototype.isFulfilled = function() {
	for(var i = 0; i < this.subrituals.length; i++)
		if(!this.subrituals[i].isFulfilled())
			return false;
	return true;
};

MetaRitual.prototype.destroy = function() {
	Ritual.prototype.destroy.apply(this, arguments);

	this.subrituals.forEach(function(sr) {
		sr.destroy.apply(sr, arguments);
	});
};

MetaRitual.prototype.tick = function() {
	for(var i = 0; i < this.subrituals.length; i++)
		this.subrituals[i].tick.apply(this.subrituals[i], arguments);
};

MetaRitual.prototype.draw = function() {
	for(var i = 0; i < this.subrituals.length; i++)
		this.subrituals[i].draw.apply(this.subrituals[i], arguments);
};

MetaRitual.prototype.reset = function() {
	this.subrituals.forEach(function(sr) {
		sr.reset.apply(sr, arguments);
	});
};

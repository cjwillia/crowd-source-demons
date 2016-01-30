function TypingRitual(game, config) {
	Ritual.apply(this, arguments);
	this.incantation = config.incantation;

	this.label = document.createElement('label');
	this.input = document.createElement('input');
	this.label.innerText = config.incantation;
	this.label.appendChild(this.input);
}

TypingRitual.prototype = Object.create(Ritual.prototype);

TypingRitual.prototype.activate = function() {
	Ritual.prototype.activate.apply(this, arguments);
	document.body.appendChild(this.label);
};

TypingRitual.prototype.destroy = function() {
	Ritual.prototype.destroy.apply(this, arguments);
	if(this.label.parentNode)
		this.label.parentNode.removeChild(this.label);
};

TypingRitual.prototype.isFulfilled = function() {
	return this.input.value.toLowerCase() == this.incantation.toLowerCase();
};

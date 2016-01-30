function TypingRitual(thingToType) {
	Ritual.apply(this, arguments);
	this.thingToType = thingToType;

	this.label = document.createElement('label');
	this.input = document.createElement('input');
	this.label.innerText = thingToType;
	this.label.appendChild(this.input);
	document.body.appendChild(this.label);
}

TypingRitual.prototype = Object.create(Ritual.prototype);

TypingRitual.prototype.destroy = function() {
	Ritual.prototype.destroy.apply(this, arguments);
	document.body.removeChild(this.label);
};

TypingRitual.prototype.isFulfilled = function() {
	return this.input.value.toLowerCase() == this.thingToType.toLowerCase();
};

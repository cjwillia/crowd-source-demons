function PinRitual() {
	Ritual.apply(this, arguments);
}

PinRitual.prototype = Object.create(Ritual.prototype);

PinRitual.prototype.isFulfilled = function() {
	return false;
};

PinRitual.prototype.touch = function(e) {
	
};

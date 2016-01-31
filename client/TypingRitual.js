var incantations = [
	'voihs verath juev',
	'weh diavolos gozn',
	'hsiug suhvn vwegt',
	'ziurth dios nefyh',
	'gnhcal oihs vgnvo',
	'zij e ghoe duwang'
];

var translations = [
	'I summon theee',
	'Come devil\'s servant',
	'Release your wrath',
	'Curse God\'s name',
	'Hear my call',
	'What a beautiful duwang'
];

function TypingRitual(game, config) {
	Ritual.apply(this, arguments);
	this.incantation = config.incantation;

	this.label = document.createElement('label');
	this.input = document.createElement('input');
	this.labelText = document.createElement('div');
	this.label.appendChild(this.labelText);
	this.label.appendChild(this.input);
	document.body.appendChild(this.label);

	this.pickIncantation();
}

TypingRitual.prototype = Object.create(Ritual.prototype);

TypingRitual.prototype.pickIncantation = function() {
	var index = Math.floor(Math.random() * incantations.length);
	this.incantation = incantations[index];
	this.translation = translations[index];
	this.config.incantation = this.incantation;
	this.config.translation = this.translation;
	this.labelText.innerText = this.incantation;
};

TypingRitual.prototype.reset = function() {
	this.pickIncantation();
	this.input.value = '';
};

TypingRitual.prototype.destroy = function() {
	Ritual.prototype.destroy.apply(this, arguments);
	if(this.label.parentNode)
		this.label.parentNode.removeChild(this.label);
};

TypingRitual.prototype.isFulfilled = function() {
	return this.input.value.toLowerCase() == this.incantation.toLowerCase();
};

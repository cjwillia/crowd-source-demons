function Ritual(game, config) {
	this.game = game;
	this.config = config;
	this.active = false;
}

Ritual.prototype.activate = function() {
	this.active = true;
};

Ritual.prototype.tick = function(ts) {

};

Ritual.prototype.draw = function(ctx, canvasSize) {

};

Ritual.prototype.isFulfilled = function() {
	return false;
};

Ritual.prototype.destroy = function() {

};

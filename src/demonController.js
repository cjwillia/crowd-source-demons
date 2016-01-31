function DemonController(name) {
    this.name = name;
	this.score = 0;
	this.health = 100;
    this.level = 1;
	this.nextLevel = 5;
    this.rituals_observed = 0;
}

DemonController.prototype.getStrength = function() {
	return 25 * this.level;
};

DemonController.prototype.observeRitual = function(ritual) {
	this.rituals_observed += 1;
	this.score += ritual.value;
	while(this.score > this.nextLevel)
		this.levelUp();
};

DemonController.prototype.levelUp = function() {
	this.level++;
	console.log("leveling up");
	this.nextLevel += 5 + 2 * Math.pow(this.level - 2, 2);
	this.health = 100 * this.level;
}

module.exports = DemonController;

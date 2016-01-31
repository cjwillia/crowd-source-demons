function DemonController(name) {
    this.name = name;
    this.level = 0;
    this.rituals_observed = 0;
}

DemonController.prototype.observeRitual = function(ritual) {
	var changes = getChangesFromRitual(ritual);
	this.level += changes.level;
	this.rituals_observed += 1;
};

function getChangesFromRitual(ritual) {
    return { level: ritual.value, };
}

module.exports = DemonController;

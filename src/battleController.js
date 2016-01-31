function BattleController(demon1, demon2, callback) {
	console.log("NEW BATTLE CONTROLLER");
	this.demons = [demon1, demon2];
	if(demon1.level < demon2.level)
		this.swap();
	this.turn = 0;
	this.callback = callback;
}

BattleController.prototype.tick = function() {
	var miss = Math.random() < 0.2;
	var phase = {
		attacker: this.demons[0],
		defender: this.demons[1],
		miss: true,
		damage: 0
	};

	if(!miss) {
		phase.miss = false;
		phase.damage = phase.attacker.getStrength();
		phase.defender.health = Math.max(0, phase.defender.health - phase.damage);
	}

	this.callback(phase);

	this.swap();
};

BattleController.prototype.swap = function() {
	this.demons.push(this.demons.shift());
};

module.exports = BattleController;

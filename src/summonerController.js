function SummonerController(name, socket) {
    this.name = name;
    this.score = 0;
    this.socket = socket;
}

SummonerController.prototype.toJSON = function() {
	return {
		name: this.name,
		score: this.score
	};
}

module.exports = SummonerController;

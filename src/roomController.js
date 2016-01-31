var rituals = [
	{type: 'RotationRitual', value: 1},
	{type: 'VoodooRitual', count: 4, value: 1},
	{type: 'DemonChordRitual', count: 4, value: 1},
	{type: 'TypingRitual', value: 1},
	{type: 'CandlesRitual', count: 5, value: 1}
];

function RoomController(broadcast) {
	this.broadcast = broadcast;
    this.summoner_count = 0;
	this.current_ritual = null;
    this.teams = {
        left: {
            summoners: [],
            demons: []
        },
        right: {
            summoners: [],
            demons: []
        }
    };
    this.started = false;
}

RoomController.prototype.ritualInterval = 10000;

RoomController.prototype.addSummoner = function(summoner) {
    pickATeamAndAdd(summoner, this);
    this.summoner_count += 1;
	this.broadcast('newritual', this.current_ritual, [summoner.socket]);
	console.log("Summoners: "+this.summoner_count);
};

function pickATeamAndAdd(summoner, that) {
    if(that.teams.left.summoners.length > that.teams.right.summoners.length)
        that.teams.right.summoners.push(summoner);
    else
        that.teams.left.summoners.push(summoner);
}

RoomController.prototype.removeSummoner = function(summoner) {
    this.summoner_count -= findAndRemoveSummoner(summoner, this);
};

function findAndRemoveSummoner(summoner, that) {
    var res = 0;
    var leftTeamIndex = that.teams.left.summoners.indexOf(summoner);
    var rightTeamIndex = that.teams.right.summoners.indexOf(summoner);

    if(leftTeamIndex !== -1) {
        that.teams.left.summoners.splice(leftTeamIndex, 0);
        res++;
    }
    if(rightTeamIndex !== -1) {
        that.teams.right.summoners.splice(rightTeamIndex, 0);
        res++;
    }

    return res;
}

RoomController.prototype.addDemon = function(demon, team) {
    var receiving_team;
    switch(team) {
        case "left":
            receiving_team = this.teams.left;
            break;
        case "right":
            receiving_team = this.teams.right;
            break;
    }

    receiving_team.demons.push(demon);
};

RoomController.prototype.getAllSummoners = function() {
    return this.teams.left.summoners.concat(this.teams.right.summoners);
};

RoomController.prototype.readyToStart = function() {
    return this.teams.left.summoners.length && this.teams.right.summoners.length;
};

RoomController.prototype.startGame = function(demons) {
    this.teams.left.demons.push(demons.pop());
    this.teams.right.demons.push(demons.pop());
    this.started = true;
	this.pickRitual();
};

RoomController.prototype.stopGame = function() {
	this.started = false;
	this.setRitual(null);
}

RoomController.prototype.pickRitual = function() {
	if(this.started) {
		var i = Math.floor(Math.random() * rituals.length);
		this.setRitual(rituals[i]);
		setTimeout(this.pickRitual.bind(this), this.ritualInterval)
	}
};

RoomController.prototype.setRitual = function(r) {
	this.current_ritual = r;
	this.broadcast('newritual', this.current_ritual);
};

RoomController.prototype.ritualObserved = function(ritual, ws) {
	[this.teams.left, this.teams.right].forEach(function(team) {
		team.summoners.forEach(function(summoner) {
			if(summoner.socket == ws) {
				summoner.score += ritual.value;
				team.demons[0].observeRitual(ritual);
				this.broadcast('teaminfo', this.teams);
				console.log(JSON.stringify(this.teams, null, 2));
			}
		}, this);
	}, this);
};

module.exports = RoomController;

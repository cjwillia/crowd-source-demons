const BattleController = require('./battleController.js');
var rituals = [
	{type: 'RotationRitual', value: 3},
	{type: 'VoodooRitual', count: 4, value: 3},
	{type: 'DemonChordRitual', count: 4, value: 5},
	{type: 'TypingRitual', value: 8},
	{type: 'CandlesRitual', count: 5, value: 1}
];

function RoomController(broadcast, gameDuration) {
	this.broadcast = broadcast;
	this.time_remaining = gameDuration;
	this.current_ritual = null;
    this.teams = {
        left: {
            summoners: [],
            demon: null
        },
        right: {
            summoners: [],
            demon: null
        }
    };
    this.playing = false;
	this.battleController = false;
}

RoomController.prototype.tick = function() {
	var now = new Date();

	if(this.battleController) {
		console.log("Ticking battle controller");
		this.battleController.tick();
		if(this.teams.left.demon.health && this.teams.right.demon.health)
			setTimeout(this.tick.bind(this), 3000);
		else
			console.log("Some demon died :(");
	}
	else {
		if(this.playing && this.last_tick) {
			this.time_remaining = Math.max(0, this.time_remaining - (now - this.last_tick));
			this.broadcast('tick', {time_remaining: this.time_remaining});
			if(!this.time_remaining) {
				this.stopGame();
				this.battleController = new BattleController(this.teams.left.demon, this.teams.right.demon, this.attackHappened.bind(this));
				setTimeout(this.tick.bind(this), 3000);
			}
		}

		if(this.playing)
			setTimeout(this.tick.bind(this), 1000);

	}

	console.log(this.time_remaining);

	this.last_tick = now;
};

RoomController.prototype.attackHappened = function(phase) {
	console.log(phase);
	this.broadcast('attack', phase);
	if(!phase.miss)
		this.broadcast('teaminfo', this.teams);
}

RoomController.prototype.ritualInterval = 20000;

RoomController.prototype.addSummoner = function(summoner) {
	pickATeamAndAdd(summoner, this);
	this.broadcast('newritual', this.current_ritual, [summoner.socket]);
	this.broadcast('teaminfo', this.teams);
	this.broadcast('joined', {}, [summoner.socket]);
	console.log("Summoners: "+this.getAllSummoners().length);
};

function pickATeamAndAdd(summoner, that) {
    if(that.teams.left.summoners.length > that.teams.right.summoners.length)
        that.teams.right.summoners.push(summoner);
    else
        that.teams.left.summoners.push(summoner);
}

RoomController.prototype.removeSummoner = function(summoner) {
    findAndRemoveSummoner(summoner, this);
};

function findAndRemoveSummoner(summoner, that) {
    var leftTeamIndex = that.teams.left.summoners.indexOf(summoner);
    var rightTeamIndex = that.teams.right.summoners.indexOf(summoner);

    if(leftTeamIndex !== -1)
        that.teams.left.summoners.splice(leftTeamIndex, 0);

    if(rightTeamIndex !== -1)
        that.teams.right.summoners.splice(rightTeamIndex, 0);
}

RoomController.prototype.getAllSummoners = function() {
    return this.teams.left.summoners.concat(this.teams.right.summoners);
};

RoomController.prototype.getAllSockets = function() {
	return this.getAllSummoners().map(function(s) {return s.socket;});
}

RoomController.prototype.readyToStart = function() {
	return true;
    return this.teams.left.summoners.length && this.teams.right.summoners.length;
};

RoomController.prototype.startGame = function(demons) {
	if(this.playing)
		return;

    this.teams.left.demon = demons.pop();
    this.teams.right.demon = demons.pop();
    this.playing = true;
	this.pickRitual();
	this.broadcast('gamestarted',{num_players: this.getAllSummoners().length});
	this.last_tick = null;
	this.tick();
};

RoomController.prototype.stopGame = function() {
	this.playing = false;
	this.setRitual(null);
}

RoomController.prototype.pickRitual = function() {
	if(this.playing) {
		var i = Math.floor(Math.random() * rituals.length);
		this.setRitual(rituals[i]);
		setTimeout(this.pickRitual.bind(this), this.ritualInterval)
	}
};

RoomController.prototype.setRitual = function(r) {
	this.current_ritual = r;
	this.broadcast('newritual', this.current_ritual, this.getAllSockets());
};

RoomController.prototype.ritualObserved = function(ritual, ws) {
	[this.teams.left, this.teams.right].forEach(function(team) {
		team.summoners.forEach(function(summoner) {
			if(summoner.socket == ws) {
				summoner.score += ritual.value;
				team.demon.observeRitual(ritual);
				this.broadcast('teaminfo', this.teams);
				console.log(JSON.stringify(this.teams, null, 2));
			}
		}, this);
	}, this);
};

module.exports = RoomController;

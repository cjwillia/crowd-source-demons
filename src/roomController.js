function RoomController() {
    this.summoner_count = 0;
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
}

RoomController.prototype.addSummoner = function(summoner) {
    pickATeamAndAdd(summoner, this);
    this.summoner_count += 1;
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

module.exports = RoomController;

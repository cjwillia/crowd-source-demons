function DemonController(name, time) {
    this.name = name;
    this.level = 0;
    this.rituals_observed = 0;
    this.summoning_time = time;
}

DemonController.prototype.beginObservingRituals = function() {
    var this_demon = this;
    this.summoning = true;
    setTimeout(this_demon.stopObservingRituals, this.summoning_time);
};

DemonController.prototype.observeRitual = function(ritual) {
    if(this.summoning) {
        var changes = getChangesFromRitual(ritual);
        this.level = changes.level;
        this.rituals_observed += 1;
    }
};

DemonController.prototype.stopObservingRituals = function() {
    this.summoning = false;
};

function getChangesFromRitual(ritual) {
    // not implemented
    return {
        level: 1,
    };
}

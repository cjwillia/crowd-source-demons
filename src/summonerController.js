function SummonerController(name, socket) {
    this.name = name;
    this.score = 0;
    this.socket = socket;
}

module.exports = SummonerController;
